import { NextRequest, NextResponse } from 'next/server'
import { getTopics } from '@/lib/data'

// このAPIルートを動的レンダリングとして明示的に指定
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const fetchCache = 'force-no-store'

export async function GET(request: NextRequest) {
  try {
    const activeOnly = request.nextUrl.searchParams.get('activeOnly') === 'true'
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



