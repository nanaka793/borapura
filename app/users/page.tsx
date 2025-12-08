import { getUsers, getPosts } from '@/lib/data'
import Link from 'next/link'
import UserDirectory from '@/components/UserDirectory'

export default async function UsersPage() {
  const [users, posts] = await Promise.all([getUsers(), getPosts()])
  const themeColor = '#626262' // 冒険者リストのテーマカラー

  const postCountMap = posts.reduce<Record<string, number>>((acc, post) => {
    acc[post.authorId] = (acc[post.authorId] || 0) + 1
    return acc
  }, {})

  const userList = users.map((user) => ({
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    headline: user.headline,
    location: user.location,
    interests: user.interests || [],
    website: user.website,
    badge: user.badge,
    badges: user.badges,
    postCount: postCountMap[user.id] || 0,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-base to-white">
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto">
        <div className="bg-white/85 rounded-lg drop-shadow-lg p-8 mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: themeColor }}>
            Adventurer List
          </p>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">冒険者一覧</h1>
          <p className="text-gray-600 text-lg mb-2">
            ぼらぷらで活躍するたくさんの冒険者と出会おう！
          </p>
          <p className="text-gray-600 text-lg mb-2">
            冒険日誌を読んで応援したり、コメントを残したり…
          </p>
          <p className="text-lg" style={{ color: themeColor }}>
            エールをもらうって嬉しい！気軽にアクションしてね。
          </p>
        </div>
        {userList.length === 0 ? (
          <div className="text-center py-12 bg-white/85 rounded-lg drop-shadow-lg">
            <p className="text-gray-500 text-lg">
              まだユーザーがいません。初めての登録をしてみましょう。
            </p>
            <Link href="/register" className="mt-4 inline-block font-semibold" style={{ color: themeColor }}>
              新規登録 →
            </Link>
          </div>
        ) : (
          <UserDirectory users={userList} themeColor={themeColor} />
        )}
        </div>
      </div>
    </div>
  )
}

