import Link from 'next/link'
import { getPosts, getUsers } from '@/lib/data'
import PostGalleryCard from '@/components/PostGalleryCard'

export default async function PostsPage() {
  const posts = await getPosts()
  const users = await getUsers()
  const userMap = users.reduce<Record<string, (typeof users)[number]>>((acc, user) => {
    acc[user.id] = user
    return acc
  }, {})
  const userNameMap = users.reduce<Record<string, (typeof users)[number]>>((acc, user) => {
    acc[user.name.toLowerCase()] = user
    return acc
  }, {})

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 rounded-3xl bg-white/80 p-8 shadow-lg ring-1 ring-gray-100 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">
            Activity Stories
          </p>
          <h1 className="text-4xl font-bold text-gray-900">活動記録ページ</h1>
          <p className="mt-4 text-lg text-gray-600">
            一人ひとりの想いと行動が、次のボランティアを生み出します。活動記録を通して新しい発見や仲間に出会いましょう。
          </p>
          <Link
            href="/posts/new"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-primary-700"
          >
            新しい活動を投稿する
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
            <p className="text-gray-500">
              まだ活動記録がありません。最初の記録を投稿してみましょう！
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <PostGalleryCard
                key={post.id}
                post={post}
                authorAvatar={
                  userMap[post.authorId]?.avatar ??
                  userNameMap[post.author.toLowerCase()]?.avatar
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

