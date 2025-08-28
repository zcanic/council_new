"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TreePine, ChevronDown, ChevronRight, Sparkles, MessageSquare } from "lucide-react"
import type { Round } from "@/lib/types"

interface DiscussionTreeProps {
  rounds: Round[]
  activeRoundId: string | null
  onRoundSelect: (roundId: string) => void
}

interface TreeNode {
  round: Round
  children: TreeNode[]
  level: number
}

export function DiscussionTree({ rounds, activeRoundId, onRoundSelect }: DiscussionTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  // Build tree structure from rounds
  const buildTree = (rounds: Round[]): TreeNode[] => {
    const rootRounds = rounds.filter((r) => r.roundNumber === 1)

    const buildNode = (round: Round, level = 0): TreeNode => {
      const children = rounds
        .filter((r) => r.parentSummary && r.roundNumber === round.roundNumber + 1)
        .map((r) => buildNode(r, level + 1))

      return { round, children, level }
    }

    return rootRounds.map((r) => buildNode(r))
  }

  const toggleExpanded = (roundId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(roundId)) {
        newSet.delete(roundId)
      } else {
        newSet.add(roundId)
      }
      return newSet
    })
  }

  const renderNode = (node: TreeNode) => {
    const isExpanded = expandedNodes.has(node.round.id)
    const isActive = activeRoundId === node.round.id
    const hasChildren = node.children.length > 0

    return (
      <div key={node.round.id} className="space-y-2">
        <div
          className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
            isActive
              ? "bg-council-sage/10 border-council-sage/30"
              : "bg-council-cream/30 border-council-sage/10 hover:bg-council-mint/20"
          }`}
          style={{ marginLeft: `${node.level * 24}px` }}
        >
          {hasChildren && (
            <Button variant="ghost" size="sm" className="w-6 h-6 p-0" onClick={() => toggleExpanded(node.round.id)}>
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </Button>
          )}

          <Button
            variant="ghost"
            className="flex-1 justify-start h-auto p-0"
            onClick={() => onRoundSelect(node.round.id)}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">第 {node.round.roundNumber} 轮</span>

              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {node.round.comments.length}
                </Badge>

                {node.round.summary && (
                  <Badge className="text-xs bg-council-mint/20 text-council-sage">
                    <Sparkles className="w-3 h-3 mr-1" />
                    已蒸馏
                  </Badge>
                )}
              </div>
            </div>
          </Button>
        </div>

        {hasChildren && isExpanded && <div className="space-y-2">{node.children.map(renderNode)}</div>}
      </div>
    )
  }

  const treeNodes = buildTree(rounds)

  return (
    <Card className="border-council-sage/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-council-charcoal">
          <TreePine className="w-5 h-5 text-council-sage" />
          讨论演化树
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">{treeNodes.map(renderNode)}</CardContent>
    </Card>
  )
}
