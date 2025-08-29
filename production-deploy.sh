#!/bin/bash

# Council AI Platform - 生产环境专用部署脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查是否在生产环境
if [ "$NODE_ENV" != "production" ] && [ "$1" != "--force" ]; then
    warn "这不是生产环境！"
    echo "如果您确定要在当前环境部署，请使用: $0 --force"
    exit 1
fi

log "🚀 开始生产环境部署..."

# 1. 停止现有服务
log "1. 停止现有服务..."
if command -v pm2 &> /dev/null; then
    pm2 stop council-frontend 2>/dev/null || true
    pm2 delete council-frontend 2>/dev/null || true
    success "PM2服务已停止"
fi

# 杀死占用端口的进程
pkill -f "next start" 2>/dev/null || true
kill -9 $(lsof -t -i:3002) 2>/dev/null || true
success "端口清理完成"

# 2. 安装依赖
log "2. 安装依赖..."
npm install --legacy-peer-deps --production=false
success "依赖安装完成"

# 3. 构建生产版本
log "3. 构建生产版本..."
npx next build
success "构建完成"

# 4. 确保配置文件存在
log "4. 检查配置文件..."
if [ ! -f ".env.production" ]; then
    warn "生产环境配置文件不存在，创建默认配置"
    cat > .env.production << 'EOF'
# 生产环境配置
NODE_ENV=production
PORT=3002

# API配置
NEXT_PUBLIC_API_BASE_URL=http://council.zcanic.xyz:3001
NEXT_PUBLIC_WS_URL=ws://council.zcanic.xyz:3001
DISABLE_LOCAL_API=true

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=council
DB_USER=council
DB_PASSWORD=Council

# AI服务配置
AI_API_KEY=sk-d230b03ea566450bbdac5b0f97d5b7cd
AI_MODEL=deepseek-chat
AI_BASE_URL=https://api.deepseek.com
AI_TEMPERATURE=0.3
AI_MAX_TOKENS=100000

# JWT配置
JWT_SECRET=production_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# CORS配置
CORS_ORIGIN=http://council.zcanic.xyz:3002
EOF
    success "配置文件已创建"
else
    success "配置文件已存在"
fi

# 5. 确保PM2配置存在
if [ ! -f "ecosystem.config.js" ]; then
    warn "PM2配置文件不存在，创建默认配置"
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'council-frontend',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3002
    },
    error_file: './logs/council-frontend-err.log',
    out_file: './logs/council-frontend-out.log',
    log_file: './logs/council-frontend-combined.log',
    time: true
  }]
};
EOF
    success "PM2配置文件已创建"
fi

# 6. 创建日志目录
log "5. 创建日志目录..."
mkdir -p logs
success "日志目录已创建"

# 7. 启动服务
log "6. 启动服务..."
if command -v pm2 &> /dev/null; then
    pm2 start ecosystem.config.js --env production
    pm2 save
    pm2 startup 2>/dev/null || true
    success "服务已启动 (PM2)"
else
    npm start &
    success "服务已启动 (Node.js)"
fi

# 8. 等待服务启动
log "7. 等待服务启动..."
for i in {1..20}; do
    if curl -s http://localhost:3002/api/health >/dev/null 2>&1; then
        success "服务启动成功"
        break
    fi
    if [ $i -eq 20 ]; then
        error "服务启动超时"
        exit 1
    fi
    sleep 3
    echo -n "."
done

# 9. 验证部署
log "8. 验证部署..."
if curl -s http://localhost:3002 >/dev/null 2>&1; then
    success "应用可访问"
else
    warn "应用访问测试失败"
fi

if curl -s http://localhost:3002/api/health >/dev/null 2>&1; then
    success "API健康检查通过"
else
    warn "API健康检查失败"
fi

# 10. 显示部署信息
log "9. 部署信息:"
echo "========================"
echo "前端地址: http://council.zcanic.xyz:3002"
echo "本地访问: http://localhost:3002"
echo "API地址:  http://council.zcanic.xyz:3001"
echo ""
echo "管理命令:"
echo "  pm2 status              # 查看PM2状态"
echo "  pm2 logs council-frontend # 查看日志"
echo "  pm2 restart council-frontend # 重启服务"
echo ""

success "🎉 生产环境部署完成！"
echo ""
echo "📋 下一步:"
echo "1. 确保后端服务运行在3001端口"
echo "2. 访问 http://council.zcanic.xyz:3002 验证"
echo "3. 检查防火墙设置，确保3002端口开放"