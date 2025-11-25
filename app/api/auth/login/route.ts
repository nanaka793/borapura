import { NextResponse } from 'next/server'
import { getUserByEmail } from '@/lib/data'
import { verifyPassword, createSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードを入力してください。' },
        { status: 400 }
      )
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const user = await getUserByEmail(normalizedEmail)
    if (!user) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません。' },
        { status: 401 }
      )
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません。' },
        { status: 401 }
      )
    }

    createSession(user.id)

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (error) {
    console.error('Error logging in', error)
    return NextResponse.json(
      { error: 'ログイン処理に失敗しました。' },
      { status: 500 }
    )
  }
}

