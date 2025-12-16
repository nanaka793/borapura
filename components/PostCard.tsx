'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { MouseEvent } from 'react'
import { Post } from '@/lib/types'

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

// HEIC形式の画像を検出する関数
function isHeicImage(url: string): boolean {
  if (!url) return false
  const lowerUrl = url.toLowerCase()
  return lowerUrl.includes('.heic') || lowerUrl.includes('image/heic') || lowerUrl.includes('heic')
}

interface PostCardProps {
  post: Post
  chapterNumber?: number
  themeColor?: string
}

const TYPE_BADGES: Record<string, { label: string; className: string }> = {
  記録投稿: { label: '冒険日誌', className: 'bg-primary-100 text-primary-700' },
  募集投稿: { label: 'ボランティア募集', className: 'bg-yellow-100 text-yellow-800' },
}

export default function PostCard({ post, chapterNumber, themeColor }: PostCardProps) {
  const router = useRouter()
  const defaultThemeColor = themeColor || '#0B1024'
  
  // テーマカラーからグラデーションを作成
  const getGradientStyle = () => {
    if (themeColor) {
      const rgb = hexToRgb(themeColor)
      if (rgb) {
        const lighterRgb = {
          r: Math.min(255, rgb.r + 30),
          g: Math.min(255, rgb.g + 30),
          b: Math.min(255, rgb.b + 30),
        }
        return `linear-gradient(135deg, ${themeColor}, rgb(${lighterRgb.r}, ${lighterRgb.g}, ${lighterRgb.b}))`
      }
    }
    return 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)'
  }

  const handleCardClick = () => {
    if (post.type === '募集投稿') {
      router.push(`/events/${post.id}`)
    } else {
      router.push(`/posts/${post.id}`)
    }
  }

  const handleAuthorClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    router.push(`/users/${post.authorId}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 cursor-pointer"
    >
      <div className="mb-4 rounded-xl border border-gray-100 overflow-hidden relative">
        <div className="absolute right-3 top-3 z-10">
          <span
            className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold ${
              TYPE_BADGES[post.type || '記録投稿']?.className || 'bg-gray-100 text-gray-600'
            }`}
          >
            {TYPE_BADGES[post.type || '記録投稿']?.label || post.type || '記録投稿'}
          </span>
        </div>
        <div className="relative h-48 w-full bg-gray-50">
          {post.images && post.images.length > 0 ? (
            <Image
              src={post.images[0]}
              alt={`${post.title} の写真`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              unoptimized={isHeicImage(post.images[0])}
            />
          ) : (
            <div className="h-full w-full" style={{ background: getGradientStyle() }} />
          )}
        </div>
      </div>
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          {chapterNumber !== undefined && (
            <p className="text-lg font-semibold" style={{ color: defaultThemeColor }}>第{chapterNumber}章</p>
          )}
          <h3 className="text-2xl font-bold text-gray-800">{post.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button
              type="button"
              onClick={handleAuthorClick}
              className="font-semibold hover:underline focus:outline-none"
              style={{ color: defaultThemeColor }}
            >
              {post.author}
            </button>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString('ja-JP')}</span>
          </div>
          {post.category && (
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                {post.category}
              </span>
            </div>
          )}
        </div>
      </div>
      <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
      {post.location && (
        <p className="text-sm text-gray-500 mb-2">📍 {post.location}</p>
      )}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>💬 {post.comments?.length || 0} 冒険者の声</span>
        <span>❤️ {post.likes || 0} エール</span>
      </div>
    </div>
  )
}

