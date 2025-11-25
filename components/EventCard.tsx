'use client'

import { useRouter } from 'next/navigation'
import type { Post } from '@/lib/types'

interface EventCardProps {
  post: Post
}

const EVENT_GRADIENTS = [
  'linear-gradient(135deg, rgba(14,165,233,0.85), rgba(59,130,246,0.9))',
  'linear-gradient(135deg, rgba(244,114,182,0.85), rgba(248,113,113,0.9))',
  'linear-gradient(135deg, rgba(34,197,94,0.85), rgba(16,185,129,0.9))',
  'linear-gradient(135deg, rgba(99,102,241,0.85), rgba(236,72,153,0.9))',
]

function getEventGradient(key: string) {
  let hash = 0
  for (let i = 0; i < key.length; i += 1) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash)
  }
  return EVENT_GRADIENTS[Math.abs(hash) % EVENT_GRADIENTS.length]
}

export default function EventCard({ post }: EventCardProps) {
  const router = useRouter()
  const eventDate = new Date(post.createdAt)
  const gradient = getEventGradient(post.id)
  const coverImage = post.images && post.images.length > 0 ? post.images[0] : null
  const coverStyle = coverImage
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.65)), url(${coverImage})`,
        backgroundSize: 'cover' as const,
        backgroundPosition: 'center' as const,
      }
    : { backgroundImage: gradient }

  const handleClick = () => {
    router.push(`/posts/${post.id}`)
  }

  return (
    <div
      onClick={handleClick}
      className="group relative block aspect-[4/5] cursor-pointer overflow-hidden rounded-[32px] text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
      style={coverStyle}
    >
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
            {post.category || '募集投稿'}
          </span>
          <span className="text-sm font-semibold">
            {eventDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        <div>
          <h3 className="text-2xl font-bold leading-tight">{post.title}</h3>
          <p className="mt-2 text-sm text-white/80 line-clamp-3">{post.content}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            {post.location && <span>📍 {post.location}</span>}
            {post.organization && <span>👥 {post.organization}</span>}
          </div>
          <div className="mt-3 flex items-center justify-between text-sm font-semibold">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span role="img" aria-label="likes">
                  ❤️
                </span>
                {post.likes ?? 0}
              </span>
              <span className="flex items-center gap-1">
                <span role="img" aria-label="comments">
                  💬
                </span>
                {post.comments?.length ?? 0}
              </span>
            </div>
            <span className="text-xs uppercase tracking-widest text-white/70">
              {post.tags?.slice(0, 2).join(' / ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

