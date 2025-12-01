import { getPosts, getUser } from '@/lib/data'
import { notFound } from 'next/navigation'
import PostCard from '@/components/PostCard'
import Avatar from '@/components/Avatar'
import { getCurrentUser } from '@/lib/auth'
import FriendButton from '@/components/FriendButton'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function UserProfilePage({ params }: PageProps) {
  const { id } = await params
  const user = await getUser(id)
  if (!user) {
    notFound()
  }

  const currentUser = await getCurrentUser()

  const posts = await getPosts()
  const userPosts = posts
    .filter((p) => p.authorId === id || p.author === user.name)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <Avatar src={user.avatar} name={user.name} size="lg" />
            <div className="flex-1">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-4xl font-bold text-primary-600">
                  {user.name}
                </h1>
                {currentUser && (
                  <FriendButton
                    currentUserId={currentUser.id}
                    targetUserId={user.id}
                    initialIsFriend={currentUser.friends?.includes(user.id) ?? false}
                  />
                )}
              </div>
              {user.badge && (
                <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-600 mb-3">
                  {user.badge}
                </span>
              )}
              {user.headline && (
                <p className="text-gray-600 text-lg mb-2">{user.headline}</p>
              )}
              {user.location && <p className="text-gray-500 mb-4">📍 {user.location}</p>}
              {user.bio && <p className="text-gray-600 whitespace-pre-wrap mb-4">{user.bio}</p>}
              
              {user.interests && user.interests.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">関心テーマ</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {user.website && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Webサイト / SNS</h3>
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 hover:underline break-all"
                  >
                    {user.website}
                  </a>
                </div>
              )}
              <p className="text-gray-600 text-lg mt-4">投稿数: {userPosts.length}件</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          冒険日誌
          {userPosts.length > 0 && (
            <span className="ml-3 text-xl font-normal text-gray-600">
              {userPosts.length}ページ
            </span>
          )}
        </h2>
        {userPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
            まだ投稿がありません。
          </div>
        ) : (
          <div className="space-y-6">
            {userPosts.map((post, index) => (
              <PostCard key={post.id} post={post} chapterNumber={userPosts.length - index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

