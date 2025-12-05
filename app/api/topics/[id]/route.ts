import { NextRequest, NextResponse } from 'next/server'
import { getTopic } from '@/lib/data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const topic = await getTopic(id)
    
    if (!topic) {
      return NextResponse.json(
        { error: 'トピックが見つかりません' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(topic)
  } catch (error) {
    console.error('Error fetching topic:', error)
    return NextResponse.json(
      { error: 'トピックの取得に失敗しました' },
      { status: 500 }
    )
  }
}


