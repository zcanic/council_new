# Council AI 讨论平台 - 静态展示版

这是一个纯前端的 AI 讨论平台展示页面，使用 Next.js 构建，包含完整的用户界面和模拟数据。

## 🌟 特性

- **纯静态展示** - 无需后端数据库，所有数据为静态模拟数据
- **响应式设计** - 支持桌面和移动设备
- **现代化UI** - 使用 Tailwind CSS 和 Radix UI 组件
- **TypeScript** - 完整的类型安全

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

访问 http://localhost:3000 查看应用

### 生产构建
```bash
npm run build
npm start
```

## 📁 项目结构

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # 主页面
│   └── layout.tsx         # 布局组件
├── components/            # React 组件
│   ├── lobby/            # 大厅相关组件
│   ├── topic-space/      # 话题空间组件
│   ├── modals/           # 模态框组件
│   └── ui/               # 基础UI组件
├── data/
│   └── mockData.ts       # 静态演示数据
├── types/
│   └── index.ts          # TypeScript 类型定义
└── lib/
    └── utils.ts          # 工具函数
```

## 🎯 核心功能演示

### 大厅界面
- 话题列表展示
- 话题状态（活跃/锁定）
- 参与人数和轮次统计

### 话题空间
- 多轮讨论展示
- AI 总结功能
- 评论系统界面

### 交互功能
- 卡片堆叠动画
- 话题创建模态框
- 响应式导航

## 📊 模拟数据

项目包含完整的演示数据：
- 6个用户
- 6个讨论话题
- 多轮讨论记录
- 评论和互动数据

## 🎨 设计系统

使用统一的设计系统：
- **颜色方案** - 现代化暗色主题
- **字体** - Geist Sans 字体家族
- **组件库** - Radix UI 基础组件
- **动画** - 流畅的过渡动画

## 💡 技术栈

- **Next.js 15** - React 全栈框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 原子化CSS框架
- **Radix UI** - 无障碍UI组件库
- **Lucide React** - 图标库

## 📱 响应式支持

- 桌面端优化体验
- 平板适配
- 移动端友好

## 🔧 自定义

### 修改演示数据
编辑 `data/mockData.ts` 文件来自定义：
- 用户信息
- 话题内容
- 讨论轮次
- 评论数据

### 样式定制
- 修改 `tailwind.config.js` 调整主题
- 编辑组件中的 CSS 类名
- 自定义动画和过渡效果

## 📄 许可证

MIT License
