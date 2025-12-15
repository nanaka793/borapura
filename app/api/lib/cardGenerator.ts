// @ts-nocheck
// TypeScriptの型チェックをスキップ（Vercelビルド時の@napi-rs/canvasエラー回避のため）
import 'server-only'
import { Post } from '@/lib/types'

// @napi-rs/canvas の動的インポート（Vercelビルド対応）
let createCanvas: (width: number, height: number) => any
try {
  const canvasModule = require('@napi-rs/canvas')
  createCanvas = canvasModule.createCanvas
} catch (error) {
  // ビルド時にモジュールが見つからない場合は、実行時にエラーをスローする関数を設定
  createCanvas = () => {
    throw new Error('@napi-rs/canvas is not available in this environment')
  }
}

// カードのサイズ（参考画像に基づく）
const CARD_WIDTH = 800
const CARD_HEIGHT = 1120

// カラー定義
const COLORS = {
  gold: '#D4AF37',
  goldDark: '#B8941F',
  brown: '#8B6F47',
  brownLight: '#D4C4A8',
  brownDark: '#3A1E13',
  blue: '#4A90E2',
  blueLight: '#87CEEB',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#F5F5DC',
}

// カテゴリーに応じた属性マッピング
const CATEGORY_TO_ELEMENT: Record<string, string> = {
  '教育': '知識',
  '子ども': '希望',
  '国際協力': '世界',
  '環境保護': '自然',
  '福祉': '優しさ',
  '災害支援': '勇気',
  '地域活動': '絆',
  '医療・健康': '生命',
  'スポーツ': '活力',
  '文化': '伝統',
  'イベント': '祭り',
  'その他': '冒険',
}

// カテゴリーに応じた属性アイコンの色
const ELEMENT_COLORS: Record<string, string> = {
  '知識': '#4A90E2',
  '希望': '#FFD700',
  '世界': '#00CED1',
  '自然': '#32CD32',
  '優しさ': '#FF69B4',
  '勇気': '#FF4500',
  '絆': '#9370DB',
  '生命': '#FF1493',
  '活力': '#FF6347',
  '伝統': '#8B4513',
  '祭り': '#FF8C00',
  '冒険': '#1E90FF',
}

/**
 * テキストを複数行に分割する（日本語対応）
 */
function wrapText(
  ctx: any,
  text: string,
  maxWidth: number,
  maxLines: number = 3
): string[] {
  const lines: string[] = []
  let currentLine = ''

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const testLine = currentLine + char
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width

    if (testWidth > maxWidth && currentLine !== '') {
      lines.push(currentLine)
      currentLine = char
      if (lines.length >= maxLines) {
        // 最後の行に省略記号を追加
        if (currentLine.length > 0) {
          currentLine = currentLine.substring(0, Math.max(0, currentLine.length - 1)) + '...'
        }
        break
      }
    } else {
      currentLine = testLine
    }
  }
  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine)
  }
  return lines
}

/**
 * カード画像を生成する
 */
