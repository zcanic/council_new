"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles, Brain, MessageSquare } from "lucide-react"
import { useAIIntegration } from "@/hooks/use-ai-integration"
import type { Comment } from "@/lib/types"
import type { SummaryResponse } from "@/lib/ai-service"

interface SummaryGeneratorProps {
  comments: Comment[]
  topicTitle: string
  roundNumber: number
  onSummaryGenerated: (summary: SummaryResponse) => void
  autoTrigger?: boolean
}

export function SummaryGenerator({
  comments,
  topicTitle,
  roundNumber,
  onSummaryGenerated,
  autoTrigger = true,
}: SummaryGeneratorProps) {
  const { generateSummary, shouldTriggerSummary, isGeneratingSummary } = useAIIntegration()
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    if (autoTrigger && !hasTriggered && comments.length >= 10) {
      handleGenerateSummary()
      setHasTriggered(true)
    }
  }, [comments.length, autoTrigger, hasTriggered])

  const handleGenerateSummary = async () => {
    const summary = await generateSummary(comments, topicTitle, roundNumber)
    if (summary) {
      onSummaryGenerated(summary)
    }
  }

  if (comments.length < 10) {
    return (
      <Card className="border-dashed border-council-sage/30 bg-council-cream/50">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <MessageSquare className="h-8 w-8 text-council-sage/60 mx-auto" />
            <p className="text-sm text-council-sage/70">还需要 {10 - comments.length} 条评论来触发智慧蒸馏</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-council-sage/20 bg-gradient-to-br from-council-cream to-council-mint/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-council-charcoal">
          <Brain className="h-5 w-5 text-council-sage" />
          智慧蒸馏系统
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-council-sage/80">
          <p>已收集到 {comments.length} 条评论，可以开始智慧蒸馏过程。</p>
          <p className="mt-1">AI 将分析讨论内容，提取核心观点和新的思考方向。</p>
        </div>

        <Button
          onClick={handleGenerateSummary}
          disabled={isGeneratingSummary}
          className="w-full bg-council-sage hover:bg-council-sage/90 text-council-charcoal"
        >
          {isGeneratingSummary ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              正在蒸馏智慧...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              开始智慧蒸馏
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
