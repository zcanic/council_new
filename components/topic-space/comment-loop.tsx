"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CommentCard } from "./comment-card"
import { CommentForm } from "../cards/comment-form"
import type { Round } from "@/lib/types"

interface CommentLoopProps {
  round: Round
  onAddComment?: (position: number, content: string, authorName: string) => void
  onStartTyping?: () => void
  onStopTyping?: () => void
}

export function CommentLoop({ round, onAddComment, onStartTyping, onStopTyping }: CommentLoopProps) {
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [formPosition, setFormPosition] = useState(1)
  const maxComments = 10

  const commentSlots = Array.from({ length: maxComments }, (_, index) => {
    return round.comments.find((comment) => comment.position === index + 1) || null
  })

  const handleAddComment = (position: number) => {
    setFormPosition(position)
    setShowCommentForm(true)
    onStartTyping?.()
  }

  const handleSubmitComment = (content: string) => {
    onAddComment?.(formPosition, content, "当前用户")
    setShowCommentForm(false)
    onStopTyping?.()
  }

  const handleCancelComment = () => {
    setShowCommentForm(false)
    onStopTyping?.()
  }

  const canAddMore = round.comments.length < maxComments && round.status === "active"

  return (
    <div className="space-y-8">
      {/* Round Status */}
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-council-forest">第 {round.roundNumber} 轮讨论</h3>
        <div className="flex items-center justify-center gap-8 text-base">
          <span className="flex items-center gap-2 bg-council-sage/10 px-4 py-2 rounded-full">
            已有 <span className="font-bold text-council-sage text-lg">{round.comments.length}</span> 条评论
          </span>
          {canAddMore && (
            <span className="flex items-center gap-2 bg-council-mint/10 px-4 py-2 rounded-full">
              还可添加{" "}
              <span className="font-bold text-council-mint text-lg">{maxComments - round.comments.length}</span> 条
            </span>
          )}
        </div>

        {round.status === "full" && (
          <div className="bg-gradient-to-r from-council-sage/20 to-council-mint/20 text-council-forest px-8 py-4 rounded-2xl text-base border-2 border-council-sage/30 shadow-lg">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-council-sage rounded-full animate-pulse"></div>
              本轮讨论已满，AI正在生成总结...
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6 px-4" style={{ width: `${maxComments * 320 + (maxComments - 1) * 24}px` }}>
            {commentSlots.map((comment, index) => (
              <div key={index} className="flex-shrink-0 w-80">
                {showCommentForm && formPosition === index + 1 ? (
                  <CommentForm
                    position={formPosition}
                    onSubmit={handleSubmitComment}
                    onCancel={handleCancelComment}
                    className="h-full"
                  />
                ) : (
                  <CommentCard
                    comment={comment}
                    position={index + 1}
                    isActive={true}
                    onAddComment={!comment && canAddMore ? () => handleAddComment(index + 1) : undefined}
                    className="h-full transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicators */}
        <div className="flex justify-center mt-6 gap-2">
          {commentSlots.map((comment, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                comment
                  ? "bg-council-sage shadow-lg"
                  : canAddMore
                    ? "bg-council-mint/50 hover:bg-council-mint cursor-pointer"
                    : "bg-gray-200"
              }`}
              onClick={() => {
                if (!comment && canAddMore) {
                  handleAddComment(index + 1)
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Quick Add Section */}
      {canAddMore && !showCommentForm && (
        <div className="bg-gradient-to-r from-council-cream/50 to-council-mint/20 rounded-2xl p-8 text-center space-y-4">
          <h4 className="text-lg font-semibold text-council-forest">参与讨论</h4>
          <p className="text-council-forest/70 max-w-md mx-auto">分享你的观点，让讨论更加丰富多彩</p>
          <Button
            onClick={() => {
              const nextEmptySlot = commentSlots.findIndex((slot) => slot === null)
              if (nextEmptySlot !== -1) {
                handleAddComment(nextEmptySlot + 1)
              }
            }}
            size="lg"
            className="bg-council-sage hover:bg-council-sage/90 text-council-charcoal px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            添加我的观点
          </Button>
        </div>
      )}
    </div>
  )
}
