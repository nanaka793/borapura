import { Post, User, Comment, Event, Topic, TopicComment } from './types'
import {
  createRecord,
  findRecordByField,
  getRecord,
  listRecords,
  updateRecord,
} from './airtable'

const USERS_TABLE = 'Users'
const POSTS_TABLE = 'Posts'
const TOPICS_TABLE = 'Topics'
const TOPIC_COMMENTS_TABLE = 'TopicComments'

// バッジ定義
const ACTIVITY_POST_BADGES = [
  { count: 15, name: '伝説の探索者' },
  { count: 10, name: '熟練の旅人' },
  { count: 6, name: '冒険ログ収集家' },
  { count: 3, name: 'フィールドランナー' },
  { count: 1, name: '初陣の冒険者' },
]

const RECRUITMENT_POST_BADGES = [
  { count: 15, name: '伝説のギルドマスター' },
  { count: 10, name: '冒険ギルドの司書' },
  { count: 6, name: '熟練クエストマスター' },
  { count: 3, name: '依頼案内人' },
  { count: 1, name: '初クエスト発行者' },
]

const LIKES_BADGES = [
  { count: 100, name: '輝く伝説' },
  { count: 60, name: '祝福の英雄' },
  { count: 35, name: 'コミュニティの星' },
  { count: 20, name: '賞賛の冒険者' },
  { count: 10, name: '人気の旅人' },
  { count: 5, name: 'みんなの灯' },
]

const COMMENT_BADGES = [
  { count: 50, name: '心の架け橋' },
  { count: 20, name: 'つながりの賢者' },
  { count: 10, name: 'コミュニティの語り部' },
  { count: 5, name: '声かけ名人' },
  { count: 2, name: '友好の印' },
]

// ジャンルごとのバッジ定義（各ジャンルで5つ以上投稿で付与）
const GENRE_BADGES = [
  { genre: '教育', name: '学びの賢者', emoji: '📖' },
  { genre: '子ども', name: '未来の勇者の守り手', emoji: '🛡️' },
  { genre: '国際協力', name: '世界橋渡しの旅人', emoji: '🌏' },
  { genre: '環境保護', name: 'エコレンジャー', emoji: '🌳' },
  { genre: '福祉', name: 'やさしさの司祭', emoji: '💝' },
  { genre: '災害支援', name: '救援レスキュー', emoji: '🚒' },
  { genre: '地域活動', name: 'ローカルガーディアン', emoji: '🏘️' },
  { genre: '医療・健康', name: '癒しの治癒師', emoji: '🌱' },
  { genre: 'スポーツ', name: 'アクションランナー', emoji: '👟' },
  { genre: '文化', name: '文化の旅人', emoji: '✏️' },
  { genre: 'イベント', name: 'イベントマエストロ', emoji: '🌝' },
]

// 投稿数に基づいてバッジを取得する関数
function getBadgeForCount(count: number, badges: Array<{ count: number; name: string }>): string | null {
  // 降順にソートされている前提で、最初に条件を満たすバッジを返す
  for (const badge of badges) {
    if (count >= badge.count) {
      return badge.name
    }
  }
  return null
}

interface UserFields {
  Name?: string
  Email?: string
  PasswordHash?: string
  Avatar?: Array<{ url: string }>
  Headline?: string
  Bio?: string
  Interests?: string[]
  CreatedAt?: string
  Badge?: string
  Badges?: string
  Location?: string
  Website?: string
  Friends?: string
  NextStep?: string
}

interface PostFields {
  Title?: string
  Type?: string[]
  Author?: string
  Content?: string
  SubTitle?: string
  Image?: Array<{ url: string }>
  Location?: string
  Organization?: string
  Contact?: string
  Cost?: string
  Period?: string
  Date?: string
  Tag?: string[]
  Style?: string[]
  QuestStyle?: number
  EmotionMeter?: number
  GrowthDiscovery?: string
  FinalBoss?: string
  CreatedAt?: string
  Likes?: number
  Comments?: string
  Reactions?: string
}

