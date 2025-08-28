export interface SummaryRequest {
  comments: Array<{
    id: string
    content: string
    author: string
    timestamp: Date
  }>
  topicTitle: string
  roundNumber: number
}

export interface SummaryResponse {
  consensus: string[]
  disagreements: string[]
  newQuestions: string[]
  overallSummary: string
  keyInsights: string[]
}

// Mock AI service that simulates wisdom distillation
export class AIService {
  static async generateSummary(request: SummaryRequest): Promise<SummaryResponse> {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock analysis based on comment content
    const mockSummary: SummaryResponse = {
      consensus: [
        "参与者普遍认为该主题具有重要的研究价值",
        "大多数观点支持深入探讨技术实现路径",
        "存在对实际应用场景的共同关注",
      ],
      disagreements: ["对于技术复杂度的评估存在分歧", "实施优先级的排序观点不一", "资源投入程度的看法有所不同"],
      newQuestions: [
        "如何平衡技术创新与实用性？",
        "在当前条件下最可行的实施方案是什么？",
        "如何评估长期影响和潜在风险？",
      ],
      overallSummary: `经过${request.comments.length}条评论的深入讨论，参与者围绕"${request.topicTitle}"展开了富有建设性的对话。讨论涵盖了技术可行性、实施路径、潜在挑战等多个维度，体现了群体智慧的碰撞与融合。`,
      keyInsights: [
        "多元化视角促进了更全面的问题理解",
        "技术与实践的结合是关键考量因素",
        "需要在创新性和可操作性之间找到平衡",
      ],
    }

    return mockSummary
  }

  static async shouldTriggerSummary(commentCount: number): Promise<boolean> {
    return commentCount >= 10
  }

  static async generateNewTopicFromSummary(summary: SummaryResponse, originalTopic: string): Promise<string> {
    // Generate a new topic title based on the summary
    const insights = summary.keyInsights[0] || "深入探讨"
    return `${originalTopic} - ${insights}`
  }
}
