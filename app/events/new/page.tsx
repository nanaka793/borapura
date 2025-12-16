import EventForm from '@/components/EventForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

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

export default function NewEventPage() {
  const themeColor = '#799A0E' // ボランティア募集のテーマカラー（一覧ページと共通）

  const softenColor = (hex: string, whiteRatio: number = 0.75) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return hex
    const r = Math.round(rgb.r * (1 - whiteRatio) + 255 * whiteRatio)
    const g = Math.round(rgb.g * (1 - whiteRatio) + 255 * whiteRatio)
    const b = Math.round(rgb.b * (1 - whiteRatio) + 255 * whiteRatio)
    return `rgb(${r}, ${g}, ${b})`
  }
  const lightThemeColor = softenColor(themeColor, 0.75)

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(to bottom, ${lightThemeColor}, white)` }}>
      <div className="container mx-auto px-4 pt-24 pb-10">
        <div className="mx-auto max-w-5xl space-y-10">
          {/* タイトルブロック（一覧ページと同じトーン） */}
          <div className="rounded-3xl bg-white/85 p-8 drop-shadow-lg ring-1 ring-gray-100 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: themeColor }}>
              Volunteer Opportunity
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">ボランティア募集を掲載する</h1>
            <p className="mt-4 text-base md:text-lg text-gray-600">
              開催予定のイベントや人手が必要な活動を募集しましょう。応募者が連絡しやすいよう、詳細を丁寧にご記入ください。
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/events"
                className="rounded-full px-5 py-2 text-sm font-semibold text-white shadow-md hover:opacity-90"
                style={{ backgroundColor: themeColor }}
              >
                一覧へ戻る
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 md:p-10 shadow-xl">
            <EventForm />
          </div>
        </div>
      </div>
    </div>
  )
}

