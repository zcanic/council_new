// 基础类型定义
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  status: 'active' | 'inactive' | 'banned'
  lastSeen?: Date
}

export interface Topic {
  id: string
  title: string
  description: string
  createdAt: Date
  participantCount: number
  roundCount: number
  status: 'draft' | 'active' | 'locked' | 'archived'
  createdBy: string
  creatorId: string
  currentRound: number
  maxRounds: number
}

export interface DiscussionRound {
  id: string
  topicId: string
  roundNumber: number
  status: 'preparing' | 'active' | 'completed'
  startTime?: Date
  endTime?: Date
  commentCount: number
  maxComments: number
  aiSummary?: string
  convergenceScore: number
  comments?: Comment[]
  createdAt?: Date
  consensus?: string[]
  disagreements?: string[]
  newQuestions?: string[]
  generatedAt?: Date
  roundId?: string
  content?: string
  parentSummary?: string
}

export type Round = DiscussionRound

export interface Comment {
  id: string
  topicId: string
  roundId: string
  userId: string
  user: User
  content: string
  positionType: 'support' | 'oppose' | 'neutral'
  isAnonymous: boolean
  sentimentScore: number
  qualityScore: number
  likeCount: number
  replyCount: number
  parentId?: string
  status: 'active' | 'hidden' | 'deleted'
  createdAt: Date
  authorName?: string
}

export interface DiscussionState {
  viewMode: 'lobby' | 'topic'
  currentTopic?: Topic
}

// API 响应类型（用于静态展示）
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// 表单数据类型
export interface CreateTopicData {
  title: string
  description: string
  maxRounds?: number
}

export interface CreateCommentData {
  content: string
  positionType: 'support' | 'oppose' | 'neutral'
  isAnonymous?: boolean
}

// 组件Props类型
export interface LobbyProps {
  topics: Topic[]
  onTopicClick: (topic: Topic) => void
  onCreateTopic: () => void
}

export interface TopicSpaceProps {
  topic: Topic
  rounds: DiscussionRound[]
  onBack: () => void
  onAddComment: (roundId: string, position: number) => void
}

export interface TopicCardProps {
  topic: Topic
  onClick: () => void
}

export interface CommentCardProps {
  comment: Comment
  onReply?: (comment: Comment) => void
  onLike?: (comment: Comment) => void
}

// AI服务类型
export interface AISummary {
  summary: string
  keyPoints: string[]
  sentiment: "positive" | "negative" | "neutral"
  convergenceScore: number
  nextSteps: string[]
  generatedAt?: Date
  roundId?: string
  content?: string
  consensus?: string[]
  disagreements?: string[]
  newQuestions?: string[]
}

export interface SummaryResponse {
  summary: string
  keyPoints: string[]
  sentiment: "positive" | "negative" | "neutral"
  convergenceScore: number
  nextSteps: string[]
}

// 工具类型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>