const localEvents: Event[] = [
  {
    id: 'event-1',
    title: '海岸清掃キャラバン in 鎌倉',
    description:
      '家族連れでも参加できる海岸清掃イベント。午前中はビーチクリーン、午後は交流会を予定しています。',
    category: '環境保護',
    location: '神奈川県鎌倉市 由比ヶ浜海岸',
    date: '2025-12-05T09:00:00+09:00',
    organizer: 'NPO Clean Blue',
    contact: 'hello@cleanblue.jp',
    slots: 40,
    tags: ['ビーチクリーン', '家族歓迎', '初心者OK'],
    likes: 28,
    comments: 9,
    coverImage:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'event-2',
    title: 'こども食堂サポートデー',
    description:
      '地域のこども食堂で調理補助や学習サポートを行います。午後の部ではキャリア相談会も実施します。',
    category: '福祉',
    location: '大阪府大阪市 西区民センター',
    date: '2025-12-12T15:00:00+09:00',
    organizer: 'つながり食堂ネットワーク',
    contact: 'support@tsunagari.jp',
    slots: 25,
    tags: ['子ども支援', '調理', '学習支援'],
    likes: 41,
    comments: 14,
    coverImage:
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'event-3',
    title: '多言語まちあるきガイド養成講座',
    description:
      '訪日観光客向けのガイドを目指す方向けの短期集中講座。実地研修とオンライン講座を組み合わせています。',
    category: '国際協力',
    location: '東京都台東区 谷中エリア',
    date: '2026-01-18T10:00:00+09:00',
    organizer: 'Tokyo Local Stories',
    contact: 'join@tls-volunteer.com',
    slots: 30,
    tags: ['語学', 'まちづくり', '研修あり'],
    likes: 19,
    comments: 6,
    coverImage:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
  },
]

function mapUser(record: { id: string; fields: UserFields; createdTime: string }): User {
  const { fields, id, createdTime } = record
  return {
    id,
    name: fields.Name || 'No Name',
    email: fields.Email || '',
    passwordHash: fields.PasswordHash || '',
    avatar: fields.Avatar?.[0]?.url || '',
    headline: fields.Headline,
    bio: fields.Bio,
    interests: fields.Interests || [],
    location: fields.Location,
    website: fields.Website,
    createdAt: fields.CreatedAt || createdTime,
    following: [],
    followers: [],
    badge: fields.Badge,
    badges: (() => {
      if (!fields.Badges) return []
      try {
        // JSON配列として保存されている場合
        const parsed = JSON.parse(fields.Badges)
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean)
        }
      } catch {
        // JSONでなければカンマ区切り文字列として扱う
        if (typeof fields.Badges === 'string') {
          return fields.Badges.split(',').map((v) => v.trim()).filter(Boolean)
        }
      }
      return []
    })(),
    friends: (() => {
      if (!fields.Friends) return []
      try {
        const parsed = JSON.parse(fields.Friends)
        if (Array.isArray(parsed)) {
          return parsed.map((id) => id?.toString?.()).filter(Boolean)
        }
      } catch {
        // JSONでなければカンマ区切り文字列として扱う（後方互換）
        return fields.Friends.split(',').map((v) => v.trim()).filter(Boolean)
      }
      return []
    })(),
    nextSteps: (() => {
      if (!fields.NextStep) return []
      try {
        const parsed = JSON.parse(fields.NextStep)
        if (Array.isArray(parsed)) {
          return parsed.map((id) => id?.toString?.()).filter(Boolean)
        }
      } catch {
        // JSONでなければカンマ区切り文字列として扱う
        return fields.NextStep.split(',').map((v) => v.trim()).filter(Boolean)
      }
      return []
    })(),
  }
}

function parseComments(serialized?: string): Comment[] {
  if (!serialized) return []
  try {
    const parsed = JSON.parse(serialized) as Comment[]
    return normalizeComments(parsed)
  } catch {
    return []
  }
}

function normalizeComments(comments: Comment[]): Comment[] {
  return comments.map((comment) => ({
    ...comment,
    likes: typeof comment.likes === 'number' ? comment.likes : 0,
    replies: comment.replies ? normalizeComments(comment.replies) : [],
  }))
}

