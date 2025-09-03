import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rounds, topics } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topicId, action } = body // action: 'start' | 'lock' | 'next'

    if (!topicId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

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

    if (action === 'start') {
      // 开启新轮次
      const newRoundNumber = topic.roundCount + 1
      
      if (newRoundNumber > topic.maxRounds) {
        return NextResponse.json(
          { success: false, error: 'Maximum rounds reached' },
          { status: 400 }
        )
      }

      const roundId = `round_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const [newRound] = await db
        .insert(rounds)
        .values({
          id: roundId,
          topicId,
          roundNumber: newRoundNumber,
          status: 'active',
          commentCount: 0,
          maxComments: 10
        })
        .returning()

      // 更新话题状态
      await db
        .update(topics)
        .set({ 
          roundCount: newRoundNumber,
          currentRound: newRoundNumber 
        })
        .where(eq(topics.id, topicId))

      return NextResponse.json({ success: true, data: newRound })

    } else if (action === 'lock') {
      // 锁定当前轮次
      const [currentRound] = await db
        .select()
        .from(rounds)
        .where(eq(rounds.topicId, topicId))
        .where(eq(rounds.roundNumber, topic.currentRound))

      if (currentRound) {
        await db
          .update(rounds)
          .set({ status: 'completed', endTime: new Date() })
          .where(eq(rounds.id, currentRound.id))
      }

      return NextResponse.json({ success: true, message: 'Round locked' })

    } else if (action === 'next') {
      // 进入下一轮（先锁定当前，再开启新轮次）
      const [currentRound] = await db
        .select()
        .from(rounds)
        .where(eq(rounds.topicId, topicId))
        .where(eq(rounds.roundNumber, topic.currentRound))

      if (currentRound) {
        await db
          .update(rounds)
          .set({ status: 'completed', endTime: new Date() })
          .where(eq(rounds.id, currentRound.id))
      }

      // 开启新轮次
      const newRoundNumber = topic.roundCount + 1
      
      if (newRoundNumber > topic.maxRounds) {
        return NextResponse.json(
          { success: false, error: 'Maximum rounds reached' },
          { status: 400 }
        )
      }

      const roundId = `round_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const [newRound] = await db
        .insert(rounds)
        .values({
          id: roundId,
          topicId,
          roundNumber: newRoundNumber,
          status: 'active',
          commentCount: 0,
          maxComments: 10
        })
        .returning()

      await db
        .update(topics)
        .set({ 
          roundCount: newRoundNumber,
          currentRound: newRoundNumber 
        })
        .where(eq(topics.id, topicId))

      return NextResponse.json({ success: true, data: newRound })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Round action error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to perform round action' },
      { status: 500 }
    )
  }
}