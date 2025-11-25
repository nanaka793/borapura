'use client'

import { useEffect, useState } from 'react'
import type { User } from '@/lib/types'
import Avatar from './Avatar'

type SafeUser = Omit<User, 'passwordHash'>

interface ProfileFormProps {
  user: SafeUser
  onUpdated?: (user: SafeUser) => void
}

const INTEREST_OPTIONS = [
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
]

export default function ProfileForm({ user, onUpdated }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    headline: user.headline || '',
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
    interests: user.interests || [],
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || '')
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData((prev) => {
      const current = prev.interests || []
      if (checked) {
        return { ...prev, interests: [...current, interest] }
      } else {
        return { ...prev, interests: current.filter((i) => i !== interest) }
      }
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setAvatarFile(file)
    if (file) {
      setAvatarPreview(URL.createObjectURL(file))
    } else {
      setAvatarPreview(user.avatar || '')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const formPayload = new FormData()
      formPayload.set('name', formData.name)
      formPayload.set('headline', formData.headline)
      formPayload.set('bio', formData.bio)
      formPayload.set('location', formData.location)
      formPayload.set('website', formData.website)
      formPayload.set('interests', JSON.stringify(formData.interests || []))
      if (avatarFile) {
        formPayload.set('avatar', avatarFile)
      } else if (avatarPreview && avatarPreview === user.avatar) {
        formPayload.set('avatar', avatarPreview)
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        body: formPayload,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'プロフィールの更新に失敗しました。')
      }

      const data = await response.json()
      setMessage('プロフィールを更新しました。')
      onUpdated?.(data.user)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'エラーが発生しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          表示名
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          一言メッセージ
        </label>
        <input
          type="text"
          name="headline"
          value={formData.headline}
          onChange={handleChange}
          placeholder="例: “週末は子ども食堂をサポートしています”"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          自己紹介
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          アイコン画像アップロード
        </label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
        />
        <p className="mt-1 text-xs text-gray-500">
          JPG/PNG/WebP 形式、2MB 以下を推奨
        </p>
        <div className="mt-3 flex items-center gap-3">
          <Avatar src={avatarPreview} name={formData.name || 'ボランティア'} size="lg" />
          {avatarPreview && (
            <button
              type="button"
              onClick={() => {
                setAvatarFile(null)
                setAvatarPreview('')
              }}
              className="text-sm font-semibold text-gray-500 hover:text-gray-700"
            >
              クリア
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            活動エリア
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="例: 東京都内 / オンライン"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Webサイト / SNS
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          関心テーマ（複数選択可）
        </label>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {INTEREST_OPTIONS.map((option) => {
            const isChecked = (formData.interests || []).includes(option)
            return (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 hover:border-primary-300 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => handleInterestChange(option, e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            )
          })}
        </div>
        {formData.interests && formData.interests.length > 0 && (
          <p className="mt-2 text-xs text-gray-500">
            選択中: {formData.interests.join(', ')}
          </p>
        )}
      </div>

      {message && (
        <div className="rounded-lg bg-primary-50 px-4 py-2 text-sm text-primary-700">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary-600 py-3 font-semibold text-white shadow-lg transition hover:bg-primary-700 disabled:opacity-60"
      >
        {loading ? '更新中…' : 'プロフィールを更新'}
      </button>
    </form>
  )
}

