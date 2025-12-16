import Link from 'next/link'
import PostForm from '@/components/PostForm'
import { getCurrentUser } from '@/lib/auth'

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

export default async function NewPostPage() {
  const currentUser = await getCurrentUser()
  const themeColor = '#57AABC' // 冒険日誌のテーマカラー（一覧ページと共通）

  const softenColor = (hex: string, whiteRatio: number = 0.75) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return hex
    const r = Math.round(rgb.r * (1 - whiteRatio) + 255 * whiteRatio)
    const g = Math.round(rgb.g * (1 - whiteRatio) + 255 * whiteRatio)
    const b = Math.round(rgb.b * (1 - whiteRatio) + 255 * whiteRatio)
    return `rgb(${r}, ${g}, ${b})`
  }
  const lightThemeColor = softenColor(themeColor, 0.75)

  if (!currentUser) {
    return (
      <div className="min-h-screen" style={{ background: `linear-gradient(to bottom, ${lightThemeColor}, white)` }}>
        <div className="container mx-auto px-4 pt-24 pb-10">
          <div className="mx-auto max-w-2xl rounded-3xl bg-white/90 p-10 text-center shadow-lg">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">ログインしてください</h1>
            <p className="mb-6 text-gray-600">冒険日誌を投稿するには、マイページ用のアカウントが必要です。</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/login?next=/posts/new"
                className="rounded-full px-6 py-3 font-semibold text-white"
                style={{ backgroundColor: themeColor }}
              >
                ログイン
              </Link>
              <Link
                href="/register?next=/posts/new"
                className="rounded-full border px-6 py-3 font-semibold"
                style={{ borderColor: themeColor, color: themeColor }}
              >
                新規登録
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(to bottom, ${lightThemeColor}, white)` }}>
      <div className="container mx-auto px-4 pt-24 pb-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 rounded-3xl bg-white/85 p-8 drop-shadow-lg ring-1 ring-gray-100 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: themeColor }}>
              Activity Stories
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">冒険日誌を投稿</h1>
            <p className="mt-4 text-base md:text-lg text-gray-600">
              最近のボランティア活動や小さな気づきを、冒険日誌として残しましょう。
            </p>
          </div>

          <div className="rounded-3xl bg-white/85 p-8 drop-shadow-lg ring-1 ring-gray-100 backdrop-blur">
            <div className="bg-transparent">
              <PostForm currentUser={{ id: currentUser.id, name: currentUser.name }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

