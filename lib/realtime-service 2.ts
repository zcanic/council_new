// WebSocket实时服务
export interface RealtimeEvent {
  type:
    | "comment_added"
    | "user_joined"
    | "user_left"
    | "typing_start"
    | "typing_stop"
    | "round_completed"
    | "summary_generated"
    | "round_locked"
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

// 全局WebSocket连接管理
class RealtimeService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private listeners: Map<string, ((event: RealtimeEvent) => void)[]> = new Map()
  private isConnected = false

  constructor() {
    this.initializeWebSocket()
  }

  private initializeWebSocket() {
    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log('✅ WebSocket连接成功')
        this.isConnected = true
        this.reconnectAttempts = 0
        this.reconnectDelay = 1000
      }

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          this.handleIncomingMessage(message)
        } catch (error) {
          console.error('WebSocket消息解析失败:', error)
        }
      }

      this.ws.onclose = () => {
        console.log('❌ WebSocket连接关闭')
        this.isConnected = false
        this.attemptReconnect()
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket错误:', error)
        this.isConnected = false
      }

    } catch (error) {
      console.error('WebSocket初始化失败:', error)
      this.attemptReconnect()
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ 达到最大重连次数，停止重连')
      return
    }

    this.reconnectAttempts++
    console.log(`尝试第 ${this.reconnectAttempts} 次重连...`)

    setTimeout(() => {
      this.initializeWebSocket()
      this.reconnectDelay *= 2 // 指数退避
    }, this.reconnectDelay)
  }

  private handleIncomingMessage(message: any) {
    const { type, data, timestamp, userId } = message
    
    const event: RealtimeEvent = {
      type,
      data,
      timestamp: new Date(timestamp),
      userId
    }

    // 广播给所有监听器
    this.listeners.forEach((callbacks) => {
      callbacks.forEach((callback) => callback(event))
    })
  }

  private sendMessage(message: any) {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket未连接，消息发送失败')
    }
  }

  subscribe(topicId: string, callback: (event: RealtimeEvent) => void) {
    if (!this.listeners.has(topicId)) {
      this.listeners.set(topicId, [])
    }
    this.listeners.get(topicId)!.push(callback)

    // 发送订阅消息到服务器
    this.sendMessage({
      type: 'subscribe',
      topicId
    })

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(topicId)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }

      // 发送取消订阅消息
      this.sendMessage({
        type: 'unsubscribe',
        topicId
      })
    }
  }

  // Public methods for triggering events
  addComment(topicId: string, comment: any) {
    this.sendMessage({
      type: 'comment_added',
      topicId,
      comment,
      timestamp: new Date().toISOString(),
      userId: 'current-user' // 在实际应用中应该从认证信息获取
    })
  }

  startTyping(topicId: string, userName: string) {
    this.sendMessage({
      type: 'typing_start',
      topicId,
      userName,
      timestamp: new Date().toISOString(),
      userId: 'current-user'
    })
  }

  stopTyping(topicId: string, userName: string) {
    this.sendMessage({
      type: 'typing_stop',
      topicId,
      userName,
      timestamp: new Date().toISOString(),
      userId: 'current-user'
    })
  }

  completeRound(topicId: string, roundNumber: number) {
    this.sendMessage({
      type: 'round_completed',
      topicId,
      roundNumber,
      timestamp: new Date().toISOString()
    })
  }

  lockRound(topicId: string, roundNumber: number) {
    this.sendMessage({
      type: 'round_locked',
      topicId,
      roundNumber,
      timestamp: new Date().toISOString()
    })
  }

  generateSummary(topicId: string, summary: any) {
    this.sendMessage({
      type: 'summary_generated',
      topicId,
      summary,
      timestamp: new Date().toISOString()
    })
  }

  joinTopic(topicId: string, userName: string) {
    this.sendMessage({
      type: 'user_joined',
      topicId,
      userName,
      timestamp: new Date().toISOString(),
      userId: 'current-user'
    })
  }

  leaveTopic(topicId: string, userName: string) {
    this.sendMessage({
      type: 'user_left',
      topicId,
      userName,
      timestamp: new Date().toISOString(),
      userId: 'current-user'
    })
  }

  getConnectionStatus(): boolean {
    return this.isConnected
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.isConnected = false
  }
}

// 导出单例实例
export const realtimeService = new RealtimeService()

// 浏览器关闭时清理连接
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    realtimeService.disconnect()
  })
}
