import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { topics, rounds, comments, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const topicId = params.id

    const [topic] = await db
      .select()
      .from(topics)
      .where(eq(topics.id, topicId))

    if (!topic) {
      return NextResponse.json(
        { success: false, error: 'Topic not found' },
        { status: 404 }
      )
    }

    // 获取所有轮次
    const topicRounds = await db
      .select()
      .from(rounds)
      .where(eq(rounds.topicId, topicId))
      .orderBy(rounds.roundNumber)

    // 获取所有评论
    const topicComments = await db
      .select({
        id: comments.id,
        content: comments.content,
        positionType: comments.positionType,
        createdAt: comments.createdAt,
        user: {
          id: users.id,
          username: users.username
        }
      })
      .from(comments)
      .where(eq(comments.topicId, topicId))
      .leftJoin(users, eq(comments.userId, users.id))

    // 按轮次分组评论
    const roundsWithComments = topicRounds.map(round => ({
      ...round,
      comments: topicComments.filter(comment => 
        comment.id.startsWith(`${round.id}-`)
      )
    }))

    return NextResponse.json({
      success: true,
      data: {
        ...topic,
        rounds: roundsWithComments
      }
    })
  } catch (error) {
    console.error('Get topic error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch topic' },
      { status: 500 }
    )
  }
}