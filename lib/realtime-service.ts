// Mock real-time service that simulates WebSocket behavior
export interface RealtimeEvent {
  type:
    | "comment_added"
    | "user_joined"
    | "user_left"
    | "typing_start"
    | "typing_stop"
    | "round_completed"
    | "summary_generated"
  data: any
  timestamp: Date
  userId: string
}

export interface Participant {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
  lastSeen: Date
  isTyping: boolean
}

class MockRealtimeService {
  private listeners: Map<string, ((event: RealtimeEvent) => void)[]> = new Map()
  private participants: Map<string, Participant> = new Map()
  private currentUserId = `user-${Math.random().toString(36).substr(2, 9)}`

  // Simulate some active participants
  constructor() {
    this.addMockParticipants()
    this.startMockActivity()
  }

  private addMockParticipants() {
    const mockUsers = [
      { name: "光学研究员", avatar: "👨‍🔬" },
      { name: "伦理学者", avatar: "👩‍🎓" },
      { name: "工程师", avatar: "👨‍💻" },
      { name: "设计师", avatar: "👩‍🎨" },
      { name: "产品经理", avatar: "👨‍💼" },
    ]

    mockUsers.forEach((user, index) => {
      const participant: Participant = {
        id: `mock-user-${index}`,
        name: user.name,
        avatar: user.avatar,
        isOnline: Math.random() > 0.3,
        lastSeen: new Date(Date.now() - Math.random() * 1000 * 60 * 30),
        isTyping: false,
      }
      this.participants.set(participant.id, participant)
    })
  }

  private startMockActivity() {
    // Simulate random user activity
    setInterval(() => {
      const participants = Array.from(this.participants.values())
      const onlineParticipants = participants.filter((p) => p.isOnline)

      if (onlineParticipants.length > 0) {
        const randomUser = onlineParticipants[Math.floor(Math.random() * onlineParticipants.length)]

        // Random typing activity
        if (Math.random() > 0.8) {
          this.simulateTyping(randomUser.id)
        }

        // Random user join/leave
        if (Math.random() > 0.95) {
          this.simulateUserActivity()
        }
      }
    }, 3000)
  }

  private simulateTyping(userId: string) {
    const participant = this.participants.get(userId)
    if (!participant) return

    // Start typing
    participant.isTyping = true
    this.emit("typing_start", { userId, userName: participant.name })

    // Stop typing after random delay
    setTimeout(
      () => {
        participant.isTyping = false
        this.emit("typing_stop", { userId, userName: participant.name })
      },
      2000 + Math.random() * 3000,
    )
  }

  private simulateUserActivity() {
    const participants = Array.from(this.participants.values())
    const randomUser = participants[Math.floor(Math.random() * participants.length)]

    if (randomUser.isOnline) {
      randomUser.isOnline = false
      this.emit("user_left", { userId: randomUser.id, userName: randomUser.name })
    } else {
      randomUser.isOnline = true
      randomUser.lastSeen = new Date()
      this.emit("user_joined", { userId: randomUser.id, userName: randomUser.name })
    }
  }

  subscribe(topicId: string, callback: (event: RealtimeEvent) => void) {
    if (!this.listeners.has(topicId)) {
      this.listeners.set(topicId, [])
    }
    this.listeners.get(topicId)!.push(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(topicId)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  private emit(type: RealtimeEvent["type"], data: any) {
    const event: RealtimeEvent = {
      type,
      data,
      timestamp: new Date(),
      userId: this.currentUserId,
    }

    // Emit to all topic listeners
    this.listeners.forEach((callbacks) => {
      callbacks.forEach((callback) => callback(event))
    })
  }

  // Public methods for triggering events
  addComment(topicId: string, comment: any) {
    this.emit("comment_added", { topicId, comment })
  }

  startTyping(topicId: string, userName: string) {
    this.emit("typing_start", { topicId, userId: this.currentUserId, userName })
  }

  stopTyping(topicId: string, userName: string) {
    this.emit("typing_stop", { topicId, userId: this.currentUserId, userName })
  }

  completeRound(topicId: string, roundNumber: number) {
    this.emit("round_completed", { topicId, roundNumber })
  }

  generateSummary(topicId: string, summary: any) {
    this.emit("summary_generated", { topicId, summary })
  }

  getParticipants(): Participant[] {
    return Array.from(this.participants.values())
  }

  getCurrentUserId(): string {
    return this.currentUserId
  }
}

export const realtimeService = new MockRealtimeService()
