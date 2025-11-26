'use client'

import { useMemo, useState } from 'react'
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

function removeUrlsFromText(text: string): string {
  // URLパターンと「【連絡先】」ラベルを削除しつつ改行は保持
  let cleaned = text
    .replace(/https?:\/\/[^\s\n]+/g, '') // http:// または https:// で始まるURL（改行は除く）
    .replace(/www\.[^\s\n]+/g, '') // www. で始まるURL（改行は除く）
    .replace(/【連絡先】[^\n]*/g, '') // 「【連絡先】」とその行の内容を削除
    .replace(/\n\s*\n+/g, '\n') // 連続する空行（改行のみ、または空白のみの行）を1つに
    .replace(/[ \t]+/g, ' ') // 連続するスペースやタブを1つに（改行は保持）
    .replace(/^\n+|\n+$/g, '') // 先頭と末尾の空行を削除
    .trim()
  return cleaned
}

export default function PostDetail({ post, authorAvatar }: PostDetailProps) {
  const router = useRouter()
  const [likes, setLikes] = useState(post.likes)
  const [isLiked, setIsLiked] = useState(false)
  const cleanedContent = removeUrlsFromText(post.content)
  const displayTags =
    (post.tags && post.tags.length > 0 ? post.tags : post.category ? [post.category] : []).filter(
      Boolean
    )
  
  // デバッグ用: contactフィールドの値を確認
  if (typeof window !== 'undefined') {
    console.log('Post contact:', post.contact)
  }

  const filteredContent = useMemo(() => {
    let seenPeriod = false
    return cleanedContent
      .split('\n')
      .filter((line) => {
        const trimmed = line.trim()
        if (!trimmed) {
          return true
        }
        if (
          trimmed.startsWith('【開催日時】') ||
          trimmed.startsWith('【開催場所】')
        ) {
          return false
        }
        if (trimmed.startsWith('【申込締切】')) {
          if (seenPeriod) return false
          seenPeriod = true
          return true
        }
        return true
      })
      .join('\n')
  }, [cleanedContent])

  const eventDateObj = post.eventDate ? new Date(post.eventDate) : null
  const formattedEventDate = eventDateObj
    ? `${eventDateObj.toLocaleDateString('ja-JP')} ${eventDateObj.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}`
    : null

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
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        </div>
      </div>

      {(formattedEventDate || post.location) && (
        <div className="mb-4 space-y-1 text-gray-600">
          {formattedEventDate && <p>📅 {formattedEventDate}</p>}
          {post.location && <p>📍 {post.location}</p>}
        </div>
      )}

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
          {filteredContent}
        </p>
      </div>

      {post.contact && post.contact.trim() && (
        <div className="mb-8 rounded-2xl border border-primary-200 bg-primary-50 p-6 text-center">
          <p className="text-sm font-semibold text-primary-700">参加希望・お問い合わせ</p>
          <a
            href={post.contact.startsWith('http') ? post.contact : `https://${post.contact}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-white text-lg font-semibold shadow hover:bg-primary-700 transition"
          >
            参加希望・お問い合わせはこちら
          </a>
        </div>
      )}

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

