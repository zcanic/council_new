import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // 测试数据库连接
    const result = await db.execute('SELECT 1 as test')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      database: 'PostgreSQL (Vercel)'
    })
  } catch (error) {
    console.error('Database connection error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        suggestion: 'Check Vercel Postgres environment variables'
      },
      { status: 500 }
    )
  }
}