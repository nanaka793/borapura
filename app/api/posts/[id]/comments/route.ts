import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getPost, savePost, updateUserBadges } from '@/lib/data'
import { getCurrentUser } from '@/lib/auth'
import { Comment } from '@/lib/types'

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

    const body = await request.json()
    const { content, author, parentId } = body

    if (!content || !author) {
      return NextResponse.json(
        { error: 'コメントとお名前は必須です' },
        { status: 400 }
      )
    }

    // 認証済みユーザーを取得（オプション）
    const currentUser = await getCurrentUser()
    const authorId = currentUser?.id || `user-${Date.now()}`
    const commentAuthor = currentUser?.name || author

    const newComment: Comment = {
      id: Date.now().toString(),
      postId: id,
      author: commentAuthor,
      authorId: authorId,
      content,
      createdAt: new Date().toISOString(),
      parentId,
      replies: [],
      likes: 0,
    }

    post.comments = post.comments || []

    if (parentId) {
      const added = addReplyToComments(post.comments, parentId, newComment)
      if (!added) {
        return NextResponse.json(
          { error: '返信先のコメントが見つかりません' },
          { status: 404 }
        )
      }
    } else {
      post.comments.push(newComment)
    }

    post.updatedAt = new Date().toISOString()
    await savePost(post)

    // バッジを更新（非同期で実行、エラーが発生してもコメントは成功させる）
    if (currentUser?.id) {
      updateUserBadges(currentUser.id).catch((error) => {
        console.error('Failed to update user badges:', error)
      })
    }

    revalidatePath(`/posts/${id}`)
    revalidatePath('/')

    return NextResponse.json(newComment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'コメントの作成に失敗しました' },
      { status: 500 }
    )
  }
}

function addReplyToComments(comments: Comment[], parentId: string, reply: Comment): boolean {
  for (const comment of comments) {
    if (comment.id === parentId) {
      comment.replies = comment.replies || []
      comment.replies.push(reply)
      return true
    }
    if (comment.replies && comment.replies.length > 0) {
      const added = addReplyToComments(comment.replies, parentId, reply)
      if (added) {
        return true
      }
    }
  }
  return false
}

