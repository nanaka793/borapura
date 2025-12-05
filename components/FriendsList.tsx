'use client'

import { useState } from 'react'
import Avatar from './Avatar'
import type { User } from '@/lib/types'

interface FriendsListProps {
  friends: User[]
}

export default function FriendsList({ friends }: FriendsListProps) {
  const [showAll, setShowAll] = useState(false)
  const visibleFriends = showAll ? friends : friends.slice(0, 3)

  if (friends.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {visibleFriends.map((friend) => (
        <a
          key={friend.id}
          href={`/users/${friend.id}`}
          className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm hover:border-primary-200 hover:bg-primary-50 transition"
        >
          <Avatar src={friend.avatar} name={friend.name} size="sm" />
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{friend.name}</p>
            {friend.headline && (
              <p className="text-xs text-gray-500 line-clamp-1">{friend.headline}</p>
            )}
          </div>
        </a>
      ))}

      {friends.length > 3 && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="mt-1 text-xs font-semibold text-primary-700 hover:underline"
        >
          {showAll ? '閉じる' : `すべて見る（${friends.length}人）`}
        </button>
      )}
    </div>
  )
}



