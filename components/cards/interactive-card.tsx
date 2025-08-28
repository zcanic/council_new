"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Heart, Reply, Share, Flag } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface InteractiveCardProps {
  children: React.ReactNode
  onLike?: () => void
  onReply?: () => void
  onShare?: () => void
  onReport?: () => void
  isLiked?: boolean
  likeCount?: number
  className?: string
}

export function InteractiveCard({
  children,
  onLike,
  onReply,
  onShare,
  onReport,
  isLiked = false,
  likeCount = 0,
  className = "",
}: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const cardRef = useRef<HTMLDivElement>(null)

  const createRipple = (e: React.MouseEvent) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newRipple = {
      id: Date.now(),
      x,
      y,
    }

    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
    }, 600)
  }

  return (
    <div
      ref={cardRef}
      className={`
        relative group transition-all duration-300 
        ${isHovered ? "scale-105" : "scale-100"}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={createRipple}
    >
      {/* Ripple Effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-4 h-4 bg-primary/30 rounded-full animate-ping" />
        </div>
      ))}

      {/* Main Card Content */}
      <Card className="relative overflow-hidden bg-card/90 backdrop-blur-sm border-2 border-border/50 hover:border-primary/30 transition-all duration-300">
        {children}

        {/* Interaction Overlay */}
        <div
          className={`
            absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent
            transition-all duration-300 transform
            ${isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
          `}
        >
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onLike?.()
                }}
                className={`
                  h-8 px-3 text-xs transition-all duration-200
                  ${isLiked ? "text-red-500 bg-red-50 hover:bg-red-100" : ""}
                `}
              >
                <Heart className={`w-3 h-3 mr-1 ${isLiked ? "fill-current" : ""}`} />
                {likeCount > 0 ? likeCount : "赞同"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onReply?.()
                }}
                className="h-8 px-3 text-xs"
              >
                <Reply className="w-3 h-3 mr-1" />
                回复
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onShare?.()
                }}
                className="h-8 px-3 text-xs"
              >
                <Share className="w-3 h-3 mr-1" />
                分享
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onReport}>
                  <Flag className="w-4 h-4 mr-2" />
                  举报
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    </div>
  )
}
