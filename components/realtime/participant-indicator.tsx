"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Users, Wifi, WifiOff } from "lucide-react"
import type { Participant } from "@/lib/realtime-service"

interface ParticipantIndicatorProps {
  participants: Participant[]
  onlineCount: number
  connectionStatus: "connected" | "connecting" | "disconnected"
}

export function ParticipantIndicator({ participants, onlineCount, connectionStatus }: ParticipantIndicatorProps) {
  const onlineParticipants = participants.filter((p) => p.isOnline)

  return (
    <TooltipProvider>
      <div className="flex items-center gap-3 bg-council-cream/50 rounded-lg px-3 py-2 border border-council-sage/10">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {connectionStatus === "connected" ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : connectionStatus === "connecting" ? (
            <Wifi className="w-4 h-4 text-yellow-500 animate-pulse" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}

          <Badge variant="secondary" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            {onlineCount} 在线
          </Badge>
        </div>

        {/* Participant Avatars */}
        <div className="flex -space-x-2">
          {onlineParticipants.slice(0, 5).map((participant) => (
            <Tooltip key={participant.id}>
              <TooltipTrigger>
                <Avatar className="w-6 h-6 border-2 border-background">
                  <AvatarFallback className="text-xs bg-council-mint text-council-charcoal">
                    {participant.avatar || participant.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{participant.name}</p>
                <p className="text-xs text-muted-foreground">{participant.isTyping ? "正在输入..." : "在线"}</p>
              </TooltipContent>
            </Tooltip>
          ))}

          {onlineParticipants.length > 5 && (
            <div className="w-6 h-6 rounded-full bg-council-sage text-white text-xs flex items-center justify-center border-2 border-background">
              +{onlineParticipants.length - 5}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
