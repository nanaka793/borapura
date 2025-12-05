import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getPost, getUser, updateUser } from '@/lib/data'

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return NextResponse.json({ error: 'ログインが必要です。' }, { status: 401 })
  }

  const { postId, action } = await request.json()

  if (!postId || typeof postId !== 'string') {
    return NextResponse.json({ error: '投稿IDが不正です。' }, { status: 400 })
  }

  const post = await getPost(postId)
  if (!post || post.type !== '募集投稿') {
    return NextResponse.json({ error: '募集投稿のみブックマークできます。' }, { status: 400 })
  }

  const latestUser = await getUser(currentUser.id)
  if (!latestUser) {
    return NextResponse.json(
      { error: 'ユーザー情報の取得に失敗しました。' },
      { status: 500 }
    )
  }

  const currentNextSteps = latestUser.nextSteps || []
  let nextSteps: string[]

  if (action === 'remove') {
    nextSteps = currentNextSteps.filter((id) => id !== postId)
  } else {
    nextSteps = currentNextSteps.includes(postId)
      ? currentNextSteps
      : [...currentNextSteps, postId]
  }

  const updated = await updateUser(currentUser.id, {
    nextSteps,
  })

  if (!updated) {
    return NextResponse.json(
      { error: '冒険の道標の更新に失敗しました。' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    nextSteps: updated.nextSteps || [],
  })
}



