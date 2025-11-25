import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getPost, savePost } from '@/lib/data'
import type { Comment } from '@/lib/types'

interface Params {
  id: string
  commentId: string
}

export async function POST(_: Request, { params }: { params: Promise<Params> }) {
  try {
    const { id, commentId } = await params
    const post = await getPost(id)
    if (!post) {
      return NextResponse.json({ error: '投稿が見つかりません' }, { status: 404 })
    }

    post.comments = post.comments || []
    const result = incrementCommentLike(post.comments, commentId)

    if (!result.found) {
      return NextResponse.json({ error: 'コメントが見つかりません' }, { status: 404 })
    }

    post.updatedAt = new Date().toISOString()
    await savePost(post)
    revalidatePath(`/posts/${id}`)
    revalidatePath('/')

    return NextResponse.json({ likes: result.likes })
  } catch (error) {
    console.error('Error liking comment:', error)
    return NextResponse.json(
      { error: 'コメントのいいねに失敗しました' },
      { status: 500 }
    )
  }
}

function incrementCommentLike(
  comments: Comment[],
  commentId: string
): { found: boolean; likes: number } {
  for (const comment of comments) {
    if (comment.id === commentId) {
      comment.likes = (comment.likes || 0) + 1
      return { found: true, likes: comment.likes }
    }
    if (comment.replies && comment.replies.length > 0) {
      const result = incrementCommentLike(comment.replies, commentId)
      if (result.found) {
        return result
      }
    }
  }
  return { found: false, likes: 0 }
}

