import { type NextRequest, NextResponse } from "next/server"
import { AIService, type SummaryRequest } from "@/lib/ai-service"

export async function POST(request: NextRequest) {
  try {
    const body: SummaryRequest = await request.json()

    // Validate request
    if (!body.comments || !Array.isArray(body.comments) || body.comments.length === 0) {
      return NextResponse.json({ error: "Comments array is required and cannot be empty" }, { status: 400 })
    }

    if (!body.topicTitle) {
      return NextResponse.json({ error: "Topic title is required" }, { status: 400 })
    }

    // Generate AI summary
    const summary = await AIService.generateSummary(body)

    return NextResponse.json({
      success: true,
      summary,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI summarization error:", error)
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}
