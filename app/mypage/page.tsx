import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getPosts } from '@/lib/data'
import ProfileForm from '@/components/ProfileForm'
import PostCard from '@/components/PostCard'
import Avatar from '@/components/Avatar'

export default async function MyPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect('/login?next=/mypage')
  }

  const posts = await getPosts()
  const userPosts = posts.filter(
    (post) => post.authorId === currentUser.id || post.author === currentUser.name
  )
  const { passwordHash: _passwordHash, ...safeUser } = currentUser

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="rounded-3xl bg-white/80 p-8 shadow-lg ring-1 ring-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">
                My Page
              </p>
              <h1 className="text-4xl font-bold text-gray-900">
                {currentUser.name} さんのマイページ
              </h1>
              {currentUser.headline && (
                <p className="mt-2 text-lg text-gray-600">{currentUser.headline}</p>
              )}
            </div>
            <Avatar src={currentUser.avatar} name={currentUser.name} size="lg" />
            <div className="rounded-2xl bg-primary-50 px-4 py-2 text-sm text-primary-700">
              登録日: {new Date(currentUser.createdAt).toLocaleDateString('ja-JP')}
            </div>
          </div>
          {currentUser.interests && currentUser.interests.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {currentUser.interests.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700"
                >
                  #{topic}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl bg-white p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">投稿した活動記録</h2>
            {userPosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
                まだ投稿がありません。<br />
                <a href="/posts/new" className="text-primary-600 underline">
                  活動記録を投稿
                </a>
                してみましょう。
              </div>
            ) : (
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">プロフィール設定</h2>
            <ProfileForm user={safeUser} />
          </div>
        </div>
      </div>
    </div>
  )
}