function mapPost(record: { id: string; fields: PostFields; createdTime: string }, userMap: Map<string, User>): Post {
  const { fields, id, createdTime } = record
  // デバッグ用: Airtableから取得したfieldsを確認
  if (process.env.NODE_ENV === 'development') {
    console.log('Airtable fields keys:', Object.keys(fields))
    console.log('Contact field value:', fields.Contact)
    console.log('All fields:', JSON.stringify(fields, null, 2))
  }
  const authorName = fields.Author || '匿名'
  const author = userMap.get(authorName.toLowerCase())
  let reactions: Record<string, number> | undefined
  if (fields.Reactions) {
    try {
      const parsed = JSON.parse(fields.Reactions) as Record<string, number>
      if (parsed && typeof parsed === 'object') {
        reactions = Object.fromEntries(
          Object.entries(parsed).map(([key, value]) => [key, typeof value === 'number' ? value : 0])
        )
      }
    } catch {
      reactions = undefined
    }
  }
  return {
    id,
    title: fields.Title || 'Untitled',
    type: fields.Type?.[0],
    content: fields.Content || '',
    subtitle: fields.SubTitle,
    author: authorName,
    authorId: author?.id || '',
    category: fields.Tag?.[0],
    tags: fields.Tag,
    location: fields.Location,
    contact: fields.Contact,
    cost: fields.Cost,
    period: fields.Period,
    eventDate: fields.Date,
    styles: fields.Style,
    questStyle: fields.QuestStyle !== undefined ? fields.QuestStyle : undefined,
    emotionMeter: fields.EmotionMeter !== undefined ? fields.EmotionMeter : undefined,
    growthDiscovery: fields.GrowthDiscovery,
    finalBoss: fields.FinalBoss,
    createdAt: fields.CreatedAt || createdTime,
    updatedAt: fields.CreatedAt || createdTime,
    likes: fields.Likes ?? 0,
    reactions,
    comments: parseComments(fields.Comments),
    organization: fields.Organization,
    images: fields.Image?.map((image) => image.url).filter(Boolean) ?? [],
  }
}

export async function getUsers(): Promise<User[]> {
  const records = await listRecords<UserFields>(USERS_TABLE)
  return records.map(mapUser)
}

export async function getUser(id: string): Promise<User | null> {
  const record = await getRecord<UserFields>(USERS_TABLE, id)
  return record ? mapUser(record) : null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const record = await findRecordByField<UserFields>(USERS_TABLE, 'Email', email)
  return record ? mapUser(record) : null
}

export async function saveUser(user: User): Promise<User> {
  const fields: UserFields = {
    Name: user.name,
    Email: user.email,
    PasswordHash: user.passwordHash,
    Avatar: user.avatar ? [{ url: user.avatar }] : undefined,
    Headline: user.headline,
    Bio: user.bio,
    Interests: user.interests,
    Location: user.location,
    Website: user.website,
    CreatedAt: user.createdAt || new Date().toISOString(),
    Friends: user.friends && user.friends.length > 0 ? JSON.stringify(user.friends) : undefined,
    NextStep:
      user.nextSteps && user.nextSteps.length > 0 ? JSON.stringify(user.nextSteps) : undefined,
    Badges: user.badges && user.badges.length > 0 ? JSON.stringify(user.badges) : undefined,
  }

  const record = user.id
    ? await updateRecord<UserFields>(USERS_TABLE, user.id, fields)
    : await createRecord<UserFields>(USERS_TABLE, fields)

  return mapUser(record)
}

