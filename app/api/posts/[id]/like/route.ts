import { NextRequest, NextResponse } from 'next/server'
import { getPost, savePost, updateUserBadges } from '@/lib/data'

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

    let reaction = '💛'
    try {
      const body = await request.json()
      if (body && typeof body.reaction === 'string') {
        reaction = body.reaction
      }
    } catch {
      // ボディなしでも動くようにする
    }

    const reactions = { ...(post.reactions || {}) }
    reactions[reaction] = (reactions[reaction] || 0) + 1

    post.likes = (post.likes || 0) + 1
    post.reactions = reactions

    const { post: savedPost } = await savePost(post)

    // バッジを更新（非同期で実行、エラーが発生してもいいねは成功させる）
    if (post.authorId) {
      updateUserBadges(post.authorId).catch((error) => {
        console.error('Failed to update user badges:', error)
      })
    }

    return NextResponse.json({
      likes: savedPost.likes,
      reactions: savedPost.reactions || {},
    })
  } catch (error) {
    console.error('Error reacting to post:', error)
    return NextResponse.json(
      { error: 'スタンプの送信に失敗しました' },
      { status: 500 }
    )
  }
}

