'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { MouseEvent } from 'react'
import type { Post } from '@/lib/types'
import Avatar from './Avatar'

const GRADIENTS = [
  'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
  'linear-gradient(135deg, #f97316, #ef4444)',
  'linear-gradient(135deg, #10b981, #14b8a6)',
  'linear-gradient(135deg, #ec4899, #f97316)',
  'linear-gradient(135deg, #6366f1, #22d3ee)',
]

function getGradient(key: string) {
  let hash = 0
  for (let i = 0; i < key.length; i += 1) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash)
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length]
}

interface PostGalleryCardProps {
  post: Post
  authorAvatar?: string
  showTypeBadge?: boolean
}

const TYPE_BADGES: Record<
  string,
  { label: string; className: string; bgOverlay: string }
> = {
  募集投稿: {
    label: 'ボランティア募集',
    className: 'bg-yellow-200/80 text-yellow-900',
    bgOverlay: 'from-black/80 via-black/40 to-transparent',
  },
  記録投稿: {
    label: '冒険日誌',
    className: 'bg-primary-200/80 text-primary-900',
    bgOverlay: 'from-black/70 via-black/30 to-transparent',
  },
}

export default function PostGalleryCard({
  post,
  authorAvatar,
  showTypeBadge = true,
}: PostGalleryCardProps) {
  const router = useRouter()
  const gradient = getGradient(post.category || post.id)
  const previewImage = post.images && post.images.length > 0 ? post.images[0] : null
  const typeInfo = TYPE_BADGES[post.type || '記録投稿'] || TYPE_BADGES['記録投稿']

  const handleCardClick = () => {
    router.push(`/posts/${post.id}`)
  }

  const handleAuthorClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    router.push(`/users/${post.authorId}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className="group relative block aspect-[4/5] overflow-hidden rounded-[32px] shadow-lg transition hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
    >
      {showTypeBadge && (
        <div className="absolute right-4 top-4 z-10">
          <span
            className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold backdrop-blur ${typeInfo.className}`}
          >
            {typeInfo.label}
          </span>
        </div>
      )}
      {previewImage ? (
        <>
          <Image
            src={previewImage}
            alt={`${post.title} の写真`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
            className="object-cover"
            priority={false}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${typeInfo.bgOverlay}`} />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{ backgroundImage: gradient, backgroundSize: 'cover' }}
        />
      )}
      <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
        <div className="flex items-center gap-3">
          <Avatar src={authorAvatar} name={post.author} size="sm" className="ring-2 ring-white/40" />
          <div>
            <button
              type="button"
              onClick={handleAuthorClick}
              className="text-sm font-semibold text-white hover:underline focus:outline-none"
            >
              {post.author}
            </button>
            {post.category && (
              <span className="text-xs uppercase tracking-widest text-white/80">
                {post.category}
              </span>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold leading-tight line-clamp-2">{post.title}</h3>
          <p className="mt-2 text-sm text-white/80 line-clamp-3">{post.content}</p>
          <div className="mt-4 flex items-center gap-4 text-sm font-semibold">
            <span className="flex items-center gap-1">
              <span role="img" aria-label="likes">
                ❤️
              </span>
              {post.likes}
            </span>
            <span className="flex items-center gap-1">
              <span role="img" aria-label="comments">
                💬
              </span>
              {post.comments?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

