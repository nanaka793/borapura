import Link from 'next/link'
import AuthForm from '@/components/AuthForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-base to-white">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mx-auto max-w-xl rounded-3xl bg-white/80 p-8 shadow-lg ring-1 ring-gray-100">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">
          Join
        </p>
        <h1 className="text-3xl font-bold text-gray-900">新規登録</h1>
        <p className="mt-2 text-gray-600">
          マイページでプロフィールを設定し、自分の冒険日誌をまとめて管理できます。
        </p>

        <div className="mt-8">
          <AuthForm mode="register" />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          すでにアカウントをお持ちですか？{' '}
          <Link href="/login" className="font-semibold text-primary-600">
            ログインする
          </Link>
        </p>
        </div>
      </div>
    </div>
  )
}

