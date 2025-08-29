"use client"

import { useState } from "react"
import type { Comment } from "@/types"
import type { SummaryResponse } from "@/lib/ai-service"

export function useAIIntegration() {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)

  const generateSummary = async (
    comments: Comment[],
    topicTitle: string,
    roundNumber: number
  ): Promise<SummaryResponse | null> => {
    setIsGeneratingSummary(true)
    
    // 模拟AI处理延迟
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsGeneratingSummary(false)
    
    // 返回模拟的AI总结
    return {
      summary: `这是第${roundNumber}轮关于"${topicTitle}"的AI总结。基于${comments.length}条评论，AI识别出主要观点集中在技术实现和伦理考量方面。参与者展现了深入的思考和建设性的讨论。`,
      keyPoints: [
        "技术可行性得到广泛讨论",
        "伦理考量需要更多关注",
        "用户界面设计获得积极反馈",
        "部署方案存在不同意见"
      ],
      sentiment: "positive",
      convergenceScore: 0.75,
      nextSteps: [
        "继续深入讨论技术细节",
        "建立伦理审查框架",
        "进行用户测试验证"
      ]
    }
  }

  const shouldTriggerSummary = (commentCount: number): boolean => {
    return commentCount >= 10
  }

  return {
    generateSummary,
    shouldTriggerSummary,
    isGeneratingSummary
  }
}