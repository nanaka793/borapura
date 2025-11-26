'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORY_OPTIONS = [
  '教育',
  '子ども',
  '国際協力',
  '環境保護',
  '福祉',
  '災害支援',
  '地域活動',
  '医療・健康',
  'スポーツ',
  '文化',
  'イベント',
  'その他',
]

const MAX_IMAGES = 5

export default function EventForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categories: [] as string[],
    location: '',
    date: '',
    organizer: '',
    contact: '',
    slots: '',
    cost: '',
    period: '',
  })
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previews])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const toggleCategory = (option: string) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(option)
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((item) => item !== option)
          : [...prev.categories, option],
      }
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const availableSlots = Math.max(0, MAX_IMAGES - images.length)
    if (availableSlots === 0) {
      setError('画像は最大5枚までアップロードできます。')
      e.target.value = ''
      return
    }

    const usableFiles = files.slice(0, availableSlots)
    const newPreviews = usableFiles.map((file) => URL.createObjectURL(file))

    setImages((prev) => [...prev, ...usableFiles])
    setPreviews((prev) => [...prev, ...newPreviews])

    if (files.length > usableFiles.length) {
      setError('画像は最大5枚までアップロードできます。')
    } else {
      setError(null)
    }

    e.target.value = ''
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index))
    URL.revokeObjectURL(previews[index])
    setPreviews((prev) => prev.filter((_, idx) => idx !== index))
  }

  const composeContent = () => {
    const info: string[] = []
    if (formData.date) {
      info.push(`【開催日時】${new Date(formData.date).toLocaleString('ja-JP')}`)
    }
    if (formData.location) {
      info.push(`【開催場所】${formData.location}`)
    }
    if (formData.organizer) {
      info.push(`【主催】${formData.organizer}`)
    }
    if (formData.contact) {
      info.push(`【連絡先】${formData.contact}`)
    }
    if (formData.slots) {
      info.push(`【募集人数】${formData.slots}名`)
    }
    if (formData.cost) {
      info.push(`【参加費】${formData.cost}`)
    }
    if (formData.period) {
      info.push(
        `【申込締切】${new Date(formData.period).toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`
      )
    }
    if (formData.period) {
      info.push(
        `【申込締切】${new Date(formData.period).toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`
      )
    }

    return [formData.description, '', ...info].filter(Boolean).join('\n')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formPayload = new FormData()
      formPayload.set('title', formData.title)
      formPayload.set('content', composeContent())
      if (formData.date) {
        formPayload.set('eventDate', formData.date)
      }
      if (formData.categories.length > 0) {
        formPayload.set('category', formData.categories[0])
        formPayload.set('tags', JSON.stringify(formData.categories))
      }
      formPayload.set('location', formData.location)
      formPayload.set('organization', formData.organizer)
      formPayload.set('type', '募集投稿')
      formPayload.set('contact', formData.contact)
      formPayload.set('cost', formData.cost)
      if (formData.period) {
        formPayload.set('period', formData.period)
      }
      images.forEach((file) => {
        formPayload.append('images', file)
      })

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formPayload,
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: '投稿に失敗しました' }))
        throw new Error(data.error || '投稿に失敗しました')
      }

      router.push('/events')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : '投稿に失敗しました'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">イベント名 *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          placeholder="例: 海岸清掃キャラバン"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">詳細 *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
          className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          placeholder="活動内容や参加条件などを記載してください"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          カテゴリー（複数選択可）
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((option) => {
            const selected = formData.categories.includes(option)
            return (
              <button
                type="button"
                key={option}
                onClick={() => toggleCategory(option)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  selected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-primary-200'
                }`}
              >
                {option}
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          ボタンをタップすると選択、再度タップすると解除できます。
        </p>
        <div className="mt-4">
          <label className="mb-2 block text-sm font-semibold text-gray-700">開催場所 *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            placeholder="例: 神奈川県鎌倉市 由比ヶ浜海岸"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">開催日時 *</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">申込締切</label>
            <input
              type="date"
              name="period"
              value={formData.period}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">募集人数</label>
            <input
              type="number"
              name="slots"
              value={formData.slots}
              onChange={handleChange}
              min={0}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              placeholder="例: 20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">参加費</label>
            <input
              type="text"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              placeholder="例: 無料 / 500円 / 実費のみ"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">主催団体 *</label>
          <input
            type="text"
            name="organizer"
            value={formData.organizer}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">連絡先 *</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            placeholder="メールアドレスやURLなど"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          写真（JPG/PNG, 最大5枚）
        </label>
        <input
          type="file"
          accept="image/png,image/jpeg"
          multiple
          onChange={handleImageChange}
          className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
        />
        {images.length > 0 && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {images.map((file, index) => (
              <div key={file.name + index} className="rounded-xl border border-gray-200 p-3">
                <p className="truncate text-xs text-gray-500">{file.name}</p>
                {previews[index] && (
                  <div className="mt-2 overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previews[index]}
                      alt={`${file.name} preview`}
                      className="h-32 w-full object-cover"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="mt-2 text-xs font-semibold text-red-500 hover:underline"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-primary-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-primary-700 disabled:opacity-50"
      >
        {loading ? '投稿中...' : '募集を登録する'}
      </button>
    </form>
  )
}