export async function updateUser(
  id: string,
  updates: Partial<Omit<User, 'id' | 'email' | 'passwordHash'>>
): Promise<User | null> {
  const fields: Partial<UserFields> = {
    Name: updates.name,
    Headline: updates.headline,
    Bio: updates.bio,
    Interests: updates.interests && updates.interests.length > 0 ? updates.interests : undefined,
    Avatar: updates.avatar ? [{ url: updates.avatar }] : undefined,
    Location: updates.location,
    Website: updates.website,
    Friends: updates.friends ? JSON.stringify(updates.friends) : undefined,
    NextStep: updates.nextSteps ? JSON.stringify(updates.nextSteps) : undefined,
    Badges: updates.badges && updates.badges.length > 0 ? JSON.stringify(updates.badges) : undefined,
  }

  try {
    const record = await updateRecord<UserFields>(USERS_TABLE, id, fields)
    return record ? mapUser(record) : null
  } catch (error: any) {
    // Multiple selectフィールドで存在しない選択肢が指定された場合のエラーハンドリング
    if (error?.message?.includes('INVALID_MULTIPLE_CHOICE_OPTIONS')) {
      throw new Error(
        '指定された関心テーマがAirTableに登録されていません。AirTableのUIで「教育」「国際協力」などの選択肢を事前に追加してください。'
      )
    }
    throw error
  }
}

export async function updateUserFriends(
  id: string,
  friendIds: string[]
): Promise<User | null> {
  const fields: Partial<UserFields> = {
    Friends: friendIds.length > 0 ? JSON.stringify(friendIds) : '',
  }

  const record = await updateRecord<UserFields>(USERS_TABLE, id, fields)
  return record ? mapUser(record) : null
}

export async function getPosts(): Promise<Post[]> {
  const [userList, postRecords] = await Promise.all([getUsers(), listRecords<PostFields>(POSTS_TABLE)])

  const userMap = new Map<string, User>(userList.map((user) => [user.name.toLowerCase(), user]))
  return postRecords
    .map((record) => mapPost(record, userMap))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getPost(id: string): Promise<Post | null> {
  const [userList, record] = await Promise.all([getUsers(), getRecord<PostFields>(POSTS_TABLE, id)])
  if (!record) return null
  const userMap = new Map<string, User>(userList.map((user) => [user.name.toLowerCase(), user]))
  return mapPost(record, userMap)
}

export async function savePost(post: Post): Promise<{ post: Post; recordId: string }> {
  const fields: PostFields = {
    Title: post.title,
    Type: post.type ? [post.type] : ['記録投稿'],
    Author: post.author,
    Content: post.content,
    SubTitle: post.subtitle,
    Location: post.location,
    Organization: post.organization,
    Style: post.styles,
    Contact: post.contact,
    Cost: post.cost,
    Period: post.period,
    Date: post.eventDate,
    Tag: post.tags || (post.category ? [post.category] : undefined),
    QuestStyle: post.questStyle !== undefined ? post.questStyle : undefined,
    EmotionMeter: post.emotionMeter !== undefined ? post.emotionMeter : undefined,
    GrowthDiscovery: post.growthDiscovery || undefined,
    FinalBoss: post.finalBoss || undefined,
    // CreatedAtはAirTableが自動的に設定
  }

  if (typeof post.likes === 'number' && post.likes > 0) {
    fields.Likes = post.likes
  }

  if (post.comments && post.comments.length > 0) {
    fields.Comments = JSON.stringify(post.comments)
  }

  if (post.reactions && Object.keys(post.reactions).length > 0) {
    fields.Reactions = JSON.stringify(post.reactions)
  }

  try {
    const record = post.id
      ? await updateRecord<PostFields>(POSTS_TABLE, post.id, fields)
      : await createRecord<PostFields>(POSTS_TABLE, fields)

    const users = await getUsers()
    const userMap = new Map<string, User>(users.map((user) => [user.name.toLowerCase(), user]))
    return { post: mapPost(record, userMap), recordId: record.id }
  } catch (error: any) {
    const errorMessage = error?.message || ''
    console.error('savePost Airtable error', {
      postType: post.type,
      fieldsType: fields.Type,
      errorMessage,
    })
    
    // 存在しないフィールド名のエラーハンドリング
    if (errorMessage.includes('UNKNOWN_FIELD_NAME')) {
      // エラーメッセージからフィールド名を抽出
      // パターン1: "Unknown field name: \"FieldName\""
      let fieldMatch = errorMessage.match(/Unknown field name: "([^"]+)"/)
      // パターン2: JSON形式のエラーレスポンス
      if (!fieldMatch) {
        try {
          const jsonMatch = errorMessage.match(/\{"error":\{[^}]*"message":"([^"]+)"/)
          if (jsonMatch) {
            const innerMessage = jsonMatch[1]
            fieldMatch = innerMessage.match(/Unknown field name: "([^"]+)"/)
          }
        } catch {
          // JSON解析に失敗した場合は次の方法を試す
        }
      }
      // パターン3: エラーメッセージ全体から直接抽出
      if (!fieldMatch) {
        fieldMatch = errorMessage.match(/"([A-Z][a-zA-Z]+)"/)
      }
      
      const fieldName = fieldMatch ? fieldMatch[1] : '不明なフィールド'
      throw new Error(
        `AirTableの「Posts」テーブルに「${fieldName}」フィールドが存在しません。AirTableのUIでこのフィールドを追加するか、コードから削除してください。`
      )
    }
    
    // Multiple selectフィールドで存在しない選択肢が指定された場合のエラーハンドリング
    if (errorMessage.includes('INVALID_MULTIPLE_CHOICE_OPTIONS')) {
      throw new Error(
        'AirTableの「Type」フィールドに存在しない選択肢が指定されました。AirtableのUIで「記録投稿」「募集投稿」が登録されているか確認してください。'
      )
    }
    
    throw error
  }
}

