import { getRecruitmentPosts } from '@/lib/data'
import EventGridSection from '@/components/EventGridSection'
import EventHeader from '@/components/EventHeader'
import EventPageClient from '@/components/EventPageClient'

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

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const events = await getRecruitmentPosts()
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
      <div className="container mx-auto px-4 pt-24 pb-10">
        <div className="mx-auto max-w-5xl">
          <EventPageClient events={events} themeColor={themeColor} />
        </div>
      </div>
    </div>
  )
}

