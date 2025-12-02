'use client'

import { useMemo, useState } from 'react'
import UserCard from './UserCard'

interface UserSummary {
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

interface UserDirectoryProps {
  users: UserSummary[]
}

export default function UserDirectory({ users }: UserDirectoryProps) {
  const [keyword, setKeyword] = useState('')

  const filteredUsers = useMemo(() => {
    const normalized = keyword.trim().toLowerCase()
    if (!normalized) {
      return users
    }
    return users.filter((user) => user.name.toLowerCase().includes(normalized))
  }, [keyword, users])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <label className="block text-sm font-semibold text-gray-600" htmlFor="user-search-input">
          ユーザー名で検索
        </label>
        <div className="mt-2 flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 focus-within:ring-2 focus-within:ring-primary-200">
          <span className="text-gray-400">🔍</span>
          <input
            id="user-search-input"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="例: 佐藤 / sato"
            className="ml-3 w-full bg-transparent text-base text-gray-700 placeholder:text-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-inner">
          該当するユーザーが見つかりませんでした。
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              id={user.id}
              name={user.name}
              avatar={user.avatar}
              headline={user.headline}
              location={user.location}
              interests={user.interests}
              website={user.website}
              postCount={user.postCount}
              badge={user.badge}
              badges={user.badges}
            />
          ))}
        </div>
      )}
    </div>
  )
}



