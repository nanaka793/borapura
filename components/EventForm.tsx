'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import heic2any from 'heic2any'

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

const MAX_IMAGES = 10

export default function EventForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    categories: [] as string[],
    location: '',
    date: '',
    organizer: '',
    contact: '',
    slots: '',
    cost: '',
    period: '',
    styles: [] as string[],
  })
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [imageErrors, setImageErrors] = useState<Map<number, string>>(new Map())
  const [isConverting, setIsConverting] = useState(false)

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previews])

  // サポートされている画像形式かチェック
  const isSupportedImageType = (file: File): boolean => {
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    const fileName = file.name.toLowerCase()
    
    return supportedTypes.includes(file.type) || 
           supportedExtensions.some(ext => fileName.endsWith(ext))
  }

  // HEIC形式かチェック
  const isHeicFile = (file: File): boolean => {
    const heicTypes = ['image/heic', 'image/heif']
    const fileName = file.name.toLowerCase()
    return heicTypes.includes(file.type) || 
           fileName.endsWith('.heic') || 
           fileName.endsWith('.heif')
  }

  // HEICをJPEGに変換
  const convertHeicToJpeg = async (file: File): Promise<File> => {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.92,
      })
      
      // heic2anyは配列を返す可能性がある
      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
      
      // BlobをFileに変換
      const fileName = file.name.replace(/\.(heic|heif)$/i, '.jpg')
      return new File([blob], fileName, { type: 'image/jpeg' })
    } catch (error) {
      console.error('HEIC conversion error:', error)
      throw new Error('HEIC形式の画像の変換に失敗しました。JPEGまたはPNG形式の画像を使用してください。')
    }
  }

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const availableSlots = Math.max(0, MAX_IMAGES - images.length)
    if (availableSlots === 0) {
      setError('画像は最大10枚までアップロードできます。')
      e.target.value = ''
      return
    }

    setIsConverting(true)
    setError(null)

    try {
      const processedFiles: File[] = []
      const processedPreviews: string[] = []
      const newErrors = new Map<number, string>()

      for (let i = 0; i < Math.min(files.length, availableSlots); i++) {
        const file = files[i]
        const currentIndex = images.length + processedFiles.length

        try {
          // HEIC形式の場合は変換
          let processedFile = file
          if (isHeicFile(file)) {
            processedFile = await convertHeicToJpeg(file)
          }

          // サポートされている形式かチェック
          if (!isSupportedImageType(processedFile)) {
            const fileExtension = file.name.split('.').pop()?.toUpperCase() || '不明'
            newErrors.set(currentIndex, `画像の形式（${fileExtension}）はサポートされていません。JPEG、PNG、WebP、GIF形式の画像を使用してください。`)
            continue
          }

          processedFiles.push(processedFile)
          processedPreviews.push(URL.createObjectURL(processedFile))
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '画像の処理に失敗しました。'
          newErrors.set(currentIndex, errorMessage)
        }
      }

      // エラーがある場合は表示
      if (newErrors.size > 0) {
        const errorMessages = Array.from(newErrors.values())
        setError(errorMessages[0]) // 最初のエラーメッセージを表示
      }

      // 成功したファイルのみ追加
      if (processedFiles.length > 0) {
        setImages((prev) => [...prev, ...processedFiles])
        setPreviews((prev) => [...prev, ...processedPreviews])
        setImageErrors((prev) => {
          const updated = new Map(prev)
          newErrors.forEach((value, key) => updated.set(key, value))
          return updated
        })
      }

      if (files.length > availableSlots) {
        setError('画像は最大10枚までアップロードできます。')
      }
    } catch (error) {
      console.error('File processing error:', error)
      setError('画像の処理中にエラーが発生しました。')
    } finally {
      setIsConverting(false)
      e.target.value = ''
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index))
    URL.revokeObjectURL(previews[index])
    setPreviews((prev) => prev.filter((_, idx) => idx !== index))
    const nextErrors = new Map(imageErrors)
    nextErrors.delete(index)
    // インデックスを再調整
    const reindexedErrors = new Map<number, string>()
    nextErrors.forEach((value, key) => {
      if (key > index) {
        reindexedErrors.set(key - 1, value)
      } else {
        reindexedErrors.set(key, value)
      }
    })
    setImageErrors(reindexedErrors)
  }

  const toggleStyle = (value: string) => {
    setFormData((prev) => {
      const exists = prev.styles.includes(value)
      return {
        ...prev,
        styles: exists ? prev.styles.filter((v) => v !== value) : [...prev.styles, value],
      }
    })
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
    
    // 画像エラーがある場合は投稿をブロック
    if (imageErrors.size > 0) {
      setError('画像にエラーがあります。エラーのある画像を削除してから再度お試しください。')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formPayload = new FormData()
      formPayload.set('title', formData.title)
      if (formData.subtitle) {
        formPayload.set('subtitle', formData.subtitle)
      }
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
      if (formData.styles.length > 0) {
        formPayload.set('styles', JSON.stringify(formData.styles))
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
    <>
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
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          参加者へのミッション！（サブタイトル）
        </label>
        <input
          type="text"
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          placeholder="例: 海の自然と生き物を守るヒーローに！"
        />
        <p className="mt-1 text-xs text-gray-500">
          このイベントを盛り上げるために、ボランティアへのミッションを一言で伝えてください。
        </p>
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
          placeholder="詳しい活動内容や団体の想いを記述してください（参加条件は以下に記述欄があります）"
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
          <label className="mb-2 block text-sm font-semibold text-gray-700">申込・問い合わせ先 *</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            placeholder="SNSやホームページ、応募フォームのURL"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          写真（最大10枚）
        </label>
        {isConverting && (
          <p className="mb-2 text-sm text-gray-600">画像を変換中...</p>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={isConverting}
          onChange={handleImageChange}
          className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {images.length > 0 && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {images.map((file, index) => {
              const hasError = imageErrors.has(index)
              return (
                <div 
                  key={file.name + index} 
                  className={`rounded-xl border p-3 ${
                    hasError ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <p className={`truncate text-xs ${hasError ? 'text-red-600' : 'text-gray-500'}`}>
                    {file.name}
                  </p>
                  {hasError && (
                    <div className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded">
                      {imageErrors.get(index)}
                    </div>
                  )}
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
              )
            })}
          </div>
        )}
      </div>

      {/* 冒険スタイル（任意のマルチセレクト） */}
      <div className="space-y-4">
        <p className="mb-1 text-sm font-semibold text-gray-700">募集要件（任意・複数選択可）</p>

        <div>
          <p className="mb-2 text-sm font-semibold text-gray-700">【1】冒険者プロフィール</p>
          <div className="flex flex-wrap gap-2">
            {['未経験歓迎', '事前研修あり', '学生歓迎', '社会人歓迎', '友人同士の参加可'].map((label) => {
              const selected = formData.styles.includes(label)
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleStyle(label)}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${
                    selected
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-gray-700">【2】クエスト参加スタイル</p>
          <div className="flex flex-wrap gap-2">
            {['継続参加歓迎', 'フル参加必須', '途中参加・途中退出可', 'オンライン参加可'].map((label) => {
              const selected = formData.styles.includes(label)
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleStyle(label)}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${
                    selected
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-gray-700">【3】冒険フィールド情報</p>
          <div className="flex flex-wrap gap-2">
            {['室内活動', '屋外活動'].map((label) => {
              const selected = formData.styles.includes(label)
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleStyle(label)}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${
                    selected
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-gray-700">【4】冒険の証・決まりごと</p>
          <div className="flex flex-wrap gap-2">
            {['ボランティア証明書発行', '服装自由', '雨天決行', '雨天中止・相談'].map((label) => {
              const selected = formData.styles.includes(label)
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleStyle(label)}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${
                    selected
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <p className="text-xs text-gray-500">
          ※ すべて任意です。参加者にイメージしてほしいスタイルだけ選んでください。
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-primary-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-primary-700 disabled:opacity-50"
      >
        {loading ? '投稿中...' : '募集を登録する'}
      </button>
    </form>

    {loading && (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
        <div className="mx-4 max-w-sm rounded-2xl bg-white px-6 py-5 text-center shadow-xl">
          <div className="mb-3 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          </div>
          <p className="text-base font-semibold text-gray-800">投稿中…</p>
          <p className="mt-2 text-xs text-gray-500">
            画面はこのままお待ちください。画像枚数が多いと時間がかかる場合があります。
          </p>
        </div>
      </div>
    )}
  </>
  )
}