export async function getRecruitmentPosts(): Promise<Post[]> {
  const posts = await getPosts()
  return posts.filter((post) => post.type === '募集投稿')
}

/**
 * ユーザーの投稿数に基づいてバッジを更新する
 * @param userId ユーザーID
 * @returns 更新されたユーザー情報、またはnull
 */
export async function updateUserBadges(userId: string): Promise<User | null> {
  try {
    if (!userId || typeof userId !== 'string') {
      console.error('Invalid userId provided to updateUserBadges:', userId)
      return null
    }

    const user = await getUser(userId)
    if (!user) {
      return null
    }

    const posts = await getPosts()
    const userPosts = posts.filter((p) => p && (p.authorId === userId || p.author === user.name))

  // 記録投稿と募集投稿を分けてカウント
  const activityPostCount = userPosts.filter((p) => p.type === '記録投稿').length
  const recruitmentPostCount = userPosts.filter((p) => p.type === '募集投稿').length

  // いいねの合計数を計算
  const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes || 0), 0)

  // 他の人の投稿につけたコメント数をカウント
  const countComments = (comments: Comment[] | undefined, userId: string, userName: string): number => {
    if (!comments || !Array.isArray(comments)) {
      return 0
    }
    let count = 0
    for (const comment of comments) {
      if (!comment) continue
      // コメントが該当ユーザーのものである場合
      if (
        (comment.authorId === userId || comment.author === userName) &&
        comment.author && comment.author !== ''
      ) {
        count++
      }
      // 返信もカウント
      if (comment.replies && Array.isArray(comment.replies) && comment.replies.length > 0) {
        count += countComments(comment.replies, userId, userName)
      }
    }
    return count
  }

  let totalComments = 0
  for (const post of posts) {
    // 自分の投稿ではない場合のみカウント
    if (post && post.authorId !== userId && post.author !== user.name) {
      if (post.comments && Array.isArray(post.comments) && post.comments.length > 0) {
        totalComments += countComments(post.comments, userId, user.name)
      }
    }
  }

  // バッジを取得
  const activityBadge = getBadgeForCount(activityPostCount, ACTIVITY_POST_BADGES)
  const recruitmentBadge = getBadgeForCount(recruitmentPostCount, RECRUITMENT_POST_BADGES)
  const likesBadge = getBadgeForCount(totalLikes, LIKES_BADGES)
  const commentBadge = getBadgeForCount(totalComments, COMMENT_BADGES)

  // ジャンルごとの投稿数をカウント（categoryまたはtagsから判定）
  const genreCounts = new Map<string, number>()
  
  // ジャンル名の別名マッピング（tagsなどで使われる可能性のある名称）
  const genreAliases: Record<string, string[]> = {
    '教育': ['教育', '学習', '学習支援', '教育支援'],
    '子ども': ['子ども', '子供', '子ども支援', '子供支援', '児童', '児童支援'],
    '国際協力': ['国際協力', '国際', '多文化', '多言語'],
    '環境保護': ['環境保護', '環境', 'エコ', '環境問題', 'ビーチクリーン', '清掃'],
    '福祉': ['福祉', '社会福祉', '高齢者', '高齢者支援', '障害者', '障害者支援'],
    '災害支援': ['災害支援', '災害', '救援', '災害ボランティア'],
    '地域活動': ['地域活動', '地域', 'まちづくり', 'コミュニティ'],
    '医療・健康': ['医療・健康', '医療', '健康', 'ヘルスケア', '保健'],
    'スポーツ': ['スポーツ', '運動', 'フィットネス'],
    '文化': ['文化', '芸術', 'アート', '伝統文化'],
    'イベント': ['イベント', '企画', '催し'],
  }
  
  for (const post of userPosts) {
    if (!post) continue
    const matchedGenres = new Set<string>()
    
    // categoryフィールドから取得（完全一致）
    if (post.category) {
      const categoryValue = String(post.category).trim()
      if (process.env.NODE_ENV === 'development') {
        console.log(`[バッジ] 投稿 "${post.title}" のcategory: "${categoryValue}"`)
      }
      
      // ジャンル名と完全一致
      for (const badgeDef of GENRE_BADGES) {
        if (categoryValue === badgeDef.genre) {
          matchedGenres.add(badgeDef.genre)
          if (process.env.NODE_ENV === 'development') {
            console.log(`[バッジ] categoryでマッチ: "${badgeDef.genre}"`)
          }
        }
      }
      
      // ジャンル名の別名もチェック
      for (const [genre, aliases] of Object.entries(genreAliases)) {
        if (aliases.includes(categoryValue)) {
          matchedGenres.add(genre)
          if (process.env.NODE_ENV === 'development') {
            console.log(`[バッジ] category別名でマッチ: "${genre}" (${categoryValue})`)
          }
        }
      }
    }
    
    // tagsフィールドから取得
    if (post.tags && Array.isArray(post.tags)) {
      for (const tag of post.tags) {
        if (!tag) continue
        const tagValue = String(tag).trim()
        
        // タグがジャンル名と完全一致
        for (const badgeDef of GENRE_BADGES) {
          if (tagValue === badgeDef.genre) {
            matchedGenres.add(badgeDef.genre)
            if (process.env.NODE_ENV === 'development') {
              console.log(`[バッジ] tagでマッチ: "${badgeDef.genre}" (${tagValue})`)
            }
          }
        }
        
        // タグがジャンルの別名と一致
        for (const [genre, aliases] of Object.entries(genreAliases)) {
          if (aliases.includes(tagValue)) {
            matchedGenres.add(genre)
            if (process.env.NODE_ENV === 'development') {
              console.log(`[バッジ] tag別名でマッチ: "${genre}" (${tagValue})`)
            }
          }
        }
      }
    }
    
    // マッチしたジャンルをカウント
    for (const genre of matchedGenres) {
      const count = genreCounts.get(genre) || 0
      genreCounts.set(genre, count + 1)
    }
  }

  // ジャンルごとのバッジを取得（5つ以上で付与）
  const genreBadges: string[] = []
  if (process.env.NODE_ENV === 'development') {
    console.log(`[バッジ] ユーザー "${user.name}" の投稿数: ${userPosts.length}件`)
    console.log(`[バッジ] ジャンルカウント結果:`, Array.from(genreCounts.entries()))
  }
  
  for (const badgeDef of GENRE_BADGES) {
    const count = genreCounts.get(badgeDef.genre) || 0
    if (process.env.NODE_ENV === 'development') {
      console.log(`[バッジ] ジャンル "${badgeDef.genre}": ${count}件の投稿`)
    }
    if (count >= 5) {
      genreBadges.push(badgeDef.name)
      if (process.env.NODE_ENV === 'development') {
        console.log(`[バッジ] ✓ バッジ付与: ${badgeDef.name} (${count}件)`)
      }
    }
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[バッジ] 付与されるジャンルバッジ:`, genreBadges)
  }

  // 既存のバッジがあれば追加（ただし、同じカテゴリの新しいバッジで上書き）
  const existingBadges = user.badges || []
  const categoryMap = new Map<string, string>()
  const existingGenreBadges = new Set<string>()
  
  // 既存のバッジをカテゴリごとに分類
  existingBadges.forEach((badge) => {
    const isActivityBadge = ACTIVITY_POST_BADGES.some((b) => b.name === badge)
    const isRecruitmentBadge = RECRUITMENT_POST_BADGES.some((b) => b.name === badge)
    const isLikesBadge = LIKES_BADGES.some((b) => b.name === badge)
    const isCommentBadge = COMMENT_BADGES.some((b) => b.name === badge)
    const isGenreBadge = GENRE_BADGES.some((b) => b.name === badge)
    
    if (isActivityBadge) {
      categoryMap.set('activity', badge)
    } else if (isRecruitmentBadge) {
      categoryMap.set('recruitment', badge)
    } else if (isLikesBadge) {
      categoryMap.set('likes', badge)
    } else if (isCommentBadge) {
      categoryMap.set('comment', badge)
    } else if (isGenreBadge) {
      existingGenreBadges.add(badge)
    } else {
      // カテゴリに属さないバッジ（将来の拡張用）はそのまま保持
      // ここでは処理しない（後で追加）
    }
  })

  // 新しいバッジで上書きまたは追加
  if (activityBadge) {
    categoryMap.set('activity', activityBadge)
  }
  if (recruitmentBadge) {
    categoryMap.set('recruitment', recruitmentBadge)
  }
  if (likesBadge) {
    categoryMap.set('likes', likesBadge)
  }
  if (commentBadge) {
    categoryMap.set('comment', commentBadge)
  }

  // マップから配列に変換
  const finalBadges = Array.from(categoryMap.values())
  
  // ジャンルバッジを追加（新しいバッジと既存でまだ有効なバッジを含める）
  const validGenreBadges = new Set(genreBadges)
  // 既存のジャンルバッジで、まだ条件を満たしているものも含める
  for (const existingGenreBadge of existingGenreBadges) {
    if (genreBadges.includes(existingGenreBadge)) {
      validGenreBadges.add(existingGenreBadge)
    }
  }
  finalBadges.push(...Array.from(validGenreBadges))
  
  // 既存のバッジでカテゴリに属さないものを追加
  existingBadges.forEach((badge) => {
    const isActivityBadge = ACTIVITY_POST_BADGES.some((b) => b.name === badge)
    const isRecruitmentBadge = RECRUITMENT_POST_BADGES.some((b) => b.name === badge)
    const isLikesBadge = LIKES_BADGES.some((b) => b.name === badge)
    const isCommentBadge = COMMENT_BADGES.some((b) => b.name === badge)
    const isGenreBadge = GENRE_BADGES.some((b) => b.name === badge)
    if (!isActivityBadge && !isRecruitmentBadge && !isLikesBadge && !isCommentBadge && !isGenreBadge && !finalBadges.includes(badge)) {
      finalBadges.push(badge)
    }
  })
  
  // 重複を除去
  const uniqueBadges = Array.from(new Set(finalBadges))

    // バッジを更新
    if (process.env.NODE_ENV === 'development') {
      console.log(`[バッジ] 保存するバッジ:`, uniqueBadges)
    }
    const result = await updateUser(userId, { badges: uniqueBadges })
    if (process.env.NODE_ENV === 'development' && result) {
      console.log(`[バッジ] 保存後のユーザーバッジ:`, result.badges)
    }
    return result
  } catch (error) {
    console.error('Error updating user badges:', error)
    return null
  }
}

// ==================== Topics ====================

interface TopicFields {
  Title?: string
  Description?: string
  IsActive?: boolean
  CreatedAt?: string
  UpdatedAt?: string
  CommentCount?: number
}

interface TopicCommentFields {
  TopicId?: string
  Author?: string
  AuthorId?: string
  Content?: string
  CreatedAt?: string
  Likes?: number
}

function mapTopic(record: { id: string; fields: TopicFields; createdTime: string }): Topic {
  const { fields, id, createdTime } = record
  return {
    id,
    title: fields.Title || '無題のテーマ',
    description: fields.Description,
    isActive: fields.IsActive ?? true,
    createdAt: fields.CreatedAt || createdTime,
    updatedAt: fields.UpdatedAt || createdTime,
    commentCount: fields.CommentCount ?? 0,
  }
}

function mapTopicComment(record: {
  id: string
  fields: TopicCommentFields
  createdTime: string
}): TopicComment {
  const { fields, id, createdTime } = record
  return {
    id,
    topicId: fields.TopicId || '',
    author: fields.Author || '匿名',
    authorId: fields.AuthorId,
    content: fields.Content || '',
    createdAt: fields.CreatedAt || createdTime,
    likes: fields.Likes ?? 0,
  }
}

export async function getTopics(activeOnly: boolean = false): Promise<Topic[]> {
  const params: Record<string, string> = {}
  if (activeOnly) {
    params.filterByFormula = '{IsActive} = TRUE()'
  }
  
  const records = await listRecords<TopicFields>(TOPICS_TABLE, params)
  const topics = records.map(mapTopic)
  
  // 作成日時の降順でソート
  return topics.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function getTopic(id: string): Promise<Topic | null> {
  const record = await getRecord<TopicFields>(TOPICS_TABLE, id)
  return record ? mapTopic(record) : null
}

export async function getTopicComments(topicId: string): Promise<TopicComment[]> {
  const formula = `{TopicId} = "${topicId}"`
  const params: Record<string, string> = {
    filterByFormula: formula,
  }
  
  const records = await listRecords<TopicCommentFields>(TOPIC_COMMENTS_TABLE, params)
  const comments = records.map(mapTopicComment)
  
  // 作成日時の昇順でソート
  return comments.sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )
}

export async function createTopicComment(comment: Omit<TopicComment, 'id' | 'createdAt'>): Promise<TopicComment> {
  try {
    const fields: TopicCommentFields = {
      TopicId: comment.topicId,
      Author: comment.author,
      Content: comment.content,
      Likes: 0,
    }
    // CreatedAtはAirtableが自動的に設定するため、送信しない
    // Date型フィールドの場合、ISO文字列形式は受け付けられないため

    // AuthorIdは認証済みユーザーの場合のみ設定
    if (comment.authorId) {
      fields.AuthorId = comment.authorId
    }

    console.log('Creating topic comment:', {
      table: TOPIC_COMMENTS_TABLE,
      fields: fields,
    })

    const record = await createRecord<TopicCommentFields>(TOPIC_COMMENTS_TABLE, fields)
    
    console.log('Topic comment created successfully:', record.id)
    
    // トピックのコメント数を更新
    const topic = await getTopic(comment.topicId)
    if (topic) {
      await updateRecord<TopicFields>(TOPICS_TABLE, comment.topicId, {
        CommentCount: (topic.commentCount || 0) + 1,
        // UpdatedAtはAirtableが自動的に更新するため、送信しない
        // Date型フィールドの場合、ISO文字列形式は受け付けられないため
      })
    }

    return mapTopicComment(record)
  } catch (error: any) {
    console.error('Error in createTopicComment:', error)
    const errorMessage = error?.message || 'Unknown error'
    throw new Error(`コメントの作成に失敗しました: ${errorMessage}`)
  }
}

export async function likeTopicComment(commentId: string): Promise<{ likes: number }> {
  const record = await getRecord<TopicCommentFields>(TOPIC_COMMENTS_TABLE, commentId)
  if (!record) {
    throw new Error('コメントが見つかりません')
  }

  const currentLikes = record.fields.Likes ?? 0
  const newLikes = currentLikes + 1

  await updateRecord<TopicCommentFields>(TOPIC_COMMENTS_TABLE, commentId, {
    Likes: newLikes,
  })

  return { likes: newLikes }
}

