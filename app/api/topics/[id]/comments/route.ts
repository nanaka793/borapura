import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getTopic, getTopicComments, createTopicComment } from '@/lib/data'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const comments = await getTopicComments(id)
    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching topic comments:', error)
    return NextResponse.json(
      { error: 'コメントの取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(
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

    if (!topic.isActive) {
      return NextResponse.json(
        { error: 'このトピックは現在コメントを受け付けていません' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { content, author } = body

    // 認証済みユーザーを取得（オプション）
    const currentUser = await getCurrentUser()
    
    // バリデーション: ログインしていない場合はauthorが必須
    if (!content) {
      return NextResponse.json(
        { error: 'コメントは必須です' },
        { status: 400 }
      )
    }
    
    if (!currentUser && !author) {
      return NextResponse.json(
        { error: 'ログインしていない場合はお名前の入力が必要です' },
        { status: 400 }
      )
    }

    const authorId = currentUser?.id
    const commentAuthor = currentUser?.name || author

    const newComment = await createTopicComment({
      topicId: id,
      author: commentAuthor,
      authorId,
      content,
      likes: 0,
    })

    revalidatePath(`/topics/${id}`)
    revalidatePath('/topics')

    return NextResponse.json(newComment, { status: 201 })
  } catch (error: any) {
    console.error('Error creating topic comment:', error)
    const errorMessage = error?.message || 'コメントの作成に失敗しました'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

