"use client"

import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"
import type { Participant } from "@/lib/realtime-service"

interface TypingIndicatorProps {
  typingParticipants: Participant[]
}

export function TypingIndicator({ typingParticipants }: TypingIndicatorProps) {
  if (typingParticipants.length === 0) return null

  const getTypingText = () => {
    if (typingParticipants.length === 1) {
      return `${typingParticipants[0].name} 正在输入...`
    } else if (typingParticipants.length === 2) {
      return `${typingParticipants[0].name} 和 ${typingParticipants[1].name} 正在输入...`
    } else {
      return `${typingParticipants[0].name} 等 ${typingParticipants.length} 人正在输入...`
    }
  }

  return (
    <div className="flex items-center justify-center py-2">
      <Badge variant="secondary" className="bg-council-mint/20 text-council-sage animate-pulse">
        <MessageSquare className="w-3 h-3 mr-2" />
        {getTypingText()}
      </Badge>
    </div>
  )
}
