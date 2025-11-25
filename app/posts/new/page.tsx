import Link from 'next/link'
import PostForm from '@/components/PostForm'
import { getCurrentUser } from '@/lib/auth'

export default async function NewPostPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">ログインしてください</h1>
          <p className="text-gray-600 mb-6">
            活動記録を投稿するには、マイページ用のアカウントが必要です。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login?next=/posts/new"
              className="rounded-full bg-primary-600 px-6 py-3 font-semibold text-white"
            >
              ログイン
            </Link>
            <Link
              href="/register?next=/posts/new"
              className="rounded-full border border-primary-200 px-6 py-3 font-semibold text-primary-700"
            >
              新規登録
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">活動記録を投稿</h1>
        <PostForm currentUser={{ id: currentUser.id, name: currentUser.name }} />
      </div>
    </div>
  )
}

