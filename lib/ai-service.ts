export interface SummaryResponse {
  summary: string
  keyPoints: string[]
  sentiment: "positive" | "negative" | "neutral"
  convergenceScore: number
  nextSteps: string[]
}