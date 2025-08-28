"use client"

import { useState, useEffect, useCallback } from "react"
import { realtimeService, type RealtimeEvent, type Participant } from "@/lib/realtime-service"

export function useRealtime(topicId: string) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected">("connected")
  const [recentEvents, setRecentEvents] = useState<RealtimeEvent[]>([])

  useEffect(() => {
    setConnectionStatus("connecting")

    // Initialize participants
    setParticipants(realtimeService.getParticipants())
    setConnectionStatus("connected")

    // Subscribe to real-time events
    const unsubscribe = realtimeService.subscribe(topicId, (event: RealtimeEvent) => {
      console.log("[v0] Realtime event received:", event)

      // Add to recent events
      setRecentEvents((prev) => [event, ...prev.slice(0, 9)]) // Keep last 10 events

      switch (event.type) {
        case "user_joined":
          setParticipants((prev) =>
            prev.map((p) => (p.id === event.data.userId ? { ...p, isOnline: true, lastSeen: event.timestamp } : p)),
          )
          break

        case "user_left":
          setParticipants((prev) =>
            prev.map((p) => (p.id === event.data.userId ? { ...p, isOnline: false, lastSeen: event.timestamp } : p)),
          )
          break

        case "typing_start":
          setTypingUsers((prev) => new Set([...prev, event.data.userId]))
          break

        case "typing_stop":
          setTypingUsers((prev) => {
            const newSet = new Set(prev)
            newSet.delete(event.data.userId)
            return newSet
          })
          break
      }
    })

    return unsubscribe
  }, [topicId])

  const broadcastComment = useCallback(
    (comment: any) => {
      realtimeService.addComment(topicId, comment)
    },
    [topicId],
  )

  const startTyping = useCallback(
    (userName: string) => {
      realtimeService.startTyping(topicId, userName)
    },
    [topicId],
  )

  const stopTyping = useCallback(
    (userName: string) => {
      realtimeService.stopTyping(topicId, userName)
    },
    [topicId],
  )

  const onlineParticipants = participants.filter((p) => p.isOnline)
  const typingParticipants = participants.filter((p) => typingUsers.has(p.id))

  return {
    participants,
    onlineParticipants,
    typingParticipants,
    connectionStatus,
    recentEvents,
    broadcastComment,
    startTyping,
    stopTyping,
  }
}
