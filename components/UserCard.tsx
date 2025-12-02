'use client'

import { useRouter } from 'next/navigation'
import Avatar from './Avatar'

interface UserCardProps {
  id: string
  name: string
  avatar?: string
  headline?: string
  location?: string
  interests: string[]
  website?: string
  postCount: number
  badge?: string
  badges?: string[]
}

export default function UserCard({
  id,
  name,
  avatar,
  headline,
  location,
  interests,
  website,
  postCount,
  badge,
  badges,
}: UserCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/users/${id}`)
  }

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (website) {
      window.open(website, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      onClick={handleCardClick}
      className="block bg-white rounded-2xl shadow-md p-6 hover:-translate-y-1 hover:shadow-xl transition cursor-pointer"
    >
      <div className="flex items-center gap-4 mb-4">
        <Avatar src={avatar} name={name} size="md" />
        <div>
          <h3 className="text-2xl font-bold text-primary-600">{name}</h3>
          {location && <p className="text-sm text-gray-500">📍 {location}</p>}
        </div>
      </div>
      {headline && <p className="text-gray-600 mb-2">{headline}</p>}
      <p className="text-sm text-gray-500 mb-4">投稿数: {postCount}件</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {interests.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700"
          >
            #{tag}
          </span>
        ))}
        {interests.length > 3 && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
            +{interests.length - 3}
          </span>
        )}
      </div>
      {website && (
        <div className="mb-4">
          <button
            type="button"
            onClick={handleWebsiteClick}
            className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 hover:underline"
          >
            <span>🔗</span>
            <span className="truncate max-w-[200px]">Webサイト</span>
          </button>
        </div>
      )}
      <div className="text-primary-600 hover:text-primary-700 font-semibold">
        プロフィールを見る →
      </div>
    </div>
  )
}

