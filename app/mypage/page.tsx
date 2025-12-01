import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getPosts, getUsers } from '@/lib/data'
import ProfileForm from '@/components/ProfileForm'
import PostCard from '@/components/PostCard'
import Avatar from '@/components/Avatar'

export default async function MyPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect('/login?next=/mypage')
  }

  const [posts, users] = await Promise.all([getPosts(), getUsers()])
  const userPosts = posts
    .filter((post) => post.authorId === currentUser.id || post.author === currentUser.name)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const { passwordHash: _passwordHash, ...safeUser } = currentUser

  const friendIds = currentUser.friends || []
  const friends = users.filter((user) => friendIds.includes(user.id))
  const nextStepIds = currentUser.nextSteps || []
  const nextStepPosts = posts.filter((post) => nextStepIds.includes(post.id))

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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              投稿した冒険日誌
              {userPosts.length > 0 && (
                <span className="ml-3 text-lg font-normal text-gray-600">
                  {userPosts.length}ページ
                </span>
              )}
            </h2>
            {userPosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
                まだ投稿がありません。<br />
                <a href="/posts/new" className="text-primary-600 underline">
                  冒険日誌を投稿
                </a>
                してみましょう。
              </div>
            ) : (
              <div className="space-y-6">
                {userPosts.map((post, index) => (
                  <PostCard key={post.id} post={post} chapterNumber={userPosts.length - index} />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-8 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">冒険の道標（保存した活動）</h2>
              {nextStepPosts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                  まだ気になる募集投稿が保存されていません。<br />
                  ボランティア募集ページから
                  <span className="font-semibold text-amber-600">「投稿を保存」</span>
                  ボタンを押すと、ここに表示されます。
                </div>
              ) : (
                <div className="space-y-3">
                  {nextStepPosts.map((post) => (
                    <a
                      key={post.id}
                      href={`/events/${post.id}`}
                      className="flex flex-col rounded-2xl border border-gray-100 bg-amber-50 px-4 py-3 text-sm hover:border-amber-300 hover:bg-amber-100 transition"
                    >
                      <span className="font-semibold text-gray-900">{post.title}</span>
                      {post.subtitle && (
                        <span className="mt-1 text-xs text-gray-600 line-clamp-1">
                          【ミッション】{post.subtitle}
                        </span>
                      )}
                      {post.eventDate && (
                        <span className="mt-1 text-xs text-gray-500">
                          📅{' '}
                          {new Date(post.eventDate).toLocaleDateString('ja-JP', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div id="friends" className="rounded-3xl bg-white p-8 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">旅の仲間リスト</h2>
              {friends.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                  まだ旅の仲間が登録されていません。<br />
                  気になるユーザーのページから
                  <span className="font-semibold text-primary-600">「旅の仲間リストに加える」</span>
                  ボタンを押してみましょう。
                </div>
              ) : (
                <div className="space-y-3">
                  {friends.map((friend) => (
                    <a
                      key={friend.id}
                      href={`/users/${friend.id}`}
                      className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm hover:border-primary-200 hover:bg-primary-50 transition"
                    >
                      <Avatar src={friend.avatar} name={friend.name} size="sm" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{friend.name}</p>
                        {friend.headline && (
                          <p className="text-xs text-gray-500 line-clamp-1">{friend.headline}</p>
                        )}
                      </div>
                    </a>
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
    </div>
  )
}

