'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface PostFormProps {
  currentUser: {
    id: string
    name: string
  }
}

export default function PostForm({ currentUser }: PostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const MAX_IMAGES = 10
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    location: '',
  })
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imagePreviews])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formPayload = new FormData()
      formPayload.set('title', formData.title)
      formPayload.set('content', formData.content)
      formPayload.set('category', formData.category)
      formPayload.set('location', formData.location)
      images.forEach((file) => {
        formPayload.append('images', file)
      })

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formPayload,
      })

      if (response.ok) {
        router.push('/')
        router.refresh()
      } else {
        const data = await response.json().catch(() => ({ error: '投稿に失敗しました' }))
        setError(data.error || '投稿に失敗しました')
        console.error('Post error:', data)
      }
    } catch (error) {
      console.error('Error:', error)
      setError('ネットワークエラーが発生しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
      <div className="mb-6 rounded-2xl bg-primary-50 px-4 py-3 text-primary-700">
        {currentUser.name} として投稿します
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
          タイトル *
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="活動のタイトルを入力"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
          カテゴリー
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">選択してください</option>
          <option value="教育">教育</option>
          <option value="子ども">子ども</option>
          <option value="国際協力">国際協力</option>
          <option value="環境保護">環境保護</option>
          <option value="福祉">福祉</option>
          <option value="災害支援">災害支援</option>
          <option value="地域活動">地域活動</option>
          <option value="医療・健康">医療・健康</option>
          <option value="スポーツ">スポーツ</option>
          <option value="文化">文化</option>
          <option value="イベント">イベント</option>
          <option value="その他">その他</option>
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
          活動場所
        </label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="例: 東京都渋谷区"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
          活動内容 *
        </label>
        <textarea
          id="content"
          required
          rows={10}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="活動の詳細を記入してください..."
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          活動写真（最大10枚）
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files || [])
            if (selectedFiles.length === 0) return

            const availableSlots = Math.max(0, MAX_IMAGES - images.length)
            if (availableSlots === 0) {
              setError('画像は最大10枚までアップロードできます。')
              e.target.value = ''
              return
            }

            const usableFiles = selectedFiles.slice(0, availableSlots)
            const newPreviews = usableFiles.map((file) => URL.createObjectURL(file))

            setImages((prev) => [...prev, ...usableFiles])
            setImagePreviews((prev) => [...prev, ...newPreviews])

            if (selectedFiles.length > usableFiles.length) {
              setError('画像は最大10枚までアップロードできます。')
            } else {
              setError(null)
            }

            e.target.value = ''
          }}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
        />
        {images.length > 0 && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {images.map((file, index) => (
              <div key={index} className="relative rounded-lg border border-gray-200 p-3">
                <div className="text-xs text-gray-500 break-all mb-2">{file.name}</div>
                {imagePreviews[index] && (
                  <div className="overflow-hidden rounded-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreviews[index]}
                      alt={`${file.name} preview`}
                      className="h-32 w-full object-cover"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const nextImages = images.filter((_, idx) => idx !== index)
                    const nextPreviews = imagePreviews.filter((_, idx) => idx !== index)
                    URL.revokeObjectURL(imagePreviews[index])
                    setImages(nextImages)
                    setImagePreviews(nextPreviews)
                  }}
                  className="mt-2 text-xs font-semibold text-red-500 hover:underline"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '投稿中...' : '投稿する'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}

