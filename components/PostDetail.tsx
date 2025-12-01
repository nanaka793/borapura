'use client'

import { useMemo, useState, useEffect } from 'react'
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null)
  const cleanedContent = removeUrlsFromText(post.content)
  const displayTags =
    (post.tags && post.tags.length > 0 ? post.tags : post.category ? [post.category] : []).filter(
      Boolean
    )
  
  // 画像のアスペクト比を取得
  useEffect(() => {
    if (post.images && post.images.length > 0) {
      const img = new window.Image()
      img.onload = () => {
        const aspectRatio = img.naturalWidth / img.naturalHeight
        setImageAspectRatio(aspectRatio)
      }
      img.onerror = () => {
        setImageAspectRatio(null)
      }
      img.src = post.images[selectedImageIndex]
    }
  }, [post.images, selectedImageIndex])
  
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
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <Avatar src={authorAvatar} name={post.author} size="md" />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4 break-words">
                {post.title}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4">
                <Link
                  href={`/users/${post.authorId}`}
                  className="font-semibold text-primary-600 text-base sm:text-lg hover:underline"
                >
                  {post.author}
                </Link>
                <span className="hidden sm:inline">•</span>
                <span>{new Date(post.createdAt).toLocaleString('ja-JP')}</span>
              </div>
            </div>
          </div>
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-primary-100 text-primary-700 rounded-full text-xs sm:text-sm font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        </div>
      </div>

      {(formattedEventDate || post.location) && (
        <div className="mb-4 sm:mb-6 space-y-1 text-sm sm:text-base text-gray-600">
          {formattedEventDate && <p>📅 {formattedEventDate}</p>}
          {post.location && <p>📍 {post.location}</p>}
        </div>
      )}

      {post.images && post.images.length > 0 && (
        <div className="mb-6 sm:mb-8">
          {/* メイン画像（大きく表示） */}
          <div 
            className="mb-3 sm:mb-4 relative w-full overflow-hidden rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50"
            style={{
              aspectRatio: imageAspectRatio ? `${imageAspectRatio}` : '16/9',
              maxHeight: 'calc(100vh - 200px)',
            }}
          >
            <Image
              src={post.images[selectedImageIndex]}
              alt={`${post.title} の写真 ${selectedImageIndex + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1280px) 80vw, 1200px"
              className="object-contain transition-opacity duration-300"
              priority
            />
          </div>
          
          {/* サムネイル画像（2枚目以降） */}
          {post.images.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {post.images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative flex-shrink-0 h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 overflow-hidden rounded-md sm:rounded-lg border-2 transition-all duration-200 ${
                    selectedImageIndex === index
                      ? 'border-primary-500 ring-2 ring-primary-200 scale-105'
                      : 'border-gray-200 hover:border-gray-300 active:scale-105'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${post.title} の写真 ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="prose max-w-none mb-6 sm:mb-8">
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base sm:text-lg">
          {filteredContent}
        </p>
      </div>

      {post.contact && post.contact.trim() && (
        <div className="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl border border-primary-200 bg-primary-50 p-4 sm:p-6 text-center">
          <p className="text-xs sm:text-sm font-semibold text-primary-700">冒険の始まりはあなたの一歩から！</p>
          <a
            href={post.contact.startsWith('http') ? post.contact : `https://${post.contact}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center rounded-full bg-primary-600 px-4 py-2 sm:px-6 sm:py-3 text-white text-sm sm:text-base md:text-lg font-semibold shadow hover:bg-primary-700 active:bg-primary-800 transition"
          >
            この冒険に参加する（各団体サイトへ移動）
          </a>
        </div>
      )}

      <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg transition-colors active:scale-95 ${
            isLiked
              ? 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300'
          }`}
        >
          <span className="text-lg sm:text-xl">{isLiked ? '❤️' : '🤍'}</span>
          <span className="text-sm sm:text-base font-semibold">{likes}</span>
        </button>
        <div className="text-sm sm:text-base text-gray-600">
          💬 {post.comments?.length || 0} コメント
        </div>
      </div>

      <CommentSection postId={post.id} comments={post.comments || []} />

      <div className="mt-6 sm:mt-8">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 sm:px-6 border border-gray-300 rounded-lg text-sm sm:text-base font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          ← 戻る
        </button>
      </div>
    </div>
  )
}

