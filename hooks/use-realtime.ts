"use client"

import { useState, useEffect } from "react"

export function useRealtime(topicId?: string) {
  const [participants, setParticipants] = useState([
    { id: "1", name: "tech_enthusiast", avatar: "/placeholder-user.jpg", isOnline: true },
    { id: "2", name: "creative_mind", avatar: "/placeholder-user.jpg", isOnline: true },
    { id: "3", name: "urban_planner", avatar: "/placeholder-user.jpg", isOnline: false }
  ])
  const [onlineParticipants, setOnlineParticipants] = useState(participants.filter(p => p.isOnline))
  const [typingParticipants, setTypingParticipants] = useState<string[]>([])
  const [connectionStatus, setConnectionStatus] = useState("connected")

  useEffect(() => {
    // 模拟实时数据更新
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setTypingParticipants(["tech_enthusiast"])
        setTimeout(() => setTypingParticipants([]), 3000)
      }
    }, 8000)

    return () => {
      clearInterval(typingInterval)
    }
  }, [topicId])

  const broadcastComment = (comment: any) => {
    console.log("Broadcasting comment:", comment)
  }

  const startTyping = (userName: string) => {
    setTypingParticipants(prev => [...prev.filter(name => name !== userName), userName])
  }

  const stopTyping = (userName: string) => {
    setTypingParticipants(prev => prev.filter(name => name !== userName))
  }

  return {
    participants,
    onlineParticipants,
    typingParticipants,
    connectionStatus,
    broadcastComment,
    startTyping,
    stopTyping
  }
}