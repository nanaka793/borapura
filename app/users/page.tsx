import { getUsers, getPosts } from '@/lib/data'
import Link from 'next/link'
import UserDirectory from '@/components/UserDirectory'

export default async function UsersPage() {
  const [users, posts] = await Promise.all([getUsers(), getPosts()])

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
    postCount: postCountMap[user.id] || 0,
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">ユーザー一覧</h1>
        {userList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">
              まだユーザーがいません。初めての登録をしてみましょう。
            </p>
            <Link href="/register" className="mt-4 inline-block font-semibold text-primary-600">
              新規登録 →
            </Link>
          </div>
        ) : (
          <UserDirectory users={userList} />
        )}
      </div>
    </div>
  )
}

