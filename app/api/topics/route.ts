import { NextResponse } from 'next/server'
import { getTopics } from '@/lib/data'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('activeOnly') === 'true'
    
    const topics = await getTopics(activeOnly)
    return NextResponse.json(topics)
  } catch (error) {
    console.error('Error fetching topics:', error)
    return NextResponse.json(
      { error: 'トピックの取得に失敗しました' },
      { status: 500 }
    )
  }
}



