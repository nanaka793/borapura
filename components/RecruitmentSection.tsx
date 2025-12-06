'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Post, User } from '@/lib/types'
import Avatar from './Avatar'

interface RecruitmentSectionProps {
  posts: Post[]
  users: User[]
}

// タイプライターアニメーション用のコンポーネント
function TypewriterText({ text, delay = 100, startDelay = 0 }: { text: string; delay?: number; startDelay?: number }) {
  const [displayedText, setDisplayedText] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const textRef = useRef<HTMLSpanElement>(null)

  // Intersection Observerで要素が表示されたかを監視
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
      { threshold: 0.1 }
    )

    if (textRef.current) {
      observer.observe(textRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  // 表示されたらアニメーション開始
  useEffect(() => {
    if (!isVisible) return

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
  }, [text, delay, startDelay, isVisible])

  return (
    <span ref={textRef}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

export default function RecruitmentSection({ posts, users }: RecruitmentSectionProps) {
  const router = useRouter()
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
  
  // 最新の5つの募集投稿を取得
  const latestRecruitmentPosts = posts
    .filter((post) => post.type === '募集投稿')
    .slice(0, 5)

  const handlePostClick = (postId: string) => {
    router.push(`/events/${postId}`)
  }

  const handleListClick = () => {
    router.push('/events')
  }

  const handleCreateClick = () => {
    router.push('/events/new')
  }

  if (latestRecruitmentPosts.length === 0) {
    return null
  }

  return (
    <section 
      ref={sectionRef}
      className={`relative w-full overflow-hidden scroll-snap-section section-slide-in ${isVisible ? 'visible' : ''}`}
      style={{ minHeight: '100vh' }}
    >
      {/* 背景画像 */}
      <div className="relative w-full">
        <Image
          src="/board-bg.png"
          alt=""
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      {/* コンテンツ - 背景画像の上に重ねる */}
      <div className="absolute inset-0 z-10">
        <div className="container mx-auto px-4 w-full h-full">
          <div className="max-w-6xl mx-auto h-full relative">
            {/* タイトル */}
            <div className="text-center mb-8 md:mb-12" style={{ top: '11%', transform: 'translateY(-50%)', position: 'absolute', width: '100%' }}>
              <p className="text-sm md:text-base font-semibold text-gray-700 mb-2">
                あなたを仲間に待っています
              </p>
              {/* 角丸バナー風タイトル */}
              <div className="inline-block relative">
                <div
                  className="rounded-lg px-6 md:px-10 py-3 md:py-4"
                  style={{
                    background: '#EFE9DC',
                    boxShadow: '-4px 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                  }}
                >
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                    【新着】ボランティア募集
                  </h2>
                </div>
              </div>
            </div>

            {/* 投稿カードエリア（掲示板の上に配置） */}
            <div className="relative flex items-center justify-center gap-3 md:gap-4 min-h-[300px]" style={{ top: '42%', transform: 'translateY(-50%)', position: 'absolute', width: '100%' }}>
              {/* 投稿カード（5つ表示） */}
              <div className={`flex-1 grid gap-3 md:gap-4 ${
                latestRecruitmentPosts.length === 1 
                  ? 'grid-cols-1 max-w-md mx-auto' 
                  : latestRecruitmentPosts.length === 2
                  ? 'grid-cols-1 md:grid-cols-2'
                  : latestRecruitmentPosts.length === 3
                  ? 'grid-cols-1 md:grid-cols-3'
                  : latestRecruitmentPosts.length === 4
                  ? 'grid-cols-2 md:grid-cols-4'
                  : 'grid-cols-2 md:grid-cols-5'
              }`}>
                {latestRecruitmentPosts.map((post) => {
                  const authorUser = userMap[post.authorId] || userNameMap[post.author.toLowerCase()]
                  const authorAvatar = authorUser?.avatar
                  
                  return (
                    <div
                      key={post.id}
                      onClick={() => handlePostClick(post.id)}
                      className="relative aspect-[3/4] rounded-lg cursor-pointer transition-all hover:scale-105 overflow-hidden group"
                      style={{ 
                        boxShadow: '-4px 4px 8px rgba(0, 0, 0, 0.3)',
                        backgroundColor: '#fff'
                      }}
                    >
                      
                      
                      {/* 背景画像 */}
                      {post.images && post.images.length > 0 ? (
                        <Image
                          src={post.images[0]}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 50vw, 20vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-yellow-400" />
                      )}
                      
                      {/* オーバーレイ（グラデーション） */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      
                      {/* コンテンツエリア */}
                      <div className="absolute inset-0 flex flex-col justify-between p-3 md:p-4 text-white">
                        {/* 投稿ジャンル（上部） */}
                        {post.category && (
                          <div className="flex items-start">
                            <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-1 text-[10px] md:text-xs font-semibold">
                              {post.category}
                            </span>
                          </div>
                        )}
                        
                        {/* 下部コンテンツ */}
                        <div className="flex flex-col">
                          {/* タイトル（高さを固定） */}
                          <h3 className="text-sm md:text-base font-bold line-clamp-2 mb-2 min-h-[3rem] flex items-end">
                            {post.title}
                          </h3>
                          
                          {/* 詳細説明文（最大3行） */}
                          <p className="text-xs md:text-sm line-clamp-3 opacity-90 mb-2">
                            {post.content}
                          </p>
                          
                          {/* 投稿者情報（最下部、小さく） */}
                          <div className="flex items-center gap-1.5 mt-auto">
                            <Avatar
                              src={authorAvatar}
                              name={post.author}
                              size="sm"
                              className="ring-1 ring-white/40"
                            />
                            <span className="text-[10px] md:text-xs font-medium opacity-80">
                              {post.author}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 下部のテキストブロック（ゲーム風テロップ - 黒いボックスの上に配置） */}
            <div className="absolute" style={{ top: '79%', left: '25%', transform: 'translateX(-50%)', width: '100%' }}>
              <div className="space-y-4 text-white font-mono" style={{ fontSize: '1.5em' }}>
                {/* 募集記事をもっと見る */}
                <button
                  onClick={handleListClick}
                  className="block hover:opacity-80 transition-all group"
                  style={{ textAlign: 'left', marginLeft: '50%' }}
                >
                  <TypewriterText text="▶︎ 募集記事をもっと見る" delay={100} startDelay={0} />
                </button>
                
                {/* 募集記事を掲載する */}
                <button
                  onClick={handleCreateClick}
                  className="block hover:opacity-80 transition-all group"
                  style={{ textAlign: 'left', marginLeft: '50%' }}
                >
                  <TypewriterText text="▶︎ 募集記事を掲載する" delay={100} startDelay={500} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

