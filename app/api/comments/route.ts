import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { comments, rounds, topics, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      topicId, 
      roundId, 
      userId, 
      content, 
      positionType = 'neutral',
      isAnonymous = false,
      username
    } = body

    if (!topicId || !content || !username) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 获取或创建用户
    let user
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)

    if (existingUsers.length > 0) {
      user = existingUsers[0]
    } else {
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const [newUser] = await db
        .insert(users)
        .values({
          id: newUserId,
          username,
          sessionCookie: `session_${Date.now()}`
        })
        .returning()
      user = newUser
    }

    // 获取当前活跃轮次（如果未指定roundId）
    let targetRoundId = roundId
    if (!targetRoundId) {
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

      const [currentRound] = await db
        .select()
        .from(rounds)
        .where(eq(rounds.topicId, topicId))
        .where(eq(rounds.roundNumber, topic.currentRound))
        .where(eq(rounds.status, 'active'))

      if (!currentRound) {
        return NextResponse.json(
          { success: false, error: 'No active round found' },
          { status: 400 }
        )
      }

      targetRoundId = currentRound.id
    }

    // 检查轮次是否活跃
    const [round] = await db
      .select()
      .from(rounds)
      .where(eq(rounds.id, targetRoundId))

    if (!round || round.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Round is not active' },
        { status: 400 }
      )
    }

    // 创建评论
    const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const [newComment] = await db
      .insert(comments)
      .values({
        id: commentId,
        topicId,
        roundId: targetRoundId,
        userId: user.id,
        content,
        positionType,
        isAnonymous,
        status: 'active'
      })
      .returning()

    // 更新轮次评论计数
    await db
      .update(rounds)
      .set({ commentCount: round.commentCount + 1 })
      .where(eq(rounds.id, targetRoundId))

    // 更新话题参与人数（如果是新用户）
    if (!existingUsers.length) {
      await db
        .update(topics)
        .set({ participantCount: topics.participantCount + 1 })
        .where(eq(topics.id, topicId))
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        ...newComment,
        user: {
          id: user.id,
          username: user.username
        }
      }
    })

  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}