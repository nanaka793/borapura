import { NextRequest, NextResponse } from 'next/server'
import { getPost, savePost } from '@/lib/data'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const post = await getPost(id)
    if (!post) {
      return NextResponse.json({ error: '投稿が見つかりません' }, { status: 404 })
    }

    post.likes += 1
    await savePost(post)

    return NextResponse.json({ likes: post.likes })
  } catch (error) {
    console.error('Error liking post:', error)
    return NextResponse.json(
      { error: 'いいねに失敗しました' },
      { status: 500 }
    )
  }
}

