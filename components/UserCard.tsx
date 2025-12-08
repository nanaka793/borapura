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
  themeColor?: string
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
  themeColor,
}: UserCardProps) {
  const defaultThemeColor = themeColor || '#626262'
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
          <h3 className="text-2xl font-bold" style={{ color: defaultThemeColor }}>{name}</h3>
          {location && <p className="text-sm text-gray-500">📍 {location}</p>}
        </div>
      </div>
      {headline && <p className="text-gray-600 mb-2">{headline}</p>}
      <p className="text-sm text-gray-500 mb-4">
        <span className="font-semibold" style={{ color: defaultThemeColor }}>Lv : {postCount}</span>
        <span className="text-gray-400 ml-2">(投稿数{postCount}件)</span>
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {interests.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full px-3 py-1 text-sm font-medium"
            style={{ backgroundColor: `${defaultThemeColor}15`, color: defaultThemeColor }}
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
            className="inline-flex items-center gap-1 text-sm hover:underline"
            style={{ color: defaultThemeColor }}
          >
            <span>🔗</span>
            <span className="truncate max-w-[200px]">Webサイト</span>
          </button>
        </div>
      )}
      <div className="font-semibold" style={{ color: defaultThemeColor }}>
        プロフィールを見る →
      </div>
    </div>
  )
}

