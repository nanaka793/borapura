import PostDetail from '@/components/PostDetail'
import { getPost } from '@/lib/data'
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'

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

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPost(id)

  if (!post || post.type !== '募集投稿') {
    notFound()
  }

  const currentUser = await getCurrentUser()
  const nextSteps = currentUser?.nextSteps ?? []
  const initialBookmarked = nextSteps.includes(post.id)

  const themeColor = '#799A0E' // ボランティア募集のテーマカラー
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
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-4xl">
        <Link
          href="/events"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
          ボランティア募集に戻る
        </Link>
        <PostDetail
          post={post}
          canBookmark={!!currentUser}
          initialBookmarked={initialBookmarked}
        />
        </div>
      </div>
    </div>
  )
}


