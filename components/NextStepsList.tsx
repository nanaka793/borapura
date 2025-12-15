'use client'

import { useState } from 'react'
import type { Post } from '@/lib/types'

interface NextStepsListProps {
  posts: Post[]
}

export default function NextStepsList({ posts }: NextStepsListProps) {
  const [showAll, setShowAll] = useState(false)
  const visiblePosts = showAll ? posts : posts.slice(0, 3)

  if (posts.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {visiblePosts.map((post) => (
        <a
          key={post.id}
          href={`/events/${post.id}`}
          className="flex flex-col rounded-2xl border border-gray-100 bg-amber-50 px-4 py-3 text-sm hover:border-amber-300 hover:bg-amber-100 transition"
        >
          <span className="font-semibold text-gray-900">{post.title}</span>
          {post.subtitle && (
            <span className="mt-1 text-xs text-gray-600 line-clamp-1">
              【ミッション】{post.subtitle}
            </span>
          )}
          {post.eventDate && (
            <span className="mt-1 text-xs text-gray-500">
              📅{' '}
              {new Date(post.eventDate).toLocaleDateString('ja-JP', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
        </a>
      ))}

      {posts.length > 3 && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="mt-1 text-xs font-semibold text-amber-700 hover:underline"
        >
          {showAll ? '閉じる' : `すべて見る（${posts.length}件）`}
        </button>
      )}
    </div>
  )
}





