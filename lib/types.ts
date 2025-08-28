export interface Topic {
  id: string
  title: string
  description: string
  createdAt: Date
  participantCount: number
  roundCount: number
  status: "active" | "locked" | "archived"
  createdBy: string
}

export interface Comment {
  id: string
  topicId: string
  roundId: string
  content: string
  author: Author
  createdAt: Date
  position: number // 1-10 position in the round
}

export interface Round {
  id: string
  topicId: string
  parentRoundId?: string // For nested rounds
  roundNumber: number
  comments: Comment[]
  summary?: {
    consensus: string[]
    disagreements: string[]
    newQuestions: string[]
    overallSummary: string
    keyInsights: string[]
  }
  parentSummary?: {
    consensus: string[]
    disagreements: string[]
    newQuestions: string[]
    overallSummary: string
    keyInsights: string[]
  }
  status: "active" | "locked" | "archived"
  createdAt: Date
}

export interface AISummary {
  id: string
  roundId: string
  content: string
  consensus: string[]
  disagreements: string[]
  newQuestions: string[]
  generatedAt: Date
}

export interface User {
  id: string
  name: string
  avatar?: string
  joinedAt: Date
}

export interface DiscussionState {
  currentTopic: Topic
  rounds: Round[]
  activeRoundId: string | null
  participantCount: number
  totalComments: number
}

export interface Author {
  id: string
  name: string
  avatar?: string
}
