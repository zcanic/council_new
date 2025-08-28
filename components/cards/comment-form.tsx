"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, X, AlertCircle } from "lucide-react"

interface CommentFormProps {
  position: number
  onSubmit: (content: string) => void
  onCancel: () => void
  isSubmitting?: boolean
  className?: string
}

export function CommentForm({ position, onSubmit, onCancel, isSubmitting = false, className = "" }: CommentFormProps) {
  const [content, setContent] = useState("")
  const [charCount, setCharCount] = useState(0)
  const maxChars = 500
  const minChars = 10

  const handleContentChange = (value: string) => {
    if (value.length <= maxChars) {
      setContent(value)
      setCharCount(value.length)
    }
  }

  const handleSubmit = () => {
    if (content.trim().length >= minChars) {
      onSubmit(content.trim())
    }
  }

  const isValid = content.trim().length >= minChars
  const isNearLimit = charCount > maxChars * 0.8

  return (
    <Card
      className={`
        w-80 p-6 bg-card/95 backdrop-blur-sm border-2 border-primary/30
        shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300
        ${className}
      `}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs bg-primary/20">我</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">添加评论</p>
              <p className="text-xs text-muted-foreground">位置 #{position}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel} className="w-8 h-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content Input */}
        <div className="space-y-2">
          <Textarea
            placeholder="分享你的观点和想法..."
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="min-h-24 resize-none text-sm"
            disabled={isSubmitting}
          />

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              {!isValid && content.length > 0 && (
                <>
                  <AlertCircle className="w-3 h-3 text-orange-500" />
                  <span className="text-orange-500">至少需要 {minChars} 个字符</span>
                </>
              )}
            </div>
            <span className={`${isNearLimit ? "text-orange-500" : "text-muted-foreground"}`}>
              {charCount}/{maxChars}
            </span>
          </div>
        </div>

        {/* Guidelines */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground leading-relaxed">
            💡 提示：请分享具体的观点、经验或问题。避免简单的赞同或反对，尝试提供新的视角或深入的分析。
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button onClick={handleSubmit} disabled={!isValid || isSubmitting} className="flex-1 flex items-center gap-2">
            <Send className="w-4 h-4" />
            {isSubmitting ? "发布中..." : "发布评论"}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            取消
          </Button>
        </div>
      </div>
    </Card>
  )
}
