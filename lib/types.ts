export interface Post {
  id: string
  title: string
  type?: string
  content: string
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
  createdAt: string
  updatedAt: string
  likes: number
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

