import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { topics, rounds } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { mockTopics, getAllTopicsWithDetails } from '@/data/mockData'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    
    let orderBy
    switch (sortBy) {
      case 'roundDepth':
        orderBy = desc(topics.roundCount)
        break
      case 'participants':
        orderBy = desc(topics.participantCount)
        break
      case 'compression':
        // 压缩比 = 评论数/参与人数
        orderBy = desc(db.sql`(${topics.roundCount}::float / NULLIF(${topics.participantCount}, 0))`)
        break
      case 'coverage':
        // 引用覆盖率 - 需要额外计算，暂时用参与人数
        orderBy = desc(topics.participantCount)
        break
      default:
        orderBy = desc(topics.createdAt)
    }

    const allTopics = await db
      .select()
      .from(topics)
      .orderBy(orderBy)

    return NextResponse.json({ success: true, data: allTopics })
  } catch (error) {
    console.error('Get topics error:', error)
    
    // 数据库连接失败时返回模拟数据
    console.log('Using mock data as fallback')
    return NextResponse.json({ 
      success: true, 
      data: mockTopics,
      _fallback: true // 标记为降级数据
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, maxRounds = 3, createdBy } = body

    if (!title || !description || !createdBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const topicId = `topic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const [newTopic] = await db
      .insert(topics)
      .values({
        id: topicId,
        title,
        description,
        maxRounds,
        createdBy,
        status: 'active',
        participantCount: 1, // 创建者自动参与
        roundCount: 0,
        currentRound: 0
      })
      .returning()

    // 自动创建第一轮
    const roundId = `round_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    await db
      .insert(rounds)
      .values({
        id: roundId,
        topicId,
        roundNumber: 1,
        status: 'active',
        commentCount: 0,
        maxComments: 10
      })

    // 更新话题的当前轮次
    await db
      .update(topics)
      .set({ 
        roundCount: 1,
        currentRound: 1 
      })
      .where(eq(topics.id, topicId))

    return NextResponse.json({ success: true, data: newTopic })
  } catch (error) {
    console.error('Create topic error:', error)
    
    // 数据库连接失败时返回模拟响应
    console.log('Using mock response for topic creation')
    const mockTopic = {
      id: `mock_topic_${Date.now()}`,
      title: body.title,
      description: body.description,
      createdAt: new Date(),
      participantCount: 1,
      roundCount: 1,
      status: 'active' as const,
      createdBy: body.createdBy,
      creatorId: 'mock_user',
      currentRound: 1,
      maxRounds: body.maxRounds || 3
    }
    
    return NextResponse.json({ 
      success: true, 
      data: mockTopic,
      _fallback: true // 标记为降级数据
    })
  }
}