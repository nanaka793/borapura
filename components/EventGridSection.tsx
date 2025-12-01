'use client'

import { useMemo, useState } from 'react'
import type { Post } from '@/lib/types'
import EventCard from './EventCard'
import TagFilterBar from './TagFilterBar'

interface EventGridSectionProps {
  posts: Post[]
}

export default function EventGridSection({ posts }: EventGridSectionProps) {
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
  }, [posts, selectedTag, selectedStyles])

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
        <div className="mb-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedStyles([])}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              selectedStyles.length === 0
                ? 'border-primary-600 bg-primary-600 text-white shadow'
                : 'border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:text-primary-700'
            }`}
          >
            募集要件指定なし
          </button>
          {availableStyles.map((style) => {
            const isActive = selectedStyles.includes(style)
            return (
              <button
                key={style}
                type="button"
                onClick={() => handleStyleToggle(style)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:text-primary-700'
                }`}
              >
                {style}
              </button>
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



