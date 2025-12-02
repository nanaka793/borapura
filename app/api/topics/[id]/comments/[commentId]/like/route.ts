import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { likeTopicComment } from '@/lib/data'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { commentId } = await params
    const result = await likeTopicComment(commentId)
    
    revalidatePath(`/topics/${await params.then(p => p.id)}`)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error liking topic comment:', error)
    return NextResponse.json(
      { error: 'いいねに失敗しました' },
      { status: 500 }
    )
  }
}

