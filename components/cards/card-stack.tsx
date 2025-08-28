"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CardStackProps {
  children: React.ReactNode[]
  currentIndex?: number
  onIndexChange?: (index: number) => void
  showNavigation?: boolean
  stackOffset?: number
  className?: string
}

export function CardStack({
  children,
  currentIndex = 0,
  onIndexChange,
  showNavigation = true,
  stackOffset = 8,
  className = "",
}: CardStackProps) {
  const [activeIndex, setActiveIndex] = useState(currentIndex)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setActiveIndex(currentIndex)
  }, [currentIndex])

  const handleIndexChange = (newIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(children.length - 1, newIndex))
    setActiveIndex(clampedIndex)
    onIndexChange?.(clampedIndex)
  }

  const handlePrevious = () => {
    handleIndexChange(activeIndex - 1)
  }

  const handleNext = () => {
    handleIndexChange(activeIndex + 1)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setDragOffset({ x: 0, y: 0 })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleMouseUp = () => {
    if (!isDragging) return

    const threshold = 100
    if (Math.abs(dragOffset.x) > threshold) {
      if (dragOffset.x > 0) {
        handlePrevious()
      } else {
        handleNext()
      }
    }

    setIsDragging(false)
    setDragOffset({ x: 0, y: 0 })
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Card Stack */}
      <div className="relative w-full h-full">
        {children.map((child, index) => {
          const isActive = index === activeIndex
          const offset = index - activeIndex
          const isVisible = Math.abs(offset) <= 2

          if (!isVisible) return null

          return (
            <div
              key={index}
              className={`
                absolute inset-0 transition-all duration-300 ease-out cursor-grab
                ${isDragging && isActive ? "cursor-grabbing" : ""}
                ${isActive ? "z-20" : "z-10"}
              `}
              style={{
                transform: `
                  translateX(${isActive ? dragOffset.x : offset * stackOffset}px)
                  translateY(${Math.abs(offset) * 4}px)
                  scale(${isActive ? 1 : 1 - Math.abs(offset) * 0.05})
                `,
                opacity: isActive ? 1 : Math.max(0.3, 1 - Math.abs(offset) * 0.3),
              }}
              onMouseDown={isActive ? handleMouseDown : undefined}
              onMouseMove={isActive ? handleMouseMove : undefined}
              onMouseUp={isActive ? handleMouseUp : undefined}
              onMouseLeave={handleMouseUp}
            >
              {child}
            </div>
          )
        })}
      </div>

      {/* Navigation */}
      {showNavigation && children.length > 1 && (
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-4 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={activeIndex === 0}
              className="w-8 h-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1">
              {children.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleIndexChange(index)}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-200
                    ${index === activeIndex ? "bg-primary w-6" : "bg-muted hover:bg-muted-foreground/50"}
                  `}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={activeIndex === children.length - 1}
              className="w-8 h-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Card Counter */}
      <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-muted-foreground border border-border/50">
        {activeIndex + 1} / {children.length}
      </div>
    </div>
  )
}
