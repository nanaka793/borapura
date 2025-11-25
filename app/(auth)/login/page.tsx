import Link from 'next/link'
import AuthForm from '@/components/AuthForm'

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-xl rounded-3xl bg-white/80 p-8 shadow-lg ring-1 ring-gray-100">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">
          Welcome back
        </p>
        <h1 className="text-3xl font-bold text-gray-900">ログイン</h1>
        <p className="mt-2 text-gray-600">
          マイページでプロフィールや投稿履歴を確認しましょう。
        </p>

        <div className="mt-8">
          <AuthForm mode="login" />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          初めての方は{' '}
          <Link href="/register" className="font-semibold text-primary-600">
            新規登録
          </Link>
          へ
        </p>
      </div>
    </div>
  )
}

