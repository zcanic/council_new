"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, Reply, MoreHorizontal, Clock } from "lucide-react"
import type { Comment } from "@/lib/types"

interface CommentCardProps {
  comment?: Comment
  position: number
  isActive?: boolean
  onAddComment?: () => void
  className?: string
}

export function CommentCard({ comment, position, isActive = false, onAddComment, className = "" }: CommentCardProps) {
  // Empty slot for new comment
  if (!comment) {
    return (
      <Card
        className={`
          w-80 h-48 p-6 border-2 border-dashed border-primary/30 
          bg-primary/5 hover:bg-primary/10 cursor-pointer
          transition-all duration-300 hover:scale-105
          flex items-center justify-center
          ${className}
        `}
        onClick={onAddComment}
      >
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
            <span className="text-lg font-bold text-primary">{position}</span>
          </div>
          <p className="text-sm text-muted-foreground">点击添加评论</p>
        </div>
      </Card>
    )
  }

  return (
    <Card
      className={`
        w-80 h-48 p-6 bg-card/90 backdrop-blur-sm border-2
        ${isActive ? "border-primary/50 shadow-lg" : "border-border/50"}
        transition-all duration-300 hover:scale-105 hover:shadow-xl
        ${className}
      `}
    >
      <div className="h-full flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs">{comment.authorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{comment.authorName}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{Math.floor((Date.now() - comment.createdAt.getTime()) / (1000 * 60))}分钟前</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">#{position}</span>
              <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-pretty line-clamp-4 leading-relaxed">{comment.content}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
              <Heart className="w-3 h-3 mr-1" />
              赞同
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
              <Reply className="w-3 h-3 mr-1" />
              回复
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
