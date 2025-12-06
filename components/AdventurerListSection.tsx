'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Avatar from './Avatar'
import { getBadgeEmoji } from '@/lib/badges'

interface User {
  id: string
  name: string
  avatar?: string
  headline?: string
  location?: string
  postCount: number
}

interface AdventurerListSectionProps {
  users: User[]
  currentUserPostCount?: number
}

// バッジ情報（lib/data.tsから参照）
const ACTIVITY_POST_BADGES = [
  { count: 15, name: '伝説の探索者' },
  { count: 10, name: '熟練の旅人' },
  { count: 6, name: '冒険ログ収集家' },
  { count: 3, name: 'フィールドランナー' },
  { count: 1, name: '初陣の冒険者' },
]

const RECRUITMENT_POST_BADGES = [
  { count: 15, name: '伝説のギルドマスター' },
  { count: 10, name: '冒険ギルドの司書' },
  { count: 6, name: '熟練クエストマスター' },
  { count: 3, name: '依頼案内人' },
  { count: 1, name: '初クエスト発行者' },
]

const LIKES_BADGES = [
  { count: 100, name: '輝く伝説' },
  { count: 60, name: '祝福の英雄' },
  { count: 35, name: 'コミュニティの星' },
  { count: 20, name: '賞賛の冒険者' },
  { count: 10, name: '人気の旅人' },
  { count: 5, name: 'みんなの灯' },
]

const COMMENT_BADGES = [
  { count: 50, name: '心の架け橋' },
  { count: 20, name: 'つながりの賢者' },
  { count: 10, name: 'コミュニティの語り部' },
  { count: 5, name: '声かけ名人' },
  { count: 2, name: '友好の印' },
]

const GENRE_BADGES = [
  { genre: '教育', name: '学びの賢者', emoji: '📖' },
  { genre: '子ども', name: '未来の勇者の守り手', emoji: '🛡️' },
  { genre: '国際協力', name: '世界橋渡しの旅人', emoji: '🌏' },
  { genre: '環境保護', name: 'エコレンジャー', emoji: '🌳' },
  { genre: '福祉', name: 'やさしさの司祭', emoji: '💝' },
  { genre: '災害支援', name: '救援レスキュー', emoji: '🚒' },
  { genre: '地域活動', name: 'ローカルガーディアン', emoji: '🏘️' },
  { genre: '医療・健康', name: '癒しの治癒師', emoji: '🌱' },
  { genre: 'スポーツ', name: 'アクションランナー', emoji: '👟' },
  { genre: '文化', name: '文化の旅人', emoji: '✏️' },
  { genre: 'イベント', name: 'イベントマエストロ', emoji: '🌝' },
]

