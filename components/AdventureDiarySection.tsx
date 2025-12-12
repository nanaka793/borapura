'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Post, User } from '@/lib/types'
import Avatar from './Avatar'

interface AdventureDiarySectionProps {
  posts: Post[]
  users: User[]
}

// タイプライターアニメーション用のコンポーネント
function TypewriterText({ text, delay = 100, startDelay = 0, isVisible = false }: { text: string; delay?: number; startDelay?: number; isVisible?: boolean }) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTextVisible, setIsTextVisible] = useState(false)
  const textRef = useRef<HTMLSpanElement>(null)

  // Intersection Observerで要素が表示されたかを監視
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsTextVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (textRef.current) {
      observer.observe(textRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  // セクションが表示され、かつ要素も表示されたらアニメーション開始
  useEffect(() => {
    if (!isVisible || !isTextVisible) return

    setDisplayedText('')
    let currentIndex = 0
    let timer: NodeJS.Timeout | null = null

    const startTimer = setTimeout(() => {
      timer = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          if (timer) clearInterval(timer)
        }
      }, delay)
    }, startDelay)

    return () => {
      clearTimeout(startTimer)
      if (timer) clearInterval(timer)
    }
  }, [text, delay, startDelay, isVisible, isTextVisible])

  return (
    <span ref={textRef}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

export default function AdventureDiarySection({ posts, users }: AdventureDiarySectionProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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
  
  // ユーザーマップを作成
  const userMap = users.reduce<Record<string, User>>((acc, user) => {
    acc[user.id] = user
    return acc
  }, {})
  const userNameMap = users.reduce<Record<string, User>>((acc, user) => {
    acc[user.name.toLowerCase()] = user
    return acc
  }, {})
  
  // 最新の8つの投稿を取得（記録投稿のみ）
  const latestPosts = posts
    .filter((post) => post.type !== '募集投稿')
    .slice(0, 8)

  // 表示する2つの投稿を決定
  const getVisiblePosts = () => {
    if (latestPosts.length === 0) return []
    const postsToShow: Post[] = []
    for (let i = 0; i < 2 && i < latestPosts.length; i++) {
      const idx = (currentIndex + i) % latestPosts.length
      postsToShow.push(latestPosts[idx])
    }
    return postsToShow
  }
  const visiblePosts = getVisiblePosts()

  const handlePrev = () => {
    if (latestPosts.length <= 2) return
    setCurrentIndex((prev) => (prev - 1 + latestPosts.length) % latestPosts.length)
  }

  const handleNext = () => {
    if (latestPosts.length <= 2) return
    setCurrentIndex((prev) => (prev + 1) % latestPosts.length)
  }

  const handlePostClick = (postId: string) => {
    router.push(`/posts/${postId}`)
  }

  const handleListClick = () => {
    router.push('/posts')
  }

  const handleWriteClick = () => {
    router.push('/posts/new')
  }

  if (latestPosts.length === 0) {
    return null
  }

  return (
    <section 
      ref={sectionRef}
      className={`relative w-full overflow-hidden scroll-snap-section section-slide-in ${isVisible ? 'visible' : ''}`}
      style={{ minHeight: '100vh' }}
    >
      {/* 背景画像 - 縦を画面いっぱいに広げ、はみ出た横をカット */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/diary-bg.png"
          alt=""
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
          priority
          style={{ objectPosition: 'center' }}
        />
      </div>

      {/* コンテンツ - 背景画像の上に重ねる */}
      <div className="absolute inset-0 z-10">
        <div className="container mx-auto px-4 w-full h-full">
          <div className="max-w-6xl mx-auto h-full relative">
            {/* タイトル */}
            <div className="text-center mb-8 md:mb-12" style={{ top: '10%', transform: 'translateY(-50%)', position: 'absolute', width: '100%' }}>
              <p className="text-sm md:text-base font-semibold text-gray-700 mb-2">
                先人のボランティア活動記録
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                冒険日誌
              </h2>
            </div>

            {/* 投稿カードエリア（ノートの上に配置） */}
            <div className="relative min-h-[300px]" style={{ top: '42%', transform: 'translateY(-50%)', position: 'absolute', width: '100%' }}>
              {/* 左矢印 */}
              {latestPosts.length > 2 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 flex-shrink-0 w-10 h-10 md:w-14 md:h-14 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all hover:scale-110 z-20"
                  style={{ boxShadow: '-4px 4px 8px rgba(0, 0, 0, 0.3)' }}
                  aria-label="前の投稿"
                >
                  <svg
                    className="w-5 h-5 md:w-7 md:h-7 text-gray-800"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15 19l-7-7 7-7v14z" />
                  </svg>
                </button>
              )}

              {/* 投稿カード（2つ表示） */}
              <div className={`grid gap-4 md:gap-8 lg:gap-16 mx-auto max-w-lg md:max-w-lg lg:max-w-xl ${
                visiblePosts.length === 1 
                  ? 'grid-cols-1 max-w-md' 
                  : 'grid-cols-1 md:grid-cols-2'
              }`}>
                {visiblePosts.map((post, idx) => {
                  const authorUser = userMap[post.authorId] || userNameMap[post.author.toLowerCase()]
                  const authorAvatar = authorUser?.avatar
                  
                  return (
                    <div
                      key={`${post.id}-${currentIndex}`}
                      onClick={() => handlePostClick(post.id)}
                      className="relative aspect-[3/4] rounded-lg cursor-pointer transition-all hover:scale-105 overflow-hidden group"
                      style={{ boxShadow: '-4px 4px 8px rgba(0, 0, 0, 0.3)' }}
                    >
                      {/* 背景画像 */}
                      {post.images && post.images.length > 0 ? (
                        <Image
                          src={post.images[0]}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      ) : (
                        <div 
                          className="absolute inset-0" 
                          style={{ 
                            background: 'linear-gradient(to bottom right, #B8CDD5, #9BB5C0)' 
                          }} 
                        />
                      )}
                      
                      {/* オーバーレイ（グラデーション） */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      
                      {/* コンテンツエリア */}
                      <div className="absolute inset-0 flex flex-col justify-between p-3 md:p-4 text-white">
                        {/* 投稿者情報（上部） */}
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={authorAvatar}
                            name={post.author}
                            size="sm"
                            className="ring-2 ring-white/40"
                          />
                          <span className="text-xs md:text-sm font-medium">
                            {post.author}
                          </span>
                        </div>
                        
                        {/* 下部コンテンツ */}
                        <div>
                          {/* タイトル（高さを固定） */}
                          <h3 className="text-sm md:text-base font-bold line-clamp-2 mb-2 min-h-[3rem] flex items-end">
                            {post.title}
                          </h3>
                          
                          {/* 詳細説明文（最大3行） */}
                          <p className="text-xs md:text-sm line-clamp-3 opacity-90">
                            {post.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* 右矢印 */}
              {latestPosts.length > 2 && (
                <button
                  onClick={handleNext}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 flex-shrink-0 w-10 h-10 md:w-14 md:h-14 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all hover:scale-110 z-20"
                  style={{ boxShadow: '-4px 4px 8px rgba(0, 0, 0, 0.3)' }}
                  aria-label="次の投稿"
                >
                  <svg
                    className="w-5 h-5 md:w-7 md:h-7 text-gray-800"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 5l7 7-7 7v-14z" />
                  </svg>
                </button>
              )}
            </div>

            {/* 下部のテキストブロック（ゲーム風テロップ - 黒いボックスの上に配置） */}
            <div className="absolute" style={{ top: '76%', left: '25%', transform: 'translateX(-50%)', width: '100%' }}>
              <div className="space-y-4 text-white font-mono" style={{ fontSize: '1.5em' }}>
                {/* 日誌一覧を読む */}
                <button
                  onClick={handleListClick}
                  className="block hover:opacity-80 transition-all group"
                  style={{ textAlign: 'left', marginLeft: '50%' }}
                >
                  <TypewriterText text="▶︎ 日誌一覧を読む" delay={100} startDelay={0} isVisible={isVisible} />
                </button>
                
                {/* 自分の日誌を書く */}
                <button
                  onClick={handleWriteClick}
                  className="block hover:opacity-80 transition-all group"
                  style={{ textAlign: 'left', marginLeft: '50%' }}
                >
                  <TypewriterText text="▶︎ 自分の日誌を書く" delay={100} startDelay={500} isVisible={isVisible} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

