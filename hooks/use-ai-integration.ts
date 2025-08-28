"use client"

import { useState, useCallback } from "react"
import { AIService, type SummaryResponse } from "@/lib/ai-service"
import type { Comment } from "@/lib/types"

export function useAIIntegration() {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [lastSummary, setLastSummary] = useState<SummaryResponse | null>(null)

  const generateSummary = useCallback(
    async (comments: Comment[], topicTitle: string, roundNumber: number): Promise<SummaryResponse | null> => {
      if (comments.length < 10) {
        console.warn("Not enough comments for summary generation")
        return null
      }

      setIsGeneratingSummary(true)

      try {
        const response = await fetch("/api/ai/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comments: comments.map((comment) => ({
              id: comment.id,
              content: comment.content,
              author: comment.author.name,
              timestamp: comment.createdAt,
            })),
            topicTitle,
            roundNumber,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate summary")
        }

        const data = await response.json()
        const summary = data.summary

        setLastSummary(summary)
        return summary
      } catch (error) {
        console.error("Error generating summary:", error)
        return null
      } finally {
        setIsGeneratingSummary(false)
      }
    },
    [],
  )

  const shouldTriggerSummary = useCallback(async (commentCount: number): Promise<boolean> => {
    return await AIService.shouldTriggerSummary(commentCount)
  }, [])

  return {
    generateSummary,
    shouldTriggerSummary,
    isGeneratingSummary,
    lastSummary,
  }
}
