export interface Post {
  id: string
  title: string
  type?: string
  content: string
  subtitle?: string
  styles?: string[]
  author: string
  authorId: string
  category?: string
  tags?: string[]
  images?: string[]
  location?: string
  organization?: string
  contact?: string
  cost?: string
  period?: string
  eventDate?: string
  questStyle?: number // クエストスタイル: 0(成長できる経験) - 6(新しいワクワク)
  emotionMeter?: number // 感情メーター: 0(ゆったり安心) - 6(ドキドキ大冒険)
  growthDiscovery?: string // 自分の成長発見
  finalBoss?: string // 今日のラスボス
  createdAt: string
  updatedAt: string
  likes: number
  reactions?: Record<string, number>
  comments: Comment[]
}

export interface Comment {
  id: string
  postId: string
  author: string
  authorId: string
  content: string
  createdAt: string
  parentId?: string
  replies?: Comment[]
  likes: number
}

export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  headline?: string
  bio?: string
  avatar?: string
  location?: string
  interests?: string[]
  website?: string
  createdAt: string
  following: string[]
  followers: string[]
  badge?: string
  badges?: string[]
  friends?: string[]
  nextSteps?: string[]
}

export interface Event {
  id: string
  title: string
  description: string
  category: string
  location: string
  date: string
  organizer: string
  contact: string
  slots: number
  tags: string[]
  likes: number
  comments: number
  coverImage?: string
}

export interface Topic {
  id: string
  title: string
  description?: string
  image?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  commentCount: number
}

export interface TopicComment {
  id: string
  topicId: string
  author: string
  authorId?: string
  content: string
  createdAt: string
  likes: number
}

