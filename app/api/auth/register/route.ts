import { NextResponse } from 'next/server'
import { getUserByEmail, saveUser } from '@/lib/data'
import { hashPassword, createSession } from '@/lib/auth'
import { User } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '名前、メールアドレス、パスワードは必須です。' },
        { status: 400 }
      )
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const trimmedName = String(name).trim()

    if (!trimmedName) {
      return NextResponse.json(
        { error: '名前を入力してください。' },
        { status: 400 }
      )
    }
    const existingUser = await getUserByEmail(normalizedEmail)
    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています。' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)

    const newUser: User = {
      id: '',
      name: trimmedName,
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
      followers: [],
      following: [],
      headline: '',
      bio: '',
      avatar: '',
      location: '',
      interests: [],
      website: '',
    }

    const created = await saveUser(newUser)
    createSession(created.id)

    return NextResponse.json(
      {
        user: {
          id: created.id,
          name: created.name,
          email: created.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error registering user', error)
    return NextResponse.json(
      { error: '登録処理に失敗しました。' },
      { status: 500 }
    )
  }
}

