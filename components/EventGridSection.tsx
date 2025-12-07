'use client'

import { useMemo, useState } from 'react'
import type { Post } from '@/lib/types'
import EventCard from './EventCard'
import TagFilterBar from './TagFilterBar'

interface EventGridSectionProps {
  posts: Post[]
  showActiveOnly?: boolean
}

export default function EventGridSection({ posts, showActiveOnly = false }: EventGridSectionProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach((post) => {
      post.tags?.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b, 'ja'))
  }, [posts])

  const availableStyles = useMemo(() => {
    const styleSet = new Set<string>()
    posts.forEach((post) => {
      post.styles?.forEach((style) => styleSet.add(style))
    })
    return Array.from(styleSet).sort((a, b) => a.localeCompare(b, 'ja'))
  }, [posts])

  const filteredPosts = useMemo(() => {
    let result = posts
    
    // 募集中のみフィルター
    if (showActiveOnly) {
      const now = new Date()
      now.setHours(0, 0, 0, 0) // 時刻を00:00:00にリセット
      result = result.filter((post) => {
        if (!post.period) return false // periodがない場合は除外
        const deadline = new Date(post.period)
        deadline.setHours(0, 0, 0, 0) // 時刻を00:00:00にリセット
        return deadline >= now // 締め切り日が今日以降
      })
    }
    
    if (selectedTag !== null) {
      result = result.filter((post) => post.tags?.includes(selectedTag))
    }
    if (selectedStyles.length > 0) {
      result = result.filter((post) => {
        const styles = post.styles ?? []
        return selectedStyles.every((style) => styles.includes(style))
      })
    }
    return result
  }, [posts, selectedTag, selectedStyles, showActiveOnly])

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag((prev) => (prev === tag ? null : tag))
  }

  const handleStyleToggle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    )
  }

  return (
    <div className="space-y-6">
      <TagFilterBar tags={availableTags} selectedTag={selectedTag} onSelect={handleTagSelect} />

      {availableStyles.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedStyles.length === 0}
              onChange={() => setSelectedStyles([])}
              className="sr-only"
            />
            <div
              className={`flex items-center justify-center w-5 h-5 rounded border-2 transition ${
                selectedStyles.length === 0
                  ? 'bg-primary-600 border-primary-600'
                  : 'bg-white border-gray-300'
              }`}
            >
              {selectedStyles.length === 0 && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`text-sm font-semibold ${
              selectedStyles.length === 0 ? 'text-primary-600' : 'text-gray-600'
            }`}>
              募集要件指定なし
            </span>
          </label>
          {availableStyles.map((style) => {
            const isActive = selectedStyles.includes(style)
            return (
              <label key={style} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => handleStyleToggle(style)}
                  className="sr-only"
                />
                <div
                  className={`flex items-center justify-center w-5 h-5 rounded border-2 transition ${
                    isActive
                      ? 'bg-primary-600 border-primary-600'
                      : 'bg-white border-gray-300 hover:border-primary-400'
                  }`}
                >
                  {isActive && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  isActive ? 'text-primary-700' : 'text-gray-600'
                }`}>
                  {style}
                </span>
              </label>
            )
          })}
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="rounded-3xl bg-white/70 p-10 text-center shadow-inner">
          <p className="text-gray-500">このタグの募集情報はまだありません。</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post) => (
            <EventCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}



