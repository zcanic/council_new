import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { topics, rounds, comments, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getTopicWithDetails, mockTopics } from '@/data/mockData'

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
    
    // 数据库连接失败时返回模拟数据
    console.log('Using mock data as fallback')
    const topicId = params.id
    const mockTopic = getTopicWithDetails(topicId)
    
    if (mockTopic) {
      return NextResponse.json({ 
        success: true, 
        data: mockTopic,
        _fallback: true // 标记为降级数据
      })
    }
    
    // 如果模拟数据中也没有找到，返回第一个话题
    const fallbackTopic = getTopicWithDetails(mockTopics[0].id)
    return NextResponse.json({ 
      success: true, 
      data: fallbackTopic,
      _fallback: true // 标记为降级数据
    })
  }
}