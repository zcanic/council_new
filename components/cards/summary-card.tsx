"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, AlertTriangle, HelpCircle, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import type { AISummary } from "@/types"

interface SummaryCardProps {
  summary: AISummary
  onStartNewRound?: () => void
  className?: string
}

export function SummaryCard({ summary, onStartNewRound, className = "" }: SummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card
      className={`
        w-full max-w-2xl p-6 bg-gradient-to-br from-primary/10 to-accent/10 
        border-2 border-primary/30 shadow-xl backdrop-blur-sm
        transition-all duration-500 hover:shadow-2xl
        ${className}
      `}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">AI 智慧总结</h3>
              <p className="text-sm text-muted-foreground">{summary.generatedAt ? new Date(summary.generatedAt).toLocaleString("zh-CN") : '刚刚'}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            第 {(summary.roundId || '1-1').split("-")[1]} 轮
          </Badge>
        </div>

        {/* Main Summary */}
        <div className="space-y-4">
          <div className="p-4 bg-card/50 rounded-lg border border-border/30">
            <p className="text-sm leading-relaxed text-pretty">{summary.content}</p>
          </div>

          {/* Expandable Details */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2"
          >
            {isExpanded ? "收起详情" : "展开详情"}
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>

          {isExpanded && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              {/* Consensus Points */}
              {(summary.consensus || []).length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <h4 className="text-sm font-medium">主要共识</h4>
                  </div>
                  <ul className="space-y-1 ml-6">
                    {(summary.consensus || []).map((point, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disagreements */}
              {(summary.disagreements || []).length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <h4 className="text-sm font-medium">主要分歧</h4>
                  </div>
                  <ul className="space-y-1 ml-6">
                    {(summary.disagreements || []).map((point, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* New Questions */}
              {(summary.newQuestions || []).length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-medium">新的问题</h4>
                  </div>
                  <ul className="space-y-1 ml-6">
                    {(summary.newQuestions || []).map((question, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {question}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        {onStartNewRound && (
          <div className="pt-4 border-t border-border/30">
            <Button onClick={onStartNewRound} className="w-full">
              基于此总结开启新一轮讨论
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
