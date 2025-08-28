"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, MessageCircle, Clock, Lock, Sparkles } from "lucide-react"
import type { Topic } from "@/lib/types"

interface TopicCardProps {
  topic: Topic
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  className?: string
}

export function TopicCard({ topic, isCollapsed = false, onToggleCollapse, className = "" }: TopicCardProps) {
  if (isCollapsed) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={onToggleCollapse}
        className={`
          rounded-full px-4 py-2 bg-primary/20 hover:bg-primary/30 
          border-2 border-primary/40 transition-all duration-300
          ${className}
        `}
      >
        <span className="text-sm font-medium truncate max-w-32">{topic.title}</span>
      </Button>
    )
  }

  return (
    <Card
      className={`
        p-8 bg-card/90 backdrop-blur-sm border-2 border-primary/30 
        shadow-xl hover:shadow-2xl transition-all duration-300
        ${topic.status === "active" ? "animate-pulse-glow" : ""}
        ${className}
      `}
    >
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold text-balance">{topic.title}</h1>
            {topic.status === "active" && <Sparkles className="w-6 h-6 text-primary" />}
            {topic.status === "locked" && <Lock className="w-6 h-6 text-muted-foreground" />}
          </div>
          <div className="w-20 h-0.5 bg-primary mx-auto"></div>
        </div>

        <p className="text-muted-foreground leading-relaxed text-pretty max-w-2xl">{topic.description}</p>

        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{topic.participantCount} 人参与</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageCircle className="w-4 h-4" />
            <span>第 {topic.roundCount} 轮讨论</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{Math.floor((Date.now() - topic.createdAt.getTime()) / (1000 * 60 * 60 * 24))} 天前</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Badge variant={topic.status === "active" ? "default" : "secondary"}>
            {topic.status === "active" ? "讨论中" : topic.status === "locked" ? "已锁定" : "已归档"}
          </Badge>
        </div>

        {onToggleCollapse && (
          <Button variant="outline" size="sm" onClick={onToggleCollapse} className="mt-4 bg-transparent">
            收起
          </Button>
        )}
      </div>
    </Card>
  )
}
