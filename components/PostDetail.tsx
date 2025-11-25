'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Post } from '@/lib/types'
import CommentSection from './CommentSection'
import Link from 'next/link'
import Avatar from './Avatar'

interface PostDetailProps {
  post: Post
  authorAvatar?: string
}

export default function PostDetail({ post, authorAvatar }: PostDetailProps) {
  const router = useRouter()
  const [likes, setLikes] = useState(post.likes)
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
      })

      if (response.ok) {
        setIsLiked(!isLiked)
        setLikes(isLiked ? likes - 1 : likes + 1)
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <Avatar src={authorAvatar} name={post.author} size="md" />
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <Link
                  href={`/users/${post.authorId}`}
                  className="font-semibold text-primary-600 text-lg hover:underline"
                >
                  {post.author}
                </Link>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleString('ja-JP')}</span>
              </div>
            </div>
          </div>
          {post.category && (
            <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
              {post.category}
            </span>
          )}
        </div>
        {post.location && (
          <p className="text-gray-600 mb-4">📍 {post.location}</p>
        )}
      </div>

      {post.images && post.images.length > 0 && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          {post.images.map((image, index) => (
            <div key={`${image}-${index}`} className="relative h-56 overflow-hidden rounded-xl border border-gray-100">
              <Image
                src={image}
                alt={`${post.title} の写真 ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="prose max-w-none mb-8">
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
          {post.content}
        </p>
      </div>

      <div className="flex items-center gap-6 mb-8 pb-8 border-b">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isLiked
              ? 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
          <span className="font-semibold">{likes}</span>
        </button>
        <div className="text-gray-600">
          💬 {post.comments?.length || 0} コメント
        </div>
      </div>

      <CommentSection postId={post.id} comments={post.comments || []} />

      <div className="mt-8">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← 戻る
        </button>
      </div>
    </div>
  )
}

