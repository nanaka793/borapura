import Link from 'next/link'
import { getPosts, getUsers } from '@/lib/data'
import ActivityPostsSection from '@/components/ActivityPostsSection'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export default async function PostsPage() {
  const posts = await getPosts()
  const activityPosts = posts.filter((post) => post.type !== '募集投稿')
  const users = await getUsers()
  const userMap = users.reduce<Record<string, (typeof users)[number]>>((acc, user) => {
    acc[user.id] = user
    return acc
  }, {})
  const userNameMap = users.reduce<Record<string, (typeof users)[number]>>((acc, user) => {
    acc[user.name.toLowerCase()] = user
    return acc
  }, {})

  const activityPostsWithAvatar = activityPosts.map((post) => ({
    ...post,
    authorAvatar:
      userMap[post.authorId]?.avatar ?? userNameMap[post.author.toLowerCase()]?.avatar ?? '',
  }))

  const themeColor = '#57AABC' // 冒険日誌のテーマカラー
  // テーマカラーを落ち着いたトーンに調整（元の色と白を混ぜる）
  const softenColor = (hex: string, whiteRatio: number = 0.75) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return hex
    // 元の色と白を混ぜる（whiteRatioが高いほど白に近づく）
    const r = Math.round(rgb.r * (1 - whiteRatio) + 255 * whiteRatio)
    const g = Math.round(rgb.g * (1 - whiteRatio) + 255 * whiteRatio)
    const b = Math.round(rgb.b * (1 - whiteRatio) + 255 * whiteRatio)
    return `rgb(${r}, ${g}, ${b})`
  }
  const lightThemeColor = softenColor(themeColor, 0.75)

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(to bottom, ${lightThemeColor}, white)` }}>
      <div className="container mx-auto px-4 pt-24 pb-10">
        <div className="mx-auto max-w-5xl">
        <div className="mb-10 rounded-3xl bg-white/85 p-8 drop-shadow-lg ring-1 ring-gray-100 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: themeColor }}>
            Activity Stories
          </p>
          <h1 className="text-4xl font-bold text-gray-900">冒険日誌ページ</h1>
          <p className="mt-4 text-lg text-gray-600">
            一人ひとりの想いと行動が、次のボランティアを生み出します。冒険日誌を通して新しい発見や仲間に出会いましょう。
          </p>
          <Link
            href="/posts/new"
            className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-lg hover:opacity-90"
            style={{ backgroundColor: themeColor }}
          >
            新しい活動を投稿する
          </Link>
        </div>

        {activityPosts.length === 0 ? (
          <div className="rounded-3xl bg-white/85 p-10 text-center drop-shadow-lg">
            <p className="text-gray-500">
              まだ冒険日誌がありません。最初の記録を投稿してみましょう！
            </p>
          </div>
        ) : (
          <ActivityPostsSection posts={activityPostsWithAvatar} themeColor={themeColor} />
        )}
        </div>
      </div>
    </div>
  )
}

