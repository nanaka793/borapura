import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { updateUser } from '@/lib/data'
import { uploadAttachment } from '@/lib/airtable'

export async function GET() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return NextResponse.json({ error: '未ログインです。' }, { status: 401 })
  }

  const { passwordHash, ...safeUser } = currentUser
  return NextResponse.json({ user: safeUser })
}

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return NextResponse.json({ error: '未ログインです。' }, { status: 401 })
  }

  const contentType = request.headers.get('content-type') || ''
  let payload: Record<string, any> = {}
  let avatarFile: File | null = null

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData()
    payload = {}
    formData.forEach((value, key) => {
      payload[key] = value
    })
    const maybeFile = formData.get('avatar')
    avatarFile = maybeFile instanceof File ? maybeFile : null
  } else {
    payload = await request.json()
  }

  let parsedInterests: string[] = currentUser.interests || []
  if (payload.interests) {
    if (Array.isArray(payload.interests)) {
      parsedInterests = payload.interests
    } else if (typeof payload.interests === 'string') {
      try {
        // JSON文字列として送られてくる場合
        const parsed = JSON.parse(payload.interests)
        parsedInterests = Array.isArray(parsed) ? parsed : []
      } catch {
        // カンマ区切りの文字列として送られてくる場合（後方互換性）
        parsedInterests = payload.interests
          .split(',')
          .map((item: string) => item.trim())
          .filter(Boolean)
      }
    }
  }

  let avatarUrl = currentUser.avatar
  if (avatarFile && avatarFile.size > 0) {
    const attachment = await uploadAttachment(avatarFile, {
      recordId: currentUser.id,
      fieldKey: 'UsersAvatar',
    })
    avatarUrl = attachment?.url
  } else if (typeof payload.avatar === 'string') {
    avatarUrl = payload.avatar
  }

  const updates = {
    name: payload.name ?? currentUser.name,
    headline: payload.headline ?? currentUser.headline,
    bio: payload.bio ?? currentUser.bio,
    location: payload.location ?? currentUser.location,
    website: payload.website ?? currentUser.website,
    interests: parsedInterests ?? currentUser.interests,
    avatar: avatarUrl ?? currentUser.avatar,
  }

  const updated = await updateUser(currentUser.id, updates)
  if (!updated) {
    return NextResponse.json(
      { error: 'プロフィールの更新に失敗しました。' },
      { status: 500 }
    )
  }

  const { passwordHash, ...safeUser } = updated
  return NextResponse.json({ user: safeUser })
}

