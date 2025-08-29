"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter } from "lucide-react"
import { ThoughtNode } from "./thought-node"
import type { Topic } from "@/types"

interface LobbyInterfaceProps {
  topics: Topic[]
  onTopicClick: (topic: Topic) => void
  onCreateTopic: () => void
}

export function LobbyInterface({ topics, onTopicClick, onCreateTopic }: LobbyInterfaceProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTopics, setFilteredTopics] = useState(topics)
  const [nodePositions, setNodePositions] = useState<
    Array<{ x: number; y: number; size: "small" | "medium" | "large" }>
  >([])
  const [dragState, setDragState] = useState<{
    isDragging: boolean
    dragIndex: number | null
    startPos: { x: number; y: number }
    offset: { x: number; y: number }
  }>({
    isDragging: false,
    dragIndex: null,
    startPos: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
  })

  // Generate organic, non-overlapping positions for thought nodes
  useEffect(() => {
    const generatePositions = () => {
      const positions: Array<{ x: number; y: number; size: "small" | "medium" | "large" }> = []
      const minDistance = 25 // Minimum distance between nodes

      topics.forEach((topic, index) => {
        let attempts = 0
        let position: { x: number; y: number; size: "small" | "medium" | "large" }

        // Determine size based on activity
        const size = topic.participantCount >= 15 ? "large" : topic.participantCount >= 8 ? "medium" : "small"

        do {
          const cardWidth = size === "large" ? 16 : size === "medium" ? 14 : 12 // rem units
          const cardHeight = size === "large" ? 10 : size === "medium" ? 9 : 8

          position = {
            x: Math.random() * (85 - cardWidth) + cardWidth / 2, // Account for card width
            y: Math.random() * (75 - cardHeight) + cardHeight / 2, // Account for card height
            size,
          }
          attempts++
        } while (
          attempts < 50 &&
          positions.some((pos) => {
            const distance = Math.sqrt(Math.pow(pos.x - position.x, 2) + Math.pow(pos.y - position.y, 2))
            return distance < minDistance
          })
        )

        positions.push(position)
      })

      return positions
    }

    setNodePositions(generatePositions())
  }, [topics])

  const handleDragStart = (index: number, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const containerRect = event.currentTarget.closest(".relative")?.getBoundingClientRect()

    if (!containerRect) return

    setDragState({
      isDragging: true,
      dragIndex: index,
      startPos: { x: event.clientX, y: event.clientY },
      offset: {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      },
    })
  }

  const handleDragMove = (event: React.MouseEvent) => {
    if (!dragState.isDragging || dragState.dragIndex === null) return

    const containerRect = event.currentTarget.getBoundingClientRect()
    const newX = ((event.clientX - dragState.offset.x - containerRect.left) / containerRect.width) * 100
    const newY = ((event.clientY - dragState.offset.y - containerRect.top) / containerRect.height) * 100

    // Boundary constraints
    const constrainedX = Math.max(5, Math.min(90, newX))
    const constrainedY = Math.max(5, Math.min(85, newY))

    setNodePositions((prev) =>
      prev.map((pos, index) => (index === dragState.dragIndex ? { ...pos, x: constrainedX, y: constrainedY } : pos)),
    )
  }

  const handleDragEnd = () => {
    setDragState({
      isDragging: false,
      dragIndex: null,
      startPos: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
    })
  }

  // Filter topics based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTopics(topics)
    } else {
      setFilteredTopics(
        topics.filter(
          (topic) =>
            topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            topic.description.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    }
  }, [searchQuery, topics])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative z-10 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-balance">Council</h1>
              <p className="text-muted-foreground text-balance">探索思想的交汇点</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索议题..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
              <Button onClick={onCreateTopic} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                发起议题
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Thought Nodes Canvas */}
      <div
        className="relative min-h-[80vh] overflow-hidden"
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(116, 185, 155, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(116, 185, 155, 0.2) 0%, transparent 50%)`,
            }}
          />
        </div>

        {/* Thought Nodes */}
        {filteredTopics.map((topic, index) => {
          const position = nodePositions[index]
          if (!position) return null

          return (
            <ThoughtNode
              key={topic.id}
              topic={topic}
              size={position.size}
              position={{ x: position.x, y: position.y }}
              onClick={onTopicClick}
              onDragStart={(e) => handleDragStart(index, e)}
              isDragging={dragState.isDragging && dragState.dragIndex === index}
            />
          )
        })}

        {/* Empty State */}
        {filteredTopics.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl opacity-20">🤔</div>
              <h3 className="text-xl font-semibold">没有找到相关议题</h3>
              <p className="text-muted-foreground">尝试调整搜索条件或发起新的讨论</p>
              <Button onClick={onCreateTopic} className="mt-4">
                发起新议题
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-muted/30 border-t border-border/50">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <span>活跃议题: {topics.filter((t) => t.status === "active").length}</span>
            <span>总参与人数: {topics.reduce((sum, t) => sum + t.participantCount, 0)}</span>
            <span>讨论轮次: {topics.reduce((sum, t) => sum + t.roundCount, 0)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
