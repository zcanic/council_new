#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始验证部署...\n');

// 检查必要的文件
try {
  const requiredFiles = [
    'package.json',
    'next.config.mjs', 
    'app/page.tsx',
    'data/mockData.ts',
    'types/index.ts'
  ];
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      throw new Error(`缺少必要文件: ${file}`);
    }
  });
  console.log('✅ 所有必要文件都存在');
} catch (error) {
  console.error('❌ 文件检查失败:', error.message);
  process.exit(1);
}

// 检查依赖安装
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = Object.keys(packageJson.dependencies || {});
  
  if (deps.length === 0) {
    throw new Error('没有安装依赖');
  }
  console.log(`✅ 已安装 ${deps.length} 个依赖`);
} catch (error) {
  console.error('❌ 依赖检查失败:', error.message);
  process.exit(1);
}

// 测试构建
try {
  console.log('\n🏗️  测试生产构建...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ 生产构建成功');
} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}

// 检查构建输出
try {
  const buildDir = '.next';
  if (!fs.existsSync(buildDir)) {
    throw new Error('构建目录不存在');
  }
  
  const requiredBuildFiles = [
    'server',
    'static',
    'build-manifest.json'
  ];
  
  requiredBuildFiles.forEach(file => {
    if (!fs.existsSync(path.join(buildDir, file))) {
      throw new Error(`构建文件缺失: ${file}`);
    }
  });
  console.log('✅ 构建输出完整');
} catch (error) {
  console.error('❌ 构建输出检查失败:', error.message);
  process.exit(1);
}

// 检查静态资源
try {
  const publicDir = 'public';
  if (fs.existsSync(publicDir)) {
    const publicFiles = fs.readdirSync(publicDir);
    console.log(`✅ 发现 ${publicFiles.length} 个静态资源文件`);
  }
} catch (error) {
  console.log('⚠️  静态资源目录不存在或为空');
}

console.log('\n🎉 部署验证完成！项目已准备好用于竞赛展示');
console.log('\n📋 下一步:');
console.log('1. 运行 npm start 启动生产服务器');
console.log('2. 访问 http://localhost:3000 查看展示页面');
console.log('3. 可以部署到 Vercel/Netlify 等平台');