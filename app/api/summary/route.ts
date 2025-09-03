import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { comments, rounds, topics, summaries } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { AIService } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { roundId } = body

    if (!roundId) {
      return NextResponse.json(
        { success: false, error: 'Round ID is required' },
        { status: 400 }
      )
    }

    // 获取轮次和话题信息
    const [round] = await db
      .select()
      .from(rounds)
      .where(eq(rounds.id, roundId))

    if (!round) {
      return NextResponse.json(
        { success: false, error: 'Round not found' },
        { status: 404 }
      )
    }

    const [topic] = await db
      .select()
      .from(topics)
      .where(eq(topics.id, round.topicId))

    if (!topic) {
      return NextResponse.json(
        { success: false, error: 'Topic not found' },
        { status: 404 }
      )
    }

    // 获取该轮次的所有评论
    const roundComments = await db
      .select({
        id: comments.id,
        content: comments.content,
        positionType: comments.positionType,
        userId: comments.userId
      })
      .from(comments)
      .where(eq(comments.roundId, roundId))
      .where(eq(comments.status, 'active'))

    if (roundComments.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No comments found for this round' },
        { status: 400 }
      )
    }

    // 初始化AI服务
    const aiService = new AIService(
      process.env.AI_BASE_URL || 'https://api.openai.com',
      process.env.AI_API_KEY || '',
      process.env.AI_MODEL || 'gpt-3.5-turbo'
    )

    // 生成AI总结
    const aiSummary = await aiService.generateSummary({
      comments: roundComments,
      topicTitle: topic.title,
      roundNumber: round.roundNumber
    })

    // 保存总结到数据库
    const summaryId = `summary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const [newSummary] = await db
      .insert(summaries)
      .values({
        id: summaryId,
        roundId,
        content: aiSummary.summary,
        consensus: aiSummary.consensus,
        disagreements: aiSummary.disagreements,
        newQuestions: aiSummary.newQuestions,
        referencedComments: aiSummary.referencedComments,
        sentimentScore: Math.round(aiSummary.convergenceScore * 100),
        clarityScore: 85, // 默认清晰度分数
        modelVersion: process.env.AI_MODEL || 'gpt-3.5-turbo'
      })
      .returning()

    return NextResponse.json({
      success: true,
      data: {
        ...newSummary,
        sentiment: aiSummary.sentiment,
        convergenceScore: aiSummary.convergenceScore
      }
    })

  } catch (error) {
    console.error('Generate summary error:', error)
    
    // 返回错误但提供降级体验
    return NextResponse.json({
      success: false,
      error: 'AI summary generation failed',
      fallback: {
        summary: 'AI总结生成暂时不可用，请稍后重试。',
        consensus: ['系统维护中'],
        disagreements: ['技术问题待解决'],
        newQuestions: ['如何改善系统稳定性？'],
        referencedComments: [],
        sentiment: 'neutral',
        convergenceScore: 0.5
      }
    }, { status: 500 })
  }
}