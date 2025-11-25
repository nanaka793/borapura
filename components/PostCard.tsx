'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { MouseEvent } from 'react'
import { Post } from '@/lib/types'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter()

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
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 cursor-pointer"
    >
      {post.images && post.images.length > 0 && (
        <div className="mb-4 overflow-hidden rounded-xl border border-gray-100">
          <div className="relative h-48 w-full">
            <Image
              src={post.images[0]}
              alt={`${post.title} の写真`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        </div>
      )}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button
              type="button"
              onClick={handleAuthorClick}
              className="font-semibold text-primary-600 hover:underline focus:outline-none"
            >
              {post.author}
            </button>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString('ja-JP')}</span>
          </div>
        </div>
        {post.category && (
          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
            {post.category}
          </span>
        )}
      </div>
      <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
      {post.location && (
        <p className="text-sm text-gray-500 mb-2">📍 {post.location}</p>
      )}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>💬 {post.comments?.length || 0} コメント</span>
        <span>❤️ {post.likes || 0} いいね</span>
      </div>
    </div>
  )
}