export default function AdventurerListSection({ users, currentUserPostCount }: AdventurerListSectionProps) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const leftBlockRef = useRef<HTMLDivElement>(null)
  const rightBlockRef = useRef<HTMLDivElement>(null)
  const [randomUsers, setRandomUsers] = useState<User[]>([])

  // ランダムに6人のユーザーを選択
  useEffect(() => {
    if (users.length > 0) {
      const shuffled = [...users].sort(() => Math.random() - 0.5)
      setRandomUsers(shuffled.slice(0, 6))
    }
  }, [users])

  // 左側のブロックの高さに合わせて右側のブロックの高さを調整
  useEffect(() => {
    if (isVisible && leftBlockRef.current && rightBlockRef.current) {
      const updateHeight = () => {
        if (leftBlockRef.current && rightBlockRef.current) {
          rightBlockRef.current.style.height = `${leftBlockRef.current.offsetHeight}px`
        }
      }
      updateHeight()
      // リサイズ時にも更新
      window.addEventListener('resize', updateHeight)
      return () => window.removeEventListener('resize', updateHeight)
    }
  }, [isVisible, randomUsers])

  // スクロール検知でアニメーション開始
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.15, rootMargin: '50px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const handleUserClick = (userId: string) => {
    router.push(`/users/${userId}`)
  }

  const handleMoreClick = () => {
    router.push('/users')
  }

  // レベル計算（投稿数 = レベル）
  const userLevel = currentUserPostCount !== undefined ? currentUserPostCount : null

  return (
    <section 
      ref={sectionRef} 
      className={`relative w-full overflow-hidden scroll-snap-section section-slide-in ${isVisible ? 'visible' : ''}`}
      style={{ minHeight: '100vh' }}
    >
      {/* グレーのグラデーション背景（左から右に濃くなる） */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(to right, #4a4a4a 0%, #2a2a2a 100%)'
        }}
      />

      {/* コンテンツ */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-16" style={{ minHeight: '100vh' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* 左側：2つのブロック */}
          <div className="flex flex-col gap-6 md:gap-8">
            {/* 1番上のブロック：タイトル */}
            <div 
              className={`bg-black rounded-lg border-2 border-gray-400 p-6 md:p-8 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
              }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                冒険者リスト
              </h2>
            </div>

            {/* 真ん中のブロック：冒険者一覧 */}
            <div 
              ref={leftBlockRef}
              className={`bg-black rounded-lg border-2 border-gray-400 p-6 md:p-8 transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div className="space-y-4">
                {randomUsers.length === 0 ? (
                  <p className="text-white text-center py-8">
                    まだ冒険者がいません。
                  </p>
                ) : (
                  <>
                    {randomUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleUserClick(user.id)}
                        className="cursor-pointer bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-all border border-gray-700"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1">
                            <Avatar src={user.avatar} name={user.name} size="md" />
                            <div className="flex-1">
                              <h3 className="text-white font-semibold text-lg">{user.name}</h3>
                              {user.headline && (
                                <p className="text-gray-400 text-sm mt-1">{user.headline}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="text-white font-bold text-xl">
                              Lv : {user.postCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4">
                      <button
                        onClick={handleMoreClick}
                        className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-all hover:opacity-90"
                        style={{
                          background: 'linear-gradient(135deg, #87354F 0%, #7C3AED 100%)',
                          boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
                        }}
                      >
                        もっと見る
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 右側：テキストと下のブロック */}
          <div className="flex flex-col gap-6 md:gap-8">
            {/* 右上のテキストエリア */}
            <div 
              className={`text-white text-center transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ paddingRight: '1rem' }}
            >
              <p className="text-base md:text-lg leading-relaxed mb-4">
                ボランティア活動を通して人と人のつながりを創り出す勇者...
              </p>
              <p className="text-base md:text-lg leading-relaxed mb-4">
                それがこのボラプラの"冒険者"
              </p>
              <p className="text-base md:text-lg leading-relaxed mb-6">
                冒険者レベルを上げながらさまざまなバッジを獲得し、
              </p>
              <p className="text-base md:text-lg leading-relaxed mb-6">
                新たなつながりの創出者になれ。
              </p>
              <div className="border-t border-dashed border-gray-500 my-6"></div>
              <p className="text-lg md:text-xl font-semibold mb-4">あなたの冒険者レベル</p>
              <div className="flex items-baseline justify-center gap-3">
                <span className="text-4xl md:text-5xl font-bold">
                  Lv : {userLevel !== null ? userLevel : '?'}
                </span>
                {userLevel !== null && (
                  <span className="text-sm md:text-base text-gray-400">
                    (投稿数{userLevel}件)
                  </span>
                )}
              </div>
              <div className="border-t border-dashed border-gray-500 my-6"></div>
            </div>

            {/* 1番下のブロック：バッジ一覧 */}
            <div 
              ref={rightBlockRef}
              className={`bg-black rounded-lg border-2 border-gray-400 p-6 md:p-8 transition-all duration-1000 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
              }}
            >
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6">獲得できるバッジ</h3>
              <div className="space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100% - 60px)' }}>
                {/* 活動投稿バッジ（冒険日誌投稿バッジ） */}
                <div>
                  <h4 className="text-white font-semibold mb-3 text-lg">冒険日誌投稿バッジ</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {ACTIVITY_POST_BADGES.map((badge) => (
                      <div key={badge.name} className="bg-gray-900 rounded p-3 border border-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{getBadgeEmoji(badge.name)}</span>
                          <span className="text-white font-medium text-sm">{badge.name}</span>
                        </div>
                        <p className="text-gray-400 text-xs">活動投稿を{badge.count}件以上投稿</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 募集投稿バッジ */}
                <div>
                  <h4 className="text-white font-semibold mb-3 text-lg">募集投稿バッジ</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {RECRUITMENT_POST_BADGES.map((badge) => (
                      <div key={badge.name} className="bg-gray-900 rounded p-3 border border-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{getBadgeEmoji(badge.name)}</span>
                          <span className="text-white font-medium text-sm">{badge.name}</span>
                        </div>
                        <p className="text-gray-400 text-xs">募集投稿を{badge.count}件以上投稿</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ジャンルバッジ（活動ジャンルバッジ） */}
                <div>
                  <h4 className="text-white font-semibold mb-3 text-lg">活動ジャンルバッジ</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {GENRE_BADGES.map((badge) => (
                      <div key={badge.name} className="bg-gray-900 rounded p-3 border border-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{badge.emoji}</span>
                          <span className="text-white font-medium text-sm">{badge.name}</span>
                        </div>
                        <p className="text-gray-400 text-xs">{badge.genre}ジャンルで5件以上投稿</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* いいねバッジ */}
                <div>
                  <h4 className="text-white font-semibold mb-3 text-lg">いいね</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {LIKES_BADGES.map((badge) => (
                      <div key={badge.name} className="bg-gray-900 rounded p-3 border border-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{getBadgeEmoji(badge.name)}</span>
                          <span className="text-white font-medium text-sm">{badge.name}</span>
                        </div>
                        <p className="text-gray-400 text-xs">合計{badge.count}いいね以上獲得</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* コメントバッジ */}
                <div>
                  <h4 className="text-white font-semibold mb-3 text-lg">コメント</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {COMMENT_BADGES.map((badge) => (
                      <div key={badge.name} className="bg-gray-900 rounded p-3 border border-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{getBadgeEmoji(badge.name)}</span>
                          <span className="text-white font-medium text-sm">{badge.name}</span>
                        </div>
                        <p className="text-gray-400 text-xs">合計{badge.count}コメント以上投稿</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