export async function generateCardImage(post: Post): Promise<Buffer> {
  const canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT)
  const ctx = canvas.getContext('2d')

  // 背景（金色の枠と茶色の背景）
  ctx.fillStyle = COLORS.brownLight
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  // 金色の枠
  ctx.strokeStyle = COLORS.gold
  ctx.lineWidth = 20
  ctx.strokeRect(10, 10, CARD_WIDTH - 20, CARD_HEIGHT - 20)

  // 内側の枠
  ctx.strokeStyle = COLORS.goldDark
  ctx.lineWidth = 8
  ctx.strokeRect(30, 30, CARD_WIDTH - 60, CARD_HEIGHT - 60)

  // 上部バナー
  const bannerY = 50
  const bannerHeight = 120
  ctx.fillStyle = COLORS.brownLight
  ctx.fillRect(50, bannerY, CARD_WIDTH - 100, bannerHeight)
  ctx.strokeStyle = COLORS.gold
  ctx.lineWidth = 4
  ctx.strokeRect(50, bannerY, CARD_WIDTH - 100, bannerHeight)

  // タイトル
  ctx.fillStyle = COLORS.black
  ctx.font = 'bold 36px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  const titleLines = wrapText(ctx, post.title, CARD_WIDTH - 200, 2)
  titleLines.forEach((line, index) => {
    ctx.fillText(line, CARD_WIDTH / 2, bannerY + 20 + index * 45)
  })

  // サブタイトル（キャラクター）
  ctx.font = '24px sans-serif'
  ctx.fillText('冒険日誌', CARD_WIDTH / 2, bannerY + 80)

  // 属性アイコン（左上）
  const element = CATEGORY_TO_ELEMENT[post.category || 'その他'] || '冒険'
  const elementColor = ELEMENT_COLORS[element] || COLORS.blue
  const iconSize = 40
  const iconX = 70
  const iconY = bannerY + 10

  ctx.fillStyle = elementColor
  ctx.beginPath()
  ctx.arc(iconX + iconSize / 2, iconY + iconSize / 2, iconSize / 2, 0, Math.PI * 2)
  ctx.fill()

  // コストとスピード（左右）
  const statSize = 80
  const statY = 200

  // コスト（左）
  ctx.fillStyle = COLORS.blueLight
  ctx.beginPath()
  const costX = 100
  const costY = statY
  ctx.moveTo(costX, costY)
  ctx.lineTo(costX + statSize, costY)
  ctx.lineTo(costX + statSize / 2, costY + statSize)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = COLORS.gold
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.fillStyle = COLORS.white
  ctx.font = 'bold 20px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Cost', costX + statSize / 2, costY + 25)
  ctx.font = 'bold 32px sans-serif'
  const costValue = post.questStyle !== undefined ? post.questStyle : 3
  ctx.fillText(costValue.toString(), costX + statSize / 2, costY + 60)

  // スピード（右）
  ctx.fillStyle = COLORS.blueLight
  ctx.beginPath()
  const speedX = CARD_WIDTH - 100 - statSize
  const speedY = statY
  ctx.moveTo(speedX, speedY)
  ctx.lineTo(speedX + statSize, speedY)
  ctx.lineTo(speedX + statSize / 2, speedY + statSize)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = COLORS.gold
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.fillStyle = COLORS.white
  ctx.font = 'bold 20px sans-serif'
  ctx.fillText('Speed', speedX + statSize / 2, speedY + 25)
  ctx.font = 'bold 32px sans-serif'
  const speedValue = post.emotionMeter !== undefined ? post.emotionMeter : 3
  ctx.fillText(speedValue.toString(), speedX + statSize / 2, speedY + 60)

  // メインコンテンツエリア
  const contentY = statY + statSize + 40
  const contentHeight = 400
  const contentPadding = 30

  // コンテンツ背景
  ctx.fillStyle = COLORS.brownLight
  ctx.fillRect(50, contentY, CARD_WIDTH - 100, contentHeight)
  ctx.strokeStyle = COLORS.gold
  ctx.lineWidth = 4
  ctx.strokeRect(50, contentY, CARD_WIDTH - 100, contentHeight)

  // カテゴリー/種族
  ctx.fillStyle = COLORS.black
  ctx.font = 'bold 28px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(post.category || '冒険', 70, contentY + 20)

  // コンテンツテキスト
  ctx.font = '20px sans-serif'
  ctx.fillStyle = COLORS.black
  const contentText = post.content.substring(0, 200) // 最初の200文字
  const contentLines = wrapText(ctx, contentText, CARD_WIDTH - 200, 8)
  contentLines.forEach((line, index) => {
    ctx.fillText(line, 70, contentY + 70 + index * 35)
  })

  // 成長発見とラスボス（フレーバーテキストエリア）
  const flavorY = contentY + contentHeight + 20
  const flavorHeight = 120

  ctx.fillStyle = COLORS.brown
  ctx.fillRect(50, flavorY, CARD_WIDTH - 100, flavorHeight)
  ctx.strokeStyle = COLORS.gold
  ctx.lineWidth = 3
  ctx.strokeRect(50, flavorY, CARD_WIDTH - 100, flavorHeight)

  ctx.fillStyle = COLORS.white
  ctx.font = '16px sans-serif'
  ctx.textAlign = 'left'
  let flavorText = ''
  if (post.growthDiscovery) {
    flavorText = `「${post.growthDiscovery.substring(0, 50)}」`
  } else if (post.finalBoss) {
    flavorText = `「${post.finalBoss.substring(0, 50)}」`
  } else {
    flavorText = `「${post.author}の冒険」`
  }
  const flavorLines = wrapText(ctx, flavorText, CARD_WIDTH - 200, 3)
  flavorLines.forEach((line, index) => {
    ctx.fillText(line, 70, flavorY + 20 + index * 30)
  })

  // ステータスエリア（下部）
  const statsY = flavorY + flavorHeight + 30
  const statsHeight = 100

  ctx.fillStyle = COLORS.brownLight
  ctx.fillRect(50, statsY, CARD_WIDTH - 100, statsHeight)
  ctx.strokeStyle = COLORS.gold
  ctx.lineWidth = 4
  ctx.strokeRect(50, statsY, CARD_WIDTH - 100, statsHeight)

  // ステータス値
  ctx.fillStyle = COLORS.black
  ctx.font = 'bold 24px sans-serif'
  ctx.textAlign = 'center'

  // ATK, DEF, DOWN
  const atkValue = Math.min(999, (post.questStyle || 3) * 100)
  const defValue = Math.min(999, (post.emotionMeter || 3) * 100)
  const downValue = Math.min(999, Math.floor((post.content.length || 0) / 10))

  ctx.fillText(`ATK ${atkValue}`, CARD_WIDTH / 2 - 150, statsY + 30)
  ctx.fillText(`DEF ${defValue}`, CARD_WIDTH / 2, statsY + 30)
  ctx.fillText(`DOWN ${downValue}`, CARD_WIDTH / 2 + 150, statsY + 30)

  // 属性アイコン（中央下部）
  const elementIconSize = 60
  const elementIconX = CARD_WIDTH / 2 - elementIconSize / 2
  const elementIconY = statsY + 50

  ctx.fillStyle = elementColor
  ctx.beginPath()
  ctx.arc(
    CARD_WIDTH / 2,
    elementIconY + elementIconSize / 2,
    elementIconSize / 2,
    0,
    Math.PI * 2
  )
  ctx.fill()
  ctx.strokeStyle = COLORS.gold
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.fillStyle = COLORS.white
  ctx.font = 'bold 24px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(element, CARD_WIDTH / 2, elementIconY + elementIconSize / 2 + 8)

  // カードID（左下）
  ctx.fillStyle = COLORS.black
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'left'
  const cardId = post.id ? `${post.id.substring(0, 8)}-CARD` : 'NEW-CARD'
  ctx.fillText(cardId, 60, CARD_HEIGHT - 30)

  // レアリティ（右下）
  ctx.textAlign = 'right'
  ctx.fillText('N', CARD_WIDTH - 60, CARD_HEIGHT - 30)

  // 角の装飾
  const cornerSize = 30
  ctx.strokeStyle = COLORS.gold
  ctx.lineWidth = 4
  // 左上
  ctx.beginPath()
  ctx.moveTo(50, 50)
  ctx.lineTo(50 + cornerSize, 50)
  ctx.moveTo(50, 50)
  ctx.lineTo(50, 50 + cornerSize)
  ctx.stroke()
  // 右上
  ctx.beginPath()
  ctx.moveTo(CARD_WIDTH - 50, 50)
  ctx.lineTo(CARD_WIDTH - 50 - cornerSize, 50)
  ctx.moveTo(CARD_WIDTH - 50, 50)
  ctx.lineTo(CARD_WIDTH - 50, 50 + cornerSize)
  ctx.stroke()
  // 左下
  ctx.beginPath()
  ctx.moveTo(50, CARD_HEIGHT - 50)
  ctx.lineTo(50 + cornerSize, CARD_HEIGHT - 50)
  ctx.moveTo(50, CARD_HEIGHT - 50)
  ctx.lineTo(50, CARD_HEIGHT - 50 - cornerSize)
  ctx.stroke()
  // 右下
  ctx.beginPath()
  ctx.moveTo(CARD_WIDTH - 50, CARD_HEIGHT - 50)
  ctx.lineTo(CARD_WIDTH - 50 - cornerSize, CARD_HEIGHT - 50)
  ctx.moveTo(CARD_WIDTH - 50, CARD_HEIGHT - 50)
  ctx.lineTo(CARD_WIDTH - 50, CARD_HEIGHT - 50 - cornerSize)
  ctx.stroke()

  // JPEG形式でバッファを返す
  return canvas.encode('jpeg', 90)
}

