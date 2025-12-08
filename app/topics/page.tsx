import { getTopics } from '@/lib/data'
import TopicCard from '@/components/TopicCard'

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

export default async function TopicsPage() {
  const topics = await getTopics(true) // アクティブなトピックのみ取得
  const themeColor = '#87354F' // 冒険者の酒場のテーマカラー
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
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto">
        <div className="bg-white/85 rounded-lg drop-shadow-lg p-8 mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: themeColor }}>
          Adventurer Bar Room
          </p>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">冒険者の酒場</h1>
          <p className="text-gray-600 text-lg">
            ボランティア参加の有無に関わらず、みんなでテーマについて語り合いましょう！
          </p>
          <p className="text-base mt-2" style={{ color: themeColor }}>
            ログインしていない人も、冒険者ネームを入力して投稿ができます。
          </p>
        </div>

        {topics.length === 0 ? (
          <div className="text-center py-12 bg-white/85 rounded-lg drop-shadow-lg">
            <p className="text-gray-500 text-lg">
              現在、アクティブなトピックはありません。
            </p>
            <p className="text-gray-400 text-sm mt-2">
              新しいトピックが追加されるまでお待ちください。
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} themeColor={themeColor} />
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

