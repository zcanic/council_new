"use client"

import { useState } from "react"
import type { DiscussionRound, Comment, Topic } from "@/types"

export function useDiscussionFlow(topic: Topic) {
  const [discussionState, setDiscussionState] = useState({
    currentRoundIndex: 0,
    rounds: [] as DiscussionRound[],
    comments: [] as Comment[]
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)

  const getCurrentRound = () => {
    // 返回模拟的当前轮次数据
    return {
      id: `round-${topic.id}-1`,
      topicId: topic.id,
      roundNumber: 1,
      status: "active" as const,
      startTime: new Date(),
      commentCount: 8,
      maxComments: 10,
      aiSummary: "这是模拟的AI总结内容",
      convergenceScore: 0.75,
      comments: [
        {
          id: "mock-comment-1",
          topicId: topic.id,
          roundId: `round-${topic.id}-1`,
          userId: "1",
          user: {
            id: "1",
            username: "tech_enthusiast",
            email: "tech@example.com",
            avatar: "/placeholder-user.jpg",
            status: "active" as const,
            lastSeen: new Date()
          },
          content: "这是模拟的评论内容，用于演示界面效果。",
          positionType: "neutral" as const,
          isAnonymous: false,
          sentimentScore: 0.6,
          qualityScore: 0.8,
          likeCount: 5,
          replyCount: 2,
          status: "active" as const,
          createdAt: new Date()
        }
      ]
    }
  }

  const canTriggerDistillation = () => {
    const round = getCurrentRound()
    return round && round.comments.length >= 5
  }

  const triggerWisdomDistillation = async () => {
    setIsGeneratingSummary(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGeneratingSummary(false)
    return { success: true }
  }

  const switchToRound = (roundId: string) => {
    // 在静态版本中，我们不需要实际切换轮次
    console.log("Switching to round:", roundId)
  }

  const addComment = async (content: string, authorName: string, position: number) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsLoading(false)
    
    const newComment = {
      id: `mock-comment-${Date.now()}`,
      content,
      authorName,
      position,
      createdAt: new Date()
    }
    
    return newComment
  }

  return {
    discussionState,
    addComment,
    triggerWisdomDistillation,
    switchToRound,
    getCurrentRound,
    canTriggerDistillation,
    isGeneratingSummary
  }
}