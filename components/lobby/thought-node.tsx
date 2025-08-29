"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MessageCircle, Clock, Sparkles } from "lucide-react"
import type { Topic } from "@/types"

interface ThoughtNodeProps {
  topic: Topic
  size: "small" | "medium" | "large"
  position: { x: number; y: number }
  onClick: (topic: Topic) => void
  onDragStart?: (event: React.MouseEvent) => void
  isDragging?: boolean
}

export function ThoughtNode({ topic, size, position, onClick, onDragStart, isDragging }: ThoughtNodeProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    small: "w-48 h-36 min-h-0",
    medium: "w-56 h-40 min-h-0",
    large: "w-64 h-44 min-h-0",
  }

  const getStatusColor = (status: Topic["status"]) => {
    switch (status) {
      case "active":
        return "bg-primary/20 border-primary/40"
      case "locked":
        return "bg-accent/20 border-accent/40"
      case "archived":
        return "bg-muted/20 border-muted/40"
      default:
        return "bg-card/20 border-border"
    }
  }

  const getActivityLevel = (participantCount: number) => {
    if (participantCount >= 15) return "high"
    if (participantCount >= 8) return "medium"
    return "low"
  }

  const activityLevel = getActivityLevel(topic.participantCount)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (onDragStart) {
      e.preventDefault()
      onDragStart(e)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      onClick(topic)
    }
  }

  return (
    <div
      className="absolute transition-all duration-500 ease-out"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: isHovered && !isDragging ? "scale(1.05)" : "scale(1)",
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: isDragging ? 50 : 1,
      }}
    >
      <Card
        className={`
          ${sizeClasses[size]} p-4 cursor-pointer transition-all duration-300
          ${getStatusColor(topic.status)} backdrop-blur-sm
          hover:shadow-xl hover:shadow-primary/20
          ${activityLevel === "high" ? "animate-pulse-glow" : ""}
          ${size === "large" ? "animate-float" : ""}
          ${size === "medium" ? "animate-float [animation-delay:1s]" : ""}
          ${size === "small" ? "animate-float [animation-delay:2s]" : ""}
          ${isDragging ? "shadow-2xl shadow-primary/30" : ""}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <div className="h-full flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-semibold text-balance line-clamp-2 flex-1">{topic.title}</h3>
              {topic.status === "active" && <Sparkles className="w-4 h-4 text-primary ml-2 flex-shrink-0" />}
            </div>

            {isHovered && (
              <p className="text-xs text-muted-foreground text-pretty line-clamp-2 animate-in fade-in duration-200">
                {topic.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-3 h-3" />
                {topic.participantCount}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <MessageCircle className="w-3 h-3" />第{topic.roundCount}轮
              </span>
            </div>

            {isHovered && (
              <div className="flex items-center gap-1 text-muted-foreground animate-in fade-in duration-200">
                <Clock className="w-3 h-3" />
                {Math.floor((Date.now() - topic.createdAt.getTime()) / (1000 * 60 * 60 * 24))}天前
              </div>
            )}
          </div>

          {isHovered && (
            <div className="mt-2 animate-in fade-in duration-200">
              <Badge variant="secondary" className="text-xs">
                {topic.status === "active" ? "讨论中" : topic.status === "locked" ? "已锁定" : "已归档"}
              </Badge>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
