import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getPosts, getUsers } from '@/lib/data'
import PostCard from '@/components/PostCard'
import Avatar from '@/components/Avatar'
import NextStepsList from '@/components/NextStepsList'
import FriendsList from '@/components/FriendsList'
import { getBadgeEmoji } from '@/lib/badges'

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
    <div className="min-h-screen bg-gradient-to-b from-base to-white">
      <div className="container mx-auto px-4 pt-24 pb-10">
        <div className="mx-auto max-w-6xl space-y-10">
        <div className="rounded-3xl bg-white/80 p-8 shadow-lg ring-1 ring-gray-100">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">
                My Camp
              </p>
              <h1 className="text-4xl font-bold text-gray-900">
                {currentUser.name} さんのキャンプ
              </h1>
              {currentUser.headline && (
                <p className="mt-2 text-lg text-gray-600">{currentUser.headline}</p>
              )}
              {currentUser.bio && (
                <p className="mt-3 text-base text-gray-600 whitespace-pre-wrap">{currentUser.bio}</p>
              )}
            </div>
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-white border-4 border-primary-100 p-1 shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden">
                  {currentUser.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentUser.avatar}
                      alt={`${currentUser.name}のアイコン`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-2xl">
                      {currentUser.name
                        .trim()
                        .split(/\s+/)
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {(currentUser.badges && currentUser.badges.length > 0) || currentUser.badge ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {currentUser.badges && currentUser.badges.length > 0 ? (
                currentUser.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-600"
                  >
                    {getBadgeEmoji(badge)} {badge}
                  </span>
                ))
              ) : (
                currentUser.badge && (
                  <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-600">
                    {getBadgeEmoji(currentUser.badge)} {currentUser.badge}
                  </span>
                )
              )}
            </div>
          ) : null}
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
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-2xl font-bold text-primary-600">
                Lv : {userPosts.length}
              </span>
              <span className="text-sm text-gray-500">
                (投稿数{userPosts.length}件)
              </span>
            </div>
            <p className="text-xs text-gray-400">
              登録日: {new Date(currentUser.createdAt).toLocaleDateString('ja-JP')}
            </p>
          </div>
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
                <NextStepsList posts={nextStepPosts} />
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
                <FriendsList friends={friends} />
              )}
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-md space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">プロフィール設定</h2>
              <p className="text-sm text-gray-600">
                アイコンや自己紹介、関心テーマなどを変更したい場合は、設定変更ページから編集できます。
              </p>
              <a
                href="/mypage/profile"
                className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700 transition"
              >
                設定変更ページへ進む
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

