export interface RealtimeMessage {
  type: "comment" | "typing" | "presence"
  data: any
  timestamp: number
}

export interface Participant {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
  lastSeen?: number
  isTyping?: boolean
}

export interface TypingIndicator {
  userId: string
  userName: string
  isTyping: boolean
}

export interface RealtimeEvent {
  type: string
  data: any
  timestamp: number
}