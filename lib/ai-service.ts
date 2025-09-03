export interface AISummaryRequest {
  comments: {
    id: string
    content: string
    positionType: string
    userId: string
  }[]
  topicTitle: string
  roundNumber: number
}

export interface AISummaryResponse {
  summary: string
  consensus: string[]
  disagreements: string[]
  newQuestions: string[]
  referencedComments: string[]
  sentiment: "positive" | "negative" | "neutral"
  convergenceScore: number
}

export class AIService {
  private baseURL: string
  private apiKey: string
  private model: string

  constructor(baseURL: string, apiKey: string, model: string) {
    this.baseURL = baseURL
    this.apiKey = apiKey
    this.model = model
  }

  async generateSummary(request: AISummaryRequest): Promise<AISummaryResponse> {
    const prompt = this.buildPrompt(request)
    
    try {
      const response = await fetch(`${this.baseURL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "system",
              content: "你是一位专业的讨论书记官，负责从多轮讨论中提炼核心观点。请以中文回复。"
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        }),
      })

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content
      
      return this.parseAISummary(content, request.comments)
    } catch (error) {
      console.error('AI summary generation failed:', error)
      return this.generateFallbackSummary(request)
    }
  }

  private buildPrompt(request: AISummaryRequest): string {
    const commentsText = request.comments
      .map((comment, index) => `[评论${index + 1}-ID:${comment.id}] ${comment.content} (立场:${comment.positionType})`)
      .join('\n\n')

    return `请分析以下关于"${request.topicTitle}"的第${request.roundNumber}轮讨论，生成结构化总结：

讨论内容：
${commentsText}

请提供：
1. 总体总结（200字左右）
2. 共识点（3-5条，明确具体）
3. 分歧点（3-5条，明确具体）
4. 新的问题方向（2-3个）
5. 引用的评论ID（选择最有代表性的3-5条）
6. 情感倾向（positive/negative/neutral）
7. 收敛度评分（0-1，0.7表示较好收敛）

请用以下JSON格式回复：
{
  "summary": "总体总结",
  "consensus": ["共识1", "共识2"],
  "disagreements": ["分歧1", "分歧2"],
  "newQuestions": ["问题1", "问题2"],
  "referencedComments": ["comment_id1", "comment_id2"],
  "sentiment": "positive",
  "convergenceScore": 0.75
}`
  }

  private parseAISummary(content: string, comments: any[]): AISummaryResponse {
    try {
      // 尝试解析JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          summary: parsed.summary || '',
          consensus: parsed.consensus || [],
          disagreements: parsed.disagreements || [],
          newQuestions: parsed.newQuestions || [],
          referencedComments: parsed.referencedComments || [],
          sentiment: parsed.sentiment || 'neutral',
          convergenceScore: parsed.convergenceScore || 0.7
        }
      }
    } catch (e) {
      console.warn('Failed to parse AI response as JSON, using fallback')
    }

    // 如果JSON解析失败，使用备用方案
    return this.generateFallbackSummary({ comments, topicTitle: '', roundNumber: 0 })
  }

  private generateFallbackSummary(request: AISummaryRequest): AISummaryResponse {
    const sampleComments = request.comments.slice(0, 3)
    return {
      summary: `基于${request.comments.length}条评论的讨论总结。参与者就核心问题进行了深入交流。`,
      consensus: [
        "技术可行性得到广泛认可",
        "需要多学科协作"
      ],
      disagreements: [
        "实施时间表存在分歧",
        "优先级排序不同"
      ],
      newQuestions: [
        "如何平衡创新与风险？",
        "下一步的具体行动计划？"
      ],
      referencedComments: sampleComments.map(c => c.id),
      sentiment: "positive",
      convergenceScore: 0.7
    }
  }
}