'use client'

import { useState } from 'react'
import { Comment } from '@/lib/types'

interface CommentSectionProps {
  postId: string
  comments: Comment[]
}

export default function CommentSection({ postId, comments: initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState(() => normalizeComments(initialComments))
  const [newComment, setNewComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [loading, setLoading] = useState(false)
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null)
  const [replyAuthor, setReplyAuthor] = useState('')
  const [replyContent, setReplyContent] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)
  const [likeLoadingId, setLikeLoadingId] = useState<string | null>(null)

  const postComment = async (payload: { content: string; author: string; parentId?: string }) => {
    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error('コメントの投稿に失敗しました')
    }

    const comment: Comment = await response.json()
    return {
      ...comment,
      replies: comment.replies || [],
    }
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
      setComments((prev) => [...prev, comment])
      setNewComment('')
      setAuthorName('')
    } catch (error) {
      console.error('Error posting comment:', error)
      alert('コメントの投稿に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleReplySubmit = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault()
    if (!replyAuthor.trim() || !replyContent.trim()) {
      alert('お名前とコメントを入力してください')
      return
    }
    setReplyLoading(true)
    try {
      const reply = await postComment({
        author: replyAuthor,
        content: replyContent,
        parentId,
      })
      setComments((prev) => addReply(prev, parentId, reply))
      setReplyTargetId(null)
      setReplyAuthor('')
      setReplyContent('')
    } catch (error) {
      console.error('Error posting reply:', error)
      alert('返信の投稿に失敗しました')
    } finally {
      setReplyLoading(false)
    }
  }

  const handleCommentLike = async (commentId: string) => {
    try {
      setLikeLoadingId(commentId)
      const response = await fetch(
        `/api/posts/${postId}/comments/${commentId}/like`,
        { method: 'POST' }
      )

      if (!response.ok) {
        throw new Error('like failed')
      }

      const data = await response.json()
      setComments((prev) => updateCommentLikes(prev, commentId, data.likes))
    } catch (error) {
      console.error('Error liking comment:', error)
      alert('コメントへのいいねに失敗しました')
    } finally {
      setLikeLoadingId(null)
    }
  }

  const renderComments = (list: Comment[], depth = 0) =>
    list.map((comment) => (
      <div
        key={comment.id}
        className={`rounded-lg p-4 border ${
          depth > 0 ? 'mt-4 border-primary-100 bg-white' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <span className="font-semibold text-primary-600">{comment.author}</span>
          <span className="text-sm text-gray-500">
            {new Date(comment.createdAt).toLocaleString('ja-JP')}
          </span>
        </div>
        <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => handleCommentLike(comment.id)}
            disabled={likeLoadingId === comment.id}
            className="flex items-center gap-1 text-sm font-semibold text-rose-500 hover:text-rose-600 disabled:opacity-50"
          >
            <span>{likeLoadingId === comment.id ? '💗' : '♡'}</span>
            <span>{comment.likes ?? 0}</span>
          </button>
          {depth < 2 && (
            <button
              type="button"
              onClick={() =>
                setReplyTargetId((current) => (current === comment.id ? null : comment.id))
              }
              className="text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              {replyTargetId === comment.id ? '返信フォームを閉じる' : '返信する'}
            </button>
          )}
        </div>

        {depth < 2 && replyTargetId === comment.id && (
          <form
            onSubmit={(e) => handleReplySubmit(e, comment.id)}
            className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3"
          >
            <input
              type="text"
              placeholder="お名前"
              value={replyAuthor}
              onChange={(e) => setReplyAuthor(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
            <textarea
              placeholder="返信を入力..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={replyLoading}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {replyLoading ? '送信中...' : '返信を投稿'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setReplyTargetId(null)
                  setReplyAuthor('')
                  setReplyContent('')
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                キャンセル
              </button>
            </div>
          </form>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">{renderComments(comment.replies, depth + 1)}</div>
        )}
      </div>
    ))

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-6">冒険者の声</h3>

      <form onSubmit={handleSubmit} className="mb-8">
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

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            まだコメントがありません。最初のコメントを投稿してみましょう！
          </p>
        ) : (
          renderComments(comments)
        )}
      </div>
    </div>
  )
}

function normalizeComments(list: Comment[]): Comment[] {
  return list.map((comment) => ({
    ...comment,
    replies: comment.replies ? normalizeComments(comment.replies) : [],
  }))
}

function addReply(comments: Comment[], parentId: string, reply: Comment): Comment[] {
  let added = false

  const visit = (list: Comment[]): Comment[] =>
    list.map((comment) => {
      if (comment.id === parentId) {
        added = true
        const replies = [...(comment.replies || []), reply]
        return { ...comment, replies }
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: visit(comment.replies),
        }
      }
      return comment
    })

  const updated = visit(comments)
  return added ? updated : comments
}

function updateCommentLikes(comments: Comment[], commentId: string, likes: number): Comment[] {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      return { ...comment, likes }
    }
    if (comment.replies && comment.replies.length > 0) {
      return { ...comment, replies: updateCommentLikes(comment.replies, commentId, likes) }
    }
    return comment
  })
}