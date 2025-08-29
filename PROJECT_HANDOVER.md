# Council AI Discussion Platform - 项目交接文档

## 项目概述

Council 是一个基于 AI 的智慧讨论平台，采用多轮讨论机制，通过 AI 总结和智慧蒸馏技术，让每个观点都能被充分讨论和理解。

### 技术栈
- **前端**: Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS v4
- **UI组件**: shadcn/ui, Radix UI
- **状态管理**: React Hooks (useState, useEffect)
- **字体**: Geist Sans & Geist Mono
- **动画**: CSS Animations, Framer Motion concepts
- **开发工具**: ESLint, TypeScript, PostCSS

## 项目文件结构

### 📁 根目录文件
\`\`\`
├── README.md                    # 项目说明文档
├── PROJECT_HANDOVER.md         # 项目交接文档 (本文件)
├── package.json                # 依赖管理和脚本配置
├── tsconfig.json              # TypeScript 配置
├── next.config.mjs            # Next.js 配置
├── components.json            # shadcn/ui 组件配置
└── .gitignore                 # Git 忽略文件配置
\`\`\`

### 📁 前端文件结构

#### `/app` - Next.js App Router 核心
\`\`\`
app/
├── layout.tsx                 # 全局布局组件，设置字体和元数据
├── page.tsx                   # 主页面，管理 Lobby 和 Topic Space 状态切换
├── globals.css                # 全局样式，包含 Council 主题色彩系统
└── api/                       # API 路由 (后端接口)
    └── ai/
        └── summarize/
            └── route.ts       # AI 总结接口
\`\`\`

#### `/components` - React 组件库
\`\`\`
components/
├── ui/                        # shadcn/ui 基础组件
│   ├── button.tsx            # 按钮组件
│   ├── card.tsx              # 卡片组件
│   ├── dialog.tsx            # 对话框组件
│   ├── input.tsx             # 输入框组件
│   └── ...                   # 其他 UI 组件
├── lobby/                     # 大厅界面组件
│   ├── lobby-interface.tsx   # 主大厅界面，管理话题卡片布局和交互
│   └── thought-node.tsx      # 话题节点组件，支持拖拽和悬停效果
├── topic-space/              # 话题讨论空间组件
│   ├── topic-space.tsx       # 话题空间主容器
│   ├── topic-card.tsx        # 话题卡片组件
│   ├── comment-loop.tsx      # 评论循环组件，管理10条评论的显示
│   ├── comment-card.tsx      # 单个评论卡片
│   └── round-history-view.tsx # 历史轮次查看组件
├── cards/                     # 卡片相关组件
│   ├── card-stack.tsx        # 卡片堆叠组件
│   ├── comment-form.tsx      # 评论表单组件
│   ├── interactive-card.tsx  # 交互式卡片组件
│   └── summary-card.tsx      # AI 总结卡片组件
├── discussion/               # 讨论流程组件
│   ├── discussion-navigator.tsx # 讨论导航组件
│   └── discussion-tree.tsx   # 讨论树状结构组件
├── realtime/                 # 实时功能组件
│   ├── participant-indicator.tsx # 参与者指示器
│   ├── typing-indicator.tsx  # 输入状态指示器
│   └── activity-feed.tsx     # 活动动态组件
├── ai/                       # AI 相关组件
│   └── summary-generator.tsx # AI 总结生成器
└── modals/                   # 模态框组件
    └── create-topic-modal.tsx # 创建话题模态框
\`\`\`

#### `/hooks` - React 自定义 Hooks
\`\`\`
hooks/
├── use-discussion-flow.ts    # 讨论流程状态管理
├── use-ai-integration.ts     # AI 集成功能 Hook
└── use-realtime.ts          # 实时功能 Hook
\`\`\`

#### `/lib` - 工具库和类型定义
\`\`\`
lib/
├── types.ts                  # TypeScript 类型定义
├── utils.ts                  # 工具函数 (cn 函数等)
├── ai-service.ts            # AI 服务模拟
└── realtime-service.ts      # 实时服务模拟
\`\`\`

### 📁 后端 API 结构

#### API 路由 (`/app/api`)
\`\`\`
api/
└── ai/
    └── summarize/
        └── route.ts          # POST /api/ai/summarize - AI 总结接口
\`\`\`

## 核心功能模块详解

### 1. 大厅系统 (Lobby System)
**文件**: `components/lobby/lobby-interface.tsx`, `components/lobby/thought-node.tsx`

**功能**:
- 非线性话题可视化展示
- 话题卡片智能分布算法
- 拖拽功能支持
- 悬停效果和重叠处理
- 话题搜索和筛选

**关键特性**:
- 基于活跃度的卡片大小调整
- 三焦点聚类分布算法
- 边界约束防止卡片溢出
- 实时参与者数量显示

### 2. 话题讨论空间 (Topic Space)
**文件**: `components/topic-space/topic-space.tsx`, `components/topic-space/comment-loop.tsx`

**功能**:
- 中心话题卡片展示
- 10条评论循环显示
- 轮次导航和历史查看
- 评论卡片横向滑动
- AI 总结触发和显示

**关键特性**:
- 卡片式阅读体验
- 左右滑动导航
- 轮次状态管理
- 自动 AI 总结触发

### 3. AI 智慧蒸馏系统
**文件**: `lib/ai-service.ts`, `app/api/ai/summarize/route.ts`, `components/ai/summary-generator.tsx`

**功能**:
- 10条评论达成后自动触发
- 提取共识点和分歧点
- 生成新的讨论问题
- 创建下一轮讨论基础

**API 接口**:
\`\`\`typescript
POST /api/ai/summarize
Content-Type: application/json

Request Body:
{
  "comments": Comment[],
  "topicTitle": string,
  "roundNumber": number
}

Response:
{
  "summary": {
    "consensus": string[],
    "disagreements": string[],
    "newQuestions": string[],
    "overallSummary": string
  }
}
\`\`\`

### 4. 实时协作系统
**文件**: `lib/realtime-service.ts`, `hooks/use-realtime.ts`, `components/realtime/*`

**功能**:
- 实时参与者显示
- 输入状态指示
- 活动动态推送
- 在线状态管理

**事件类型**:
\`\`\`typescript
type RealtimeEvent = 
  | { type: 'user_joined'; userId: string; userName: string }
  | { type: 'user_left'; userId: string }
  | { type: 'typing_start'; userId: string; userName: string }
  | { type: 'typing_stop'; userId: string }
  | { type: 'comment_added'; comment: Comment }
\`\`\`

## 数据结构定义

### 核心类型 (`lib/types.ts`)

\`\`\`typescript
// 话题类型
interface Topic {
  id: string
  title: string
  description: string
  createdAt: Date
  participantCount: number
  roundCount: number
  status: "active" | "locked" | "completed"
  createdBy: string
}

// 评论类型
interface Comment {
  id: string
  content: string
  author: Author
  createdAt: Date
  roundId: string
  position: number
  likes: number
  replies?: Comment[]
}

// 讨论轮次
interface Round {
  id: string
  topicId: string
  roundNumber: number
  comments: Comment[]
  summary?: AISummary
  status: "active" | "completed" | "locked"
  createdAt: Date
}

// AI 总结
interface AISummary {
  consensus: string[]
  disagreements: string[]
  newQuestions: string[]
  overallSummary: string
  generatedAt: Date
}
\`\`\`

## 开发环境设置

### 1. 环境要求
- Node.js 18+ 
- npm 或 yarn
- 现代浏览器 (Chrome, Firefox, Safari, Edge)

### 2. 安装步骤
\`\`\`bash
# 克隆项目
git clone [repository-url]
cd council-platform

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
\`\`\`

### 3. 开发脚本
\`\`\`json
{
  "dev": "next dev",           // 开发模式
  "build": "next build",       // 构建生产版本
  "start": "next start",       // 启动生产服务器
  "lint": "next lint"          // 代码检查
}
\`\`\`

## 样式系统

### 颜色主题 (`app/globals.css`)
\`\`\`css
/* Council 主题色彩系统 */
--background: oklch(0.98 0.01 85);     /* 奶白色背景 */
--foreground: oklch(0.15 0.02 85);     /* 深色文字 */
--primary: oklch(0.65 0.15 165);       /* 薄荷绿主色 */
--accent: oklch(0.75 0.12 165);        /* 薄荷绿强调色 */
--card: oklch(0.95 0.02 75);           /* 卡片背景 */
--muted: oklch(0.92 0.02 75);          /* 静音色 */
\`\`\`

### 响应式断点
- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+

## 部署说明

### Vercel 部署 (推荐)
1. 连接 GitHub 仓库到 Vercel
2. 自动检测 Next.js 项目
3. 部署完成后获得生产 URL

### 其他平台部署
\`\`\`bash
# 构建静态文件
npm run build

# 输出目录: .next/
# 需要 Node.js 运行时环境
\`\`\`

## 扩展开发指南

### 1. 添加新的 API 接口
在 `app/api/` 目录下创建新的路由文件:
\`\`\`typescript
// app/api/topics/route.ts
export async function GET() {
  // 处理 GET 请求
}

export async function POST() {
  // 处理 POST 请求
}
\`\`\`

### 2. 添加新的组件
在相应的 `components/` 子目录下创建组件:
\`\`\`typescript
// components/new-feature/new-component.tsx
export function NewComponent() {
  return <div>新组件</div>
}
\`\`\`

### 3. 添加新的 Hook
在 `hooks/` 目录下创建自定义 Hook:
\`\`\`typescript
// hooks/use-new-feature.ts
export function useNewFeature() {
  // Hook 逻辑
}
\`\`\`

## 性能优化建议

1. **代码分割**: 使用 `dynamic()` 进行组件懒加载
2. **图片优化**: 使用 Next.js `Image` 组件
3. **缓存策略**: 合理使用 React 的 `useMemo` 和 `useCallback`
4. **包大小**: 定期检查和优化依赖包大小

## 常见问题解决

### 1. 样式不生效
- 检查 Tailwind CSS 类名是否正确
- 确认 `globals.css` 已正确导入

### 2. 组件不渲染
- 检查 TypeScript 类型错误
- 确认组件导入路径正确

### 3. API 调用失败
- 检查 API 路由文件位置
- 确认请求方法和参数正确

## 联系信息

如有技术问题，请联系开发团队或查看项目文档。

---

**最后更新**: 2025年8月29日
**文档版本**: v1.0
**项目版本**: v14
