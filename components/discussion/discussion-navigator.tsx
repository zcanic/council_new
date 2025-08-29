"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, MessageSquare, Sparkles, Lock } from "lucide-react"
import type { Round } from "@/types"

interface DiscussionNavigatorProps {
  rounds: Round[]
  activeRoundId: string | null
  onRoundSelect: (roundId: string) => void
  participantCount: number
}

export function DiscussionNavigator({
  rounds,
  activeRoundId,
  onRoundSelect,
  participantCount,
}: DiscussionNavigatorProps) {
  return (
    <div className="bg-council-cream/50 rounded-xl p-4 border border-council-sage/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-council-charcoal">讨论进程</h3>
        <div className="flex items-center gap-2 text-sm text-council-sage/70">
          <Users className="w-4 h-4" />
          {participantCount} 人参与
        </div>
      </div>

      <div className="space-y-2">
        {rounds.map((round) => (
          <Button
            key={round.id}
            variant={activeRoundId === round.id ? "default" : "ghost"}
            className={`w-full justify-start h-auto p-3 ${
              activeRoundId === round.id ? "bg-council-sage text-white" : "hover:bg-council-mint/20"
            }`}
            onClick={() => onRoundSelect(round.id)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {round.status === "locked" && <Lock className="w-3 h-3" />}
                  {round.summary && <Sparkles className="w-3 h-3" />}
                  <span className="font-medium">第 {round.roundNumber} 轮</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    {round.comments.length}
                  </Badge>

                  {round.status === "active" && round.comments.length >= 10 && (
                    <Badge className="text-xs bg-council-mint text-council-charcoal">可蒸馏</Badge>
                  )}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                <Clock className="w-3 h-3 inline mr-1" />
                {round.createdAt.toLocaleDateString()}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
