'use client'

import { useMemo, useState } from 'react'
import type { Post } from '@/lib/types'
import PostGalleryCard from './PostGalleryCard'
import TagFilterBar from './TagFilterBar'

type ActivityPostWithAvatar = Post & { authorAvatar?: string }

interface ActivityPostsSectionProps {
  posts: ActivityPostWithAvatar[]
}

export default function ActivityPostsSection({ posts }: ActivityPostsSectionProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach((post) => {
      post.tags?.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b, 'ja'))
  }, [posts])

  const filteredPosts =
    selectedTag === null ? posts : posts.filter((post) => post.tags?.includes(selectedTag))

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag((prev) => (prev === tag ? null : tag))
  }

  return (
    <div className="space-y-6">
      <TagFilterBar tags={availableTags} selectedTag={selectedTag} onSelect={handleTagSelect} />
      {filteredPosts.length === 0 ? (
        <div className="rounded-3xl bg-white/70 p-10 text-center shadow-inner">
          <p className="text-gray-500">このタグの冒険日誌はまだありません。</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostGalleryCard
              key={post.id}
              post={post}
              authorAvatar={post.authorAvatar}
              showTypeBadge={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}


