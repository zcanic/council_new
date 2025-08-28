"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Sparkles, History, ChevronRight, Users } from "lucide-react"
import { TopicCard } from "./topic-card"
import { CommentLoop } from "./comment-loop"
import { SummaryGenerator } from "@/components/ai/summary-generator"
import { RoundHistoryView } from "./round-history-view"
import { TypingIndicator } from "@/components/realtime/typing-indicator"
import { useDiscussionFlow } from "@/hooks/use-discussion-flow"
import { useRealtime } from "@/hooks/use-realtime"
import type { Topic } from "@/lib/types"

interface TopicSpaceProps {
  topic: Topic
  onBack: () => void
}

export function TopicSpace({ topic, onBack }: TopicSpaceProps) {
  const [isTopicCollapsed, setIsTopicCollapsed] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0)

  const {
    discussionState,
    addComment,
    triggerWisdomDistillation,
    switchToRound,
    getCurrentRound,
    canTriggerDistillation,
    isGeneratingSummary,
  } = useDiscussionFlow(topic)

  const {
    participants,
    onlineParticipants,
    typingParticipants,
    connectionStatus,
    broadcastComment,
    startTyping,
    stopTyping,
  } = useRealtime(topic.id)

  const currentRound = getCurrentRound()

  const relatedTopics = [
    topic,
    { ...topic, id: "related-1", title: "猫眼的夜视能力", description: "探讨猫在黑暗中的视觉优势" },
    { ...topic, id: "related-2", title: "光学仿生学应用", description: "从猫眼结构学习的技术创新" },
  ]

  const handleAddComment = async (position: number, content: string, authorName: string) => {
    const newComment = addComment(content, authorName, position)
    broadcastComment(newComment)

    if (currentRound && currentRound.comments.length + 1 >= 10) {
      setTimeout(() => {
        triggerWisdomDistillation()
      }, 1000)
    }

    return newComment
  }

  const handleTopicSelect = (index: number) => {
    setSelectedTopicIndex(index)
    setIsTopicCollapsed(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-council-cream/20 to-council-mint/10">
      {/* Enhanced Header */}
      <div className="bg-background/90 backdrop-blur-md border-b border-border/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-2 hover:bg-council-sage/10"
              >
                <ChevronLeft className="w-4 h-4" />
                返回大厅
              </Button>

              {isTopicCollapsed && (
                <div className="flex items-center gap-3">
                  {relatedTopics.map((t, index) => (
                    <button
                      key={t.id}
                      onClick={() => handleTopicSelect(index)}
                      className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                        index === selectedTopicIndex
                          ? "bg-council-sage text-white shadow-lg scale-105"
                          : "bg-council-cream hover:bg-council-cream/80 text-council-forest hover:scale-102"
                      }`}
                    >
                      {t.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-council-mint/10 px-4 py-2 rounded-full">
                <Users className="w-4 h-4 text-council-sage" />
                <span className="text-sm font-medium text-council-forest">{onlineParticipants.length} 人在线</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className={`transition-all duration-300 ${
                  showHistory ? "bg-council-sage/10 border-council-sage text-council-sage" : "hover:bg-council-sage/5"
                }`}
              >
                <History className="w-4 h-4 mr-2" />
                历史记录
              </Button>

              {canTriggerDistillation() && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={triggerWisdomDistillation}
                  disabled={isGeneratingSummary}
                  className="bg-gradient-to-r from-council-sage to-council-mint hover:from-council-sage/90 hover:to-council-mint/90 shadow-lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  智慧蒸馏
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {showHistory ? (
          <RoundHistoryView
            rounds={discussionState.rounds}
            onRoundSelect={switchToRound}
            onClose={() => setShowHistory(false)}
          />
        ) : (
          <div className="relative">
            {!isTopicCollapsed && (
              <div className="p-8">
                <div className="flex items-center justify-center gap-6 mb-12">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setSelectedTopicIndex(Math.max(0, selectedTopicIndex - 1))}
                    disabled={selectedTopicIndex === 0}
                    className="rounded-full w-12 h-12 p-0 hover:bg-council-sage/10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  <div className="flex-1 max-w-5xl">
                    <TopicCard
                      topic={relatedTopics[selectedTopicIndex]}
                      onToggleCollapse={() => setIsTopicCollapsed(true)}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-xl"
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setSelectedTopicIndex(Math.min(relatedTopics.length - 1, selectedTopicIndex + 1))}
                    disabled={selectedTopicIndex === relatedTopics.length - 1}
                    className="rounded-full w-12 h-12 p-0 hover:bg-council-sage/10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                {/* Enhanced topic indicators */}
                <div className="flex justify-center gap-3 mb-12">
                  {relatedTopics.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTopicIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                        index === selectedTopicIndex
                          ? "bg-council-sage scale-125 shadow-lg"
                          : "bg-council-sage/30 hover:bg-council-sage/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="px-8 pb-12">
              <div className="max-w-6xl mx-auto space-y-12">
                <TypingIndicator typingParticipants={typingParticipants} />

                {/* Enhanced AI Summary Generator */}
                {currentRound && canTriggerDistillation() && (
                  <div className="bg-gradient-to-br from-council-sage/10 via-council-mint/10 to-council-cream/20 rounded-3xl p-8 border-2 border-council-sage/20 shadow-xl">
                    <SummaryGenerator
                      comments={currentRound.comments}
                      topicTitle={relatedTopics[selectedTopicIndex].title}
                      roundNumber={currentRound.roundNumber}
                      onSummaryGenerated={(summary) => {
                        console.log("[v0] Summary generated:", summary)
                      }}
                      autoTrigger={false}
                    />
                  </div>
                )}

                {/* Comment Loop */}
                {currentRound && (
                  <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-council-sage/10">
                    <CommentLoop
                      round={currentRound}
                      onAddComment={handleAddComment}
                      onStartTyping={() => startTyping("当前用户")}
                      onStopTyping={() => stopTyping("当前用户")}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
