'use client'

import { useState } from 'react'

interface BookmarkButtonProps {
  postId: string
  initialBookmarked: boolean
}

export default function BookmarkButton({ postId, initialBookmarked }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    if (loading) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          action: bookmarked ? 'remove' : 'add',
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'ブックマークに失敗しました。')
      }

      setBookmarked(!bookmarked)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ブックマークに失敗しました。'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition ${
          bookmarked
            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            : 'bg-white text-amber-700 border border-amber-300 hover:bg-amber-50'
        } disabled:opacity-60`}
      >
        <span>{bookmarked ? '保存済み' : '投稿を保存'}</span>
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}


