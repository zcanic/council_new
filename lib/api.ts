import { Topic, Comment, DiscussionRound, CreateTopicData, CreateCommentData } from '@/types'

const API_BASE = '/api'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// 话题API
export const topicApi = {
  // 获取话题列表
  getTopics: async (sortBy?: string): Promise<Topic[]> => {
    const url = sortBy ? `${API_BASE}/topics?sortBy=${sortBy}` : `${API_BASE}/topics`
    const response = await fetch(url)
    const result: ApiResponse<Topic[]> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch topics')
    }
    
    return result.data || []
  },

  // 创建话题
  createTopic: async (data: CreateTopicData & { createdBy: string }): Promise<Topic> => {
    const response = await fetch(`${API_BASE}/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    const result: ApiResponse<Topic> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create topic')
    }
    
    return result.data!
  },

  // 获取话题详情
  getTopic: async (id: string): Promise<Topic & { rounds: DiscussionRound[] }> => {
    const response = await fetch(`${API_BASE}/topics/${id}`)
    const result: ApiResponse<Topic & { rounds: DiscussionRound[] }> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch topic')
    }
    
    return result.data!
  }
}

// 轮次API
export const roundApi = {
  // 轮次操作
  manageRound: async (topicId: string, action: 'start' | 'lock' | 'next'): Promise<any> => {
    const response = await fetch(`${API_BASE}/rounds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicId, action })
    })
    
    const result: ApiResponse<any> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || `Failed to ${action} round`)
    }
    
    return result.data
  }
}

// 评论API
export const commentApi = {
  // 创建评论
  createComment: async (data: CreateCommentData & {
    topicId: string
    username: string
    roundId?: string
  }): Promise<Comment> => {
    const response = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    const result: ApiResponse<Comment> = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create comment')
    }
    
    return result.data!
  }
}

// AI总结API
export const summaryApi = {
  // 生成总结
  generateSummary: async (roundId: string): Promise<{
    summary: string
    consensus: string[]
    disagreements: string[]
    newQuestions: string[]
    referencedComments: string[]
    sentiment: string
    convergenceScore: number
  }> => {
    const response = await fetch(`${API_BASE}/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roundId })
    })
    
    const result: ApiResponse<any> = await response.json()
    
    if (!result.success) {
      // 如果AI服务失败，返回降级数据
      if (result.fallback) {
        return result.fallback
      }
      throw new Error(result.error || 'Failed to generate summary')
    }
    
    return result.data
  }
}