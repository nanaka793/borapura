// バッジの絵文字を取得するヘルパー関数
const GENRE_BADGE_EMOJIS: Record<string, string> = {
  '学びの賢者': '📖',
  '未来の勇者の守り手': '🛡️',
  '世界橋渡しの旅人': '🌏',
  'エコレンジャー': '🌳',
  'やさしさの司祭': '💝',
  '救援レスキュー': '🚒',
  'ローカルガーディアン': '🏘️',
  '癒しの治癒師': '🌱',
  'アクションランナー': '👟',
  '文化の旅人': '✏️',
  'イベントマエストロ': '🌝',
}

/**
 * バッジ名から絵文字を取得する
 * @param badgeName バッジ名
 * @returns 絵文字（デフォルトは🏅）
 */
export function getBadgeEmoji(badgeName: string): string {
  return GENRE_BADGE_EMOJIS[badgeName] || '🏅'
}



