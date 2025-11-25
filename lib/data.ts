import { Post, User, Comment, Event } from './types'
import {
  createRecord,
  findRecordByField,
  getRecord,
  listRecords,
  updateRecord,
} from './airtable'

const USERS_TABLE = 'Users'
const POSTS_TABLE = 'Posts'

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
  Location?: string
  Website?: string
}

interface PostFields {
  Title?: string
  Type?: string[]
  Author?: string
  Content?: string
  Image?: Array<{ url: string }>
  Location?: string
  Organization?: string
  Tag?: string[]
  CreatedAt?: string
  Likes?: number
  Comments?: string
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
  const authorName = fields.Author || '匿名'
  const author = userMap.get(authorName.toLowerCase())
  return {
    id,
    title: fields.Title || 'Untitled',
    type: fields.Type?.[0],
    content: fields.Content || '',
    author: authorName,
    authorId: author?.id || '',
    category: fields.Tag?.[0],
    tags: fields.Tag,
    location: fields.Location,
    createdAt: fields.CreatedAt || createdTime,
    updatedAt: fields.CreatedAt || createdTime,
    likes: fields.Likes ?? 0,
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
    Location: post.location,
    Organization: post.organization,
    Tag: post.tags || (post.category ? [post.category] : undefined),
    // CreatedAtはAirTableが自動的に設定
  }

  if (typeof post.likes === 'number' && post.likes > 0) {
    fields.Likes = post.likes
  }

  if (post.comments && post.comments.length > 0) {
    fields.Comments = JSON.stringify(post.comments)
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

