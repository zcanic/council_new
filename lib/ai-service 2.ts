export interface SummaryRequest {
  comments: Array<{
    id: string
    content: string
    author: string
    timestamp: Date
  }>
  topicTitle: string
  roundNumber: number
  roundId?: number
}

export interface SummaryResponse {
  core_consensus: string
  main_disagreements: string
  emerging_questions: string
  summary_title: string
  key_insights: string
}

// AI服务配置
interface AIConfig {
  apiKey: string
  model: string
  baseUrl: string
  temperature: number
  maxTokens: number
}

// 获取AI配置
function getAIConfig(): AIConfig {
  return {
    apiKey: process.env.AI_API_KEY || '',
    model: process.env.AI_MODEL || 'kimi-k2-0711-preview',
    baseUrl: process.env.AI_BASE_URL || 'https://api.moonshot.cn/v1',
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.3'),
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '1000')
  }
}

// 真实的AI服务
export class AIService {
  static async generateSummary(request: SummaryRequest): Promise<SummaryResponse> {
    const config = getAIConfig()
    
    // 如果没有配置API密钥，使用降级方案
    if (!config.apiKey) {
      console.warn('AI API密钥未配置，使用降级总结策略')
      return this.getFallbackSummary(request.comments)
    }

    try {
      const prompt = this.buildPrompt(request.comments, {
        topic_title: request.topicTitle,
        round_number: request.roundNumber
      })

      console.log(`开始AI总结，评论数量: ${request.comments.length}`)

      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            {
              role: 'system',
              content: '你是一个客观中立的讨论总结助手。你需要严格按照要求格式输出JSON，不添加任何主观判断。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          response_format: { type: 'json_object' }
        })
      })

      if (!response.ok) {
        throw new Error(`AI API请求失败: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const aiContent = data.choices[0].message.content
      const parsed = JSON.parse(aiContent)

      console.log('AI总结完成')
      
      return this.validateAndFormatSummary(parsed)
    } catch (error) {
      console.error('AI总结失败:', error)
      
      // 降级处理：返回基础总结
      return this.getFallbackSummary(request.comments)
    }
  }

  private static buildPrompt(comments: any[], roundInfo: any): string {
    const commentTexts = comments.map((comment, index) => {
      return `${index + 1}. [${comment.author || '匿名用户'}]: ${comment.content}`;
    }).join('\n\n');

    const topicContext = roundInfo.topic_title ? `\n讨论主题：${roundInfo.topic_title}` : '';

    // 使用与原项目完全相同的提示词格式
    return `
请客观分析以下${comments.length}条关于某议题的讨论评论，并按要求输出总结：${topicContext}

评论内容：
${commentTexts}

请严格按照以下JSON格式输出：
{
  "core_consensus": "参与者普遍认同的观点，如果没有共识则返回空字符串",
  "main_disagreements": "主要分歧点和对立观点，如果没有明显分歧则返回空字符串", 
  "emerging_questions": "讨论中提出的值得进一步探讨的新问题，如果没有新问题则返回空字符串",
  "summary_title": "本轮讨论的简短标题，3-10个字",
  "key_insights": "讨论中的关键洞察或重要观点"
}

要求：
1. 保持绝对客观中立，不添加AI自己的观点或价值判断
2. 如果某个方面没有相关内容，对应字段返回空字符串
3. 总结要简洁明了，避免冗长描述
4. 确保输出是有效的JSON格式
5. summary_title应该概括本轮讨论的核心主题
    `;
  }

  private static validateAndFormatSummary(summary: any): SummaryResponse {
    // 验证必需字段
    const requiredFields = ['core_consensus', 'main_disagreements', 'emerging_questions', 'summary_title'];
    
    for (const field of requiredFields) {
      if (typeof summary[field] !== 'string') {
        summary[field] = '';
      }
    }

    // 确保 key_insights 字段存在
    if (typeof summary.key_insights !== 'string') {
      summary.key_insights = '';
    }

    // 标题长度限制
    if (summary.summary_title.length > 50) {
      summary.summary_title = summary.summary_title.substring(0, 50);
    }

    // 如果标题为空，生成默认标题
    if (!summary.summary_title.trim()) {
      summary.summary_title = `第${new Date().getTime() % 1000}轮讨论总结`;
    }

    return summary as SummaryResponse;
  }

  private static getFallbackSummary(comments: any[]): SummaryResponse {
    console.warn('使用降级总结策略');
    
    return {
      core_consensus: '系统暂时无法分析评论内容的共识点',
      main_disagreements: '系统暂时无法分析评论内容的分歧点',
      emerging_questions: '系统暂时无法提取新的讨论问题',
      summary_title: `讨论总结 - ${comments.length}条评论`,
      key_insights: '本轮讨论包含多个观点，待进一步分析'
    };
  }

  static async shouldTriggerSummary(commentCount: number): Promise<boolean> {
    return commentCount >= 10;
  }

  static async generateNewTopicFromSummary(summary: SummaryResponse, originalTopic: string): Promise<string> {
    const insights = summary.key_insights || summary.core_consensus || "深入探讨";
    const shortInsights = insights.length > 20 ? insights.substring(0, 20) + '...' : insights;
    return `${originalTopic} - ${shortInsights}`;
  }
}
