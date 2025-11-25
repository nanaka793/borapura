'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface AuthFormProps {
  mode: 'login' | 'register'
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login'
      const payload =
        mode === 'register'
          ? formData
          : { email: formData.email, password: formData.password }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'エラーが発生しました。')
      }

      const next = searchParams.get('next') || '/mypage'
      router.push(next)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {mode === 'register' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">お名前</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary-200"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          メールアドレス
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary-200"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          パスワード
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary-200"
        />
      </div>
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary-600 py-3 font-semibold text-white shadow-lg hover:bg-primary-700 disabled:opacity-70"
      >
        {loading
          ? '送信中...'
          : mode === 'register'
          ? 'アカウントを作成'
          : 'ログイン'}
      </button>
    </form>
  )
}

