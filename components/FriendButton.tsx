'use client'

import { useState } from 'react'

interface FriendButtonProps {
  currentUserId: string
  targetUserId: string
  initialIsFriend: boolean
}

export default function FriendButton({
  currentUserId,
  targetUserId,
  initialIsFriend,
}: FriendButtonProps) {
  const [isFriend, setIsFriend] = useState(initialIsFriend)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    if (loading) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUserId,
          action: isFriend ? 'remove' : 'add',
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || '更新に失敗しました。')
      }

      setIsFriend(!isFriend)
    } catch (err) {
      const message = err instanceof Error ? err.message : '更新に失敗しました。'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (currentUserId === targetUserId) {
    return null
  }

  return (
    <div className="mt-4 flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition ${
          isFriend
            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            : 'bg-primary-600 text-white hover:bg-primary-700'
        } disabled:opacity-60`}
      >
        {isFriend ? '旅の仲間リストから外す' : '旅の仲間リストに加える'}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}




