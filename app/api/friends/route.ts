import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getUser, updateUserFriends } from '@/lib/data'

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return NextResponse.json(
      { error: 'ログインが必要です。' },
      { status: 401 }
    )
  }

  const { targetUserId, action } = await request.json()

  if (!targetUserId || typeof targetUserId !== 'string') {
    return NextResponse.json(
      { error: '対象ユーザーIDが不正です。' },
      { status: 400 }
    )
  }

  if (targetUserId === currentUser.id) {
    return NextResponse.json(
      { error: '自分自身を旅の仲間リストに追加することはできません。' },
      { status: 400 }
    )
  }

  const latestUser = await getUser(currentUser.id)
  if (!latestUser) {
    return NextResponse.json(
      { error: 'ユーザー情報の取得に失敗しました。' },
      { status: 500 }
    )
  }

  const currentFriends = latestUser.friends || []
  let nextFriends: string[]

  if (action === 'remove') {
    nextFriends = currentFriends.filter((id) => id !== targetUserId)
  } else {
    // デフォルトは追加
    nextFriends = currentFriends.includes(targetUserId)
      ? currentFriends
      : [...currentFriends, targetUserId]
  }

  const updated = await updateUserFriends(currentUser.id, nextFriends)
  if (!updated) {
    return NextResponse.json(
      { error: '旅の仲間リストの更新に失敗しました。' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    friends: updated.friends || [],
  })
}


