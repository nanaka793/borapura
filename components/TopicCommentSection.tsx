'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TopicComment } from '@/lib/types'
import Avatar from './Avatar'

interface TopicCommentSectionProps {
  topicId: string
  initialComments: TopicComment[]
}

export default function TopicCommentSection({
  topicId,
  initialComments,
}: TopicCommentSectionProps) {
  const router = useRouter()
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [loading, setLoading] = useState(false)
  const [likeLoadingId, setLikeLoadingId] = useState<string | null>(null)

  // initialCommentsが変更されたら状態を更新
  useEffect(() => {
    setComments(initialComments)
  }, [initialComments])

  const postComment = async (payload: { content: string; author: string }) => {
    const response = await fetch(`/api/topics/${topicId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'コメントの投稿に失敗しました')
    }

    return await response.json()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !authorName.trim()) {
      alert('お名前とコメントを入力してください')
      return
    }

    setLoading(true)
    try {
      const comment = await postComment({
        content: newComment,
        author: authorName,
      })
      // 新しいコメントを追加
      setComments((prev) => [...prev, comment])
      setNewComment('')
      setAuthorName('')
      // ページを再読み込みして最新のコメントを取得
      router.refresh()
    } catch (error: any) {
      console.error('Error posting comment:', error)
      alert(error.message || 'コメントの投稿に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleCommentLike = async (commentId: string) => {
    try {
      setLikeLoadingId(commentId)
      const response = await fetch(
        `/api/topics/${topicId}/comments/${commentId}/like`,
        { method: 'POST' }
      )

      if (!response.ok) {
        throw new Error('like failed')
      }

      const data = await response.json()
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, likes: data.likes } : comment
        )
      )
    } catch (error) {
      console.error('Error liking comment:', error)
      alert('コメントへのいいねに失敗しました')
    } finally {
      setLikeLoadingId(null)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 rounded-lg p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="お名前"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="コメントを入力..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {loading ? '投稿中...' : 'コメントを投稿'}
        </button>
      </form>

      <h3 className="text-2xl font-bold text-gray-800 mb-6">みんなの声</h3>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8 bg-white rounded-lg">
            まだコメントがありません。最初のコメントを投稿してみましょう！
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar
                    src={undefined}
                    name={comment.author}
                    size="sm"
                  />
                  <span className="font-semibold text-primary-600">
                    {comment.author}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleString('ja-JP')}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap mb-3">
                {comment.content}
              </p>
              <button
                type="button"
                onClick={() => handleCommentLike(comment.id)}
                disabled={likeLoadingId === comment.id}
                className="flex items-center gap-1 text-sm font-semibold text-rose-500 hover:text-rose-600 disabled:opacity-50"
              >
                <span>{likeLoadingId === comment.id ? '💗' : '♡'}</span>
                <span>{comment.likes ?? 0}</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

