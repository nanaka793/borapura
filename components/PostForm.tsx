'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdventureSlider from './AdventureSlider'
import heic2any from 'heic2any'

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
    organization: '',
    questStyle: 3, // デフォルトは中央（3 = ふつう）
    emotionMeter: 3, // デフォルトは中央（3 = ふつう）
    growthDiscovery: '', // 自分の成長発見
    finalBoss: '', // 今日のラスボス
  })
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageErrors, setImageErrors] = useState<Map<number, string>>(new Map())
  const [isConverting, setIsConverting] = useState(false)

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imagePreviews])

  // サポートされている画像形式かチェック（HEICも含む）
  const isSupportedImageType = (file: File): boolean => {
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif']
    const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif']
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
      
      // Blobが有効か確認
      if (!blob || blob.size === 0) {
        throw new Error('変換後の画像データが無効です')
      }
      
      // BlobをFileに変換（lastModifiedを明示的に設定）
      const fileName = file.name.replace(/\.(heic|heif)$/i, '.jpg')
      const convertedFile = new File([blob], fileName, { 
        type: 'image/jpeg',
        lastModified: Date.now()
      })
      
      // 変換後のファイルサイズを確認
      if (convertedFile.size === 0) {
        throw new Error('変換後の画像ファイルサイズが0です')
      }
      
      return convertedFile
    } catch (error) {
      console.error('HEIC conversion error:', error)
      throw new Error('HEIC形式の画像の変換に失敗しました。JPEGまたはPNG形式の画像を使用してください。')
    }
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
      formPayload.set('content', formData.content)
      formPayload.set('category', formData.category)
      formPayload.set('location', formData.location)
      formPayload.set('organization', formData.organization)
      formPayload.set('questStyle', formData.questStyle.toString())
      formPayload.set('emotionMeter', formData.emotionMeter.toString())
      formPayload.set('growthDiscovery', formData.growthDiscovery)
      formPayload.set('finalBoss', formData.finalBoss)
      
      // 画像ファイルを検証してから追加
      images.forEach((file, index) => {
        if (!file || file.size === 0) {
          console.error(`Invalid file at index ${index}:`, { name: file?.name, size: file?.size, type: file?.type })
          setError(`画像ファイル（${file?.name || '不明'}）が無効です。`)
          return
        }
        formPayload.append('images', file, file.name)
      })

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formPayload,
      })

      if (response.ok) {
        router.push('/posts')
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
    <>
      <form onSubmit={handleSubmit} className="bg-transparent rounded-lg p-0">
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
        <label htmlFor="organization" className="block text-sm font-semibold text-gray-700 mb-2">
          主催団体名
        </label>
        <input
          type="text"
          id="organization"
          value={formData.organization}
          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="例: NPO ○○ / サークル名 など"
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

      <div className="mb-6 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">冒険の記録</h3>
        
        <AdventureSlider
          label="① クエストスタイル"
          leftLabel="成長できる経験"
          rightLabel="新しいワクワク"
          value={formData.questStyle}
          onChange={(value) => setFormData({ ...formData, questStyle: value })}
        />
        
        <AdventureSlider
          label="② 感情メーター"
          leftLabel="ゆったり安心"
          rightLabel="ドキドキ大冒険"
          value={formData.emotionMeter}
          onChange={(value) => setFormData({ ...formData, emotionMeter: value })}
        />
      </div>

      <div className="mb-6 border-t pt-6">
        <div className="mb-6">
          <label htmlFor="growthDiscovery" className="block text-sm font-semibold text-gray-700 mb-2">
            自分の成長発見 -小さな出来事から大きな挑戦まで-
          </label>
          <textarea
            id="growthDiscovery"
            rows={5}
            value={formData.growthDiscovery}
            onChange={(e) => setFormData({ ...formData, growthDiscovery: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="今回の活動で気づいた自分の成長や発見を自由に記述してください..."
          />
        </div>

        <div className="mb-6">
          <label htmlFor="finalBoss" className="block text-sm font-semibold text-gray-700 mb-2">
            今日のラスボス（自由記述）
          </label>
          <textarea
            id="finalBoss"
            rows={5}
            value={formData.finalBoss}
            onChange={(e) => setFormData({ ...formData, finalBoss: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="今日の活動で直面した課題や挑戦を自由に記述してください..."
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          活動写真（最大10枚）
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={isConverting}
          onChange={async (e) => {
            const selectedFiles = Array.from(e.target.files || [])
            if (selectedFiles.length === 0) return

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

              for (let i = 0; i < Math.min(selectedFiles.length, availableSlots); i++) {
                const file = selectedFiles[i]
                const currentIndex = images.length + processedFiles.length

                try {
                  // サポートされている形式かチェック
                  if (!isSupportedImageType(file)) {
                    const fileExtension = file.name.split('.').pop()?.toUpperCase() || '不明'
                    newErrors.set(currentIndex, `画像の形式（${fileExtension}）はサポートされていません。JPEG、PNG、WebP、GIF、HEIC形式の画像を使用してください。`)
                    continue
                  }

                  // ファイルサイズを確認（0バイトのファイルは除外）
                  if (file.size === 0) {
                    newErrors.set(currentIndex, '画像ファイルが空です。別の画像を選択してください。')
                    continue
                  }

                  processedFiles.push(file)
                  processedPreviews.push(URL.createObjectURL(file))
                } catch (error) {
                  const errorMessage = error instanceof Error ? error.message : '画像の処理に失敗しました。'
                  newErrors.set(currentIndex, errorMessage)
                  console.error('Image processing error:', error, { fileName: file.name, fileSize: file.size })
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
                setImagePreviews((prev) => [...prev, ...processedPreviews])
                setImageErrors((prev) => {
                  const updated = new Map(prev)
                  newErrors.forEach((value, key) => updated.set(key, value))
                  return updated
                })
              }

              if (selectedFiles.length > availableSlots) {
                setError('画像は最大10枚までアップロードできます。')
              }
            } catch (error) {
              console.error('File processing error:', error)
              setError('画像の処理中にエラーが発生しました。')
            } finally {
              setIsConverting(false)
              e.target.value = ''
            }
          }}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {isConverting && (
          <p className="mt-2 text-sm text-gray-600">画像を変換中...</p>
        )}
        {images.length > 0 && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {images.map((file, index) => {
              const hasError = imageErrors.has(index)
              return (
                <div 
                  key={index} 
                  className={`relative rounded-lg border p-3 ${
                    hasError ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <div className={`text-xs break-all mb-2 ${hasError ? 'text-red-600' : 'text-gray-500'}`}>
                    {file.name}
                  </div>
                  {hasError && (
                    <div className="mb-2 text-xs text-red-600 bg-red-100 p-2 rounded">
                      {imageErrors.get(index)}
                    </div>
                  )}
                  {imagePreviews[index] && (
                    <div className="overflow-hidden rounded-md">
                      {isHeicFile(file) ? (
                        <div className="flex h-32 w-full items-center justify-center bg-gray-100 px-3 text-center text-xs text-gray-500">
                          この画像はHEIC形式のため、この画面ではプレビュー表示できませんが、そのまま投稿されます。
                        </div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imagePreviews[index]}
                          alt={`${file.name} preview`}
                          className="h-32 w-full object-cover"
                        />
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const nextImages = images.filter((_, idx) => idx !== index)
                      const nextPreviews = imagePreviews.filter((_, idx) => idx !== index)
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
                      URL.revokeObjectURL(imagePreviews[index])
                      setImages(nextImages)
                      setImagePreviews(nextPreviews)
                      setImageErrors(reindexedErrors)
                    }}
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

