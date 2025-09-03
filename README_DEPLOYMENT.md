# Council 平台部署指南

## 🚀 Vercel 部署步骤

### 1. 准备环境变量

复制 `.env.example` 为 `.env.local` 并配置：

```bash
# 数据库配置（使用Vercel Postgres）
POSTGRES_URL="your_vercel_postgres_url"
POSTGRES_PRISMA_URL="your_vercel_postgres_prisma_url"
POSTGRES_URL_NO_SSL="your_vercel_postgres_url_no_ssl"
POSTGRES_URL_NON_POOLING="your_vercel_postgres_non_pooling_url"

# AI服务配置
AI_BASE_URL="https://api.openai.com"
AI_API_KEY="your_openai_api_key"
AI_MODEL="gpt-3.5-turbo"
```

### 2. 设置 Vercel Postgres

1. 在 Vercel 控制台创建 Postgres 数据库
2. 获取连接字符串
3. 在环境变量中配置数据库连接

### 3. 初始化数据库

使用 Vercel Postgres 控制台或运行：

```sql
-- 执行 scripts/init-db.sql 中的SQL语句
```

### 4. 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel --prod
```

或者通过 GitHub 连接自动部署。

## 🔧 环境变量说明

### 数据库变量（Vercel Postgres）
- `POSTGRES_URL`: 主数据库连接字符串
- `POSTGRES_PRISMA_URL`: Prisma格式连接字符串
- `POSTGRES_URL_NO_SSL`: 非SSL连接（开发用）
- `POSTGRES_URL_NON_POOLING`: 非池化连接

### AI服务变量
- `AI_BASE_URL`: AI API基础URL
- `AI_API_KEY`: AI服务API密钥
- `AI_MODEL`: 使用的AI模型名称

### 支持的AI提供商

#### OpenAI
```env
AI_BASE_URL=https://api.openai.com
AI_MODEL=gpt-3.5-turbo
```

#### DeepSeek
```env
AI_BASE_URL=https://api.deepseek.com
AI_MODEL=deepseek-chat
```

#### Moonshot
```env
AI_BASE_URL=https://api.moonshot.cn
AI_MODEL=moonshot-v1-8k
```

## 📊 数据库架构

项目使用以下表结构：

- `users`: 用户信息（简易会话管理）
- `topics`: 讨论话题
- `rounds`: 讨论轮次
- `comments`: 用户评论
- `summaries`: AI总结记录

## 🛠️ 开发命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 🔍 API端点

- `GET /api/topics` - 获取话题列表
- `POST /api/topics` - 创建新话题
- `GET /api/topics/[id]` - 获取话题详情
- `POST /api/rounds` - 管理讨论轮次
- `POST /api/comments` - 提交评论
- `POST /api/summary` - 生成AI总结

## 🚨 故障排除

### 数据库连接问题
1. 检查环境变量是否正确设置
2. 确认 Vercel Postgres 实例正常运行
3. 验证数据库表是否已初始化

### AI服务问题
1. 检查API密钥是否正确
2. 确认API端点可访问
3. 查看网络连接状态

### 部署问题
1. 检查构建日志中的错误信息
2. 确认所有环境变量已配置
3. 验证数据库迁移是否成功

## 📞 支持

如有部署问题，请检查：
1. Vercel 部署日志
2. 浏览器开发者工具控制台
3. 服务器端日志输出