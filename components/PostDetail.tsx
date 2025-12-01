'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Post } from '@/lib/types'
import BookmarkButton from './BookmarkButton'
import CommentSection from './CommentSection'
import Link from 'next/link'
import Avatar from './Avatar'

interface PostDetailProps {
  post: Post
  authorAvatar?: string
  canBookmark?: boolean
  initialBookmarked?: boolean
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

export default function PostDetail({
  post,
  authorAvatar,
  canBookmark = false,
  initialBookmarked = false,
}: PostDetailProps) {
  const router = useRouter()
  const REACTIONS = ['⚔️', '🛡️', '🚀', '🌟', '🌈', '🤝', '🔥', '💛', '🎉'] as const
  const [likes, setLikes] = useState(post.likes)
  const [reactions, setReactions] = useState<Record<string, number>>(
    () => post.reactions || {}
  )
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null)
  const cleanedContent = removeUrlsFromText(post.content)
  const isRecruitment = post.type === '募集投稿'
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

  const { descriptionHtml, metaHtml } = useMemo(() => {
    const metaLabels = ['【主催】', '【募集人数】', '【参加費】', '【申込締切】']
    const lines = filteredContent.split('\n')

    const firstMetaIndex = lines.findIndex((line) => {
      const trimmed = line.trim()
      if (!trimmed) return false
      return metaLabels.some((label) => trimmed.startsWith(label))
    })

    const descriptionLines =
      firstMetaIndex === -1 ? lines : lines.slice(0, firstMetaIndex)
    const metaLines = firstMetaIndex === -1 ? [] : lines.slice(firstMetaIndex)

    const emphasizeAndConvert = (text: string) => {
      if (!text.trim()) return ''
      let html = text
      metaLabels.forEach((label) => {
        const re = new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
        html = html.replace(re, `<strong>${label}</strong>`)
      })
      return html.replace(/\n/g, '<br />')
    }

    return {
      descriptionHtml: emphasizeAndConvert(descriptionLines.join('\n')),
      metaHtml: emphasizeAndConvert(metaLines.join('\n')),
    }
  }, [filteredContent])

  const eventDateObj = post.eventDate ? new Date(post.eventDate) : null
  const formattedEventDate = eventDateObj
    ? `${eventDateObj.toLocaleDateString('ja-JP')} ${eventDateObj.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}`
    : null

  const handleReaction = async (reaction: string) => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reaction }),
      })

      if (!response.ok) return
      const data = await response.json()
      if (typeof data.likes === 'number') {
        setLikes(data.likes)
      }
      if (data.reactions && typeof data.reactions === 'object') {
        setReactions(data.reactions as Record<string, number>)
      }
    } catch (error) {
      console.error('Error sending reaction:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col gap-3 sm:gap-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <Avatar src={authorAvatar} name={post.author} size="md" />
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4 break-words">
                  {post.title}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
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
            {isRecruitment && canBookmark && (
              <div className="self-start">
                <BookmarkButton
                  postId={post.id}
                  initialBookmarked={initialBookmarked}
                />
              </div>
            )}
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

      {(formattedEventDate || post.location || (isRecruitment && post.subtitle)) && (
        <div className="mb-4 sm:mb-6 space-y-2 text-base sm:text-lg text-gray-700">
          {isRecruitment && post.subtitle && (
            <p className="font-semibold text-primary-700">
              【ミッション】{post.subtitle}
            </p>
          )}
          {formattedEventDate && (
            <p>
              <span className="mr-1">📅</span>
              <span className="mr-2 font-semibold">開催日時</span>
              <span>{formattedEventDate}</span>
            </p>
          )}
          {post.location && (
            <p>
              <span className="mr-1">📍</span>
              <span className="mr-2 font-semibold">開催場所</span>
              <span>{post.location}</span>
            </p>
          )}
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

      {(descriptionHtml || metaHtml) && (
        <div className="max-w-none mb-6 sm:mb-8">
          <h2 className="mb-3 text-base sm:text-lg font-semibold text-gray-800">クエスト内容</h2>
          {descriptionHtml && (
            <p
              className="text-gray-700 leading-relaxed text-base sm:text-lg"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          )}
          {metaHtml && (
            <p
              className="mt-4 text-gray-700 leading-relaxed text-base sm:text-lg"
              dangerouslySetInnerHTML={{ __html: metaHtml }}
            />
          )}
        </div>
      )}

      {isRecruitment && post.styles && post.styles.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2 className="mb-2 text-base sm:text-lg font-semibold text-gray-800">募集要件</h2>
          <div className="flex flex-wrap gap-2">
            {post.styles.map((style) => (
              <span
                key={style}
                className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs sm:text-sm font-semibold text-primary-700"
              >
                {style}
              </span>
            ))}
          </div>
        </div>
      )}

      {post.contact && post.contact.trim() && (
        <div className="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl border border-primary-200 bg-primary-50 p-4 sm:p-6 text-center">
          <p className="text-xs sm:text-sm font-semibold text-primary-700">冒険の始まりはあなたの一歩から！</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <a
              href={post.contact.startsWith('http') ? post.contact : `https://${post.contact}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-primary-600 px-4 py-2 sm:px-6 sm:py-3 text-white text-sm sm:text-base md:text-lg font-semibold shadow hover:bg-primary-700 active:bg-primary-800 transition"
            >
              この冒険に参加する（各団体サイトへ移動）
            </a>
          </div>
        </div>
      )}

      <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b space-y-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {REACTIONS.map((emoji) => {
            const count = reactions[emoji] || 0
            return (
              <button
                key={emoji}
                type="button"
                onClick={() => handleReaction(emoji)}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm sm:text-base text-gray-700 hover:bg-primary-50 hover:text-primary-700 active:scale-95 transition"
              >
                <span className="text-base sm:text-lg">{emoji}</span>
                <span className="text-xs sm:text-sm font-semibold">{count}</span>
              </button>
            )
          })}
        </div>
        <div className="flex items-center justify-between text-sm sm:text-base text-gray-600">
          <span>合計エール数: {likes}</span>
          <span>💬 {post.comments?.length || 0} </span>
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

