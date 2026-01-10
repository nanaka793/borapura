'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Topic } from '@/lib/types'

interface TavernSectionProps {
  topics: Topic[]
}

// タイプライターアニメーション用のコンポーネント
function TypewriterText({ text, delay = 100, isVisible = false, onComplete }: { text: string; delay?: number; isVisible?: boolean; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTextVisible, setIsTextVisible] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
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
    setIsComplete(false)
    let currentIndex = 0
    let timer: NodeJS.Timeout | null = null

    timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        if (timer) clearInterval(timer)
        setIsComplete(true)
        if (onComplete) {
          // タイトル完了後、少し間を置いてからテキストを表示
          setTimeout(() => {
            onComplete()
          }, 300)
        }
      }
    }, delay)

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [text, delay, isVisible, isTextVisible, onComplete])

  return (
    <span ref={textRef}>
      {displayedText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  )
}

export default function TavernSection({ topics }: TavernSectionProps) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [isTitleComplete, setIsTitleComplete] = useState(false)
  const [isMobile, setIsMobile] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  
  // 最新の4つのトピックを取得
  const latestTopics = topics.slice(0, 4)

  // ウィンドウサイズを監視
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  const handleMoreClick = () => {
    router.push('/topics')
  }

  const handleTopicClick = (topicId: string) => {
    router.push(`/topics/${topicId}`)
  }

  return (
    <section 
      ref={sectionRef} 
      className={`relative w-full overflow-hidden scroll-snap-section section-slide-in ${isVisible ? 'visible' : ''}`}
      style={{ minHeight: '100vh' }}
    >
      {/* 1. 紫のグラデーション背景 - 縦を画面いっぱいに広げ、はみ出た横をカット */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/tavern-gradient-bg.png"
          alt=""
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
          priority
          style={{ objectPosition: 'center' }}
        />
      </div>

      {/* 2. お酒の透過素材 - 左下から斜め左上にスライド移動するループアニメーション */}
      <div 
        className="absolute z-10 md:!bottom-0 md:!w-full md:!h-full"
        style={{
          left: '0%',
          bottom: '10%',
          width: '150%',
          height: '150%'
        }}
      >
        <Image
          src="/tavern-bottles.png"
          alt=""
          width={1920}
          height={1080}
          className="w-full h-full object-contain object-left-bottom animate-slide-diagonal"
        />
      </div>

      {/* 3. メニュー表 - スクロール到達時に右から左にスライドイン */}
      <div 
        className="absolute z-20 transition-transform duration-1000 ease-out md:!top-[-8%] md:!right-[-10%] overflow-hidden md:overflow-visible"
        style={{
          top: '20%',
          ...(isMobile ? {
            left: '4%',
            right: 'auto',
            width: 'calc(100% - 8%)',
            transformOrigin: 'top left'
          } : {
            right: '-10%',
            width: '80%',
            transformOrigin: 'top right'
          }),
          maxWidth: 'none',
          transform: isVisible 
            ? 'translateX(0) scale(1.1)' 
            : 'translateX(100%) scale(1.1)'
        }}
      >
        <div 
          className="relative w-full flex flex-col md:w-[85vw] lg:w-[80vw] xl:w-[75vw] 2xl:w-[70vw]"
          style={{
            maxWidth: '2200px',
            ...(isMobile ? {} : { minWidth: '600px' })
          }}
        >
          {/* メニュー表の画像（スマホ版は新しい画像、PC版は従来の画像） */}
          <div className="md:hidden">
            <Image
              src="/tavern-menu-card-mobile.png"
              alt=""
              width={1200}
              height={1600}
              className="w-full h-auto"
              style={{
                aspectRatio: 'auto'
              }}
            />
          </div>
          <div className="hidden md:block">
            <Image
              src="/tavern-menu-card.png"
              alt=""
              width={1200}
              height={1600}
              className="w-full h-auto"
              style={{
                aspectRatio: 'auto'
              }}
            />
          </div>
          
          {/* メニュー表の上にコンテンツを配置 */}
          <div className={`absolute inset-0 pt-8 pb-8 md:pt-24 md:pl-40 lg:pt-48 lg:pl-56 md:pr-20 ${isMobile ? 'pl-0 pr-[4%]' : ''}`}>
            <div className="h-full flex flex-col md:scale-[0.769] lg:scale-100">
              {/* MENUタイトル */}
              <div className="mb-4 md:mb-6 flex-shrink-0">
                <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-1" style={{ letterSpacing: '0.1em' }}>
                  MENU
                </h3>
                <div className="h-0.5 w-12 md:w-16 bg-gray-700"></div>
              </div>

              {/* トピックリスト - 飲食店のメニュー表風 */}
              <div className="space-y-3 md:space-y-4 overflow-hidden md:overflow-visible">
                {latestTopics.length === 0 ? (
                  <p className="text-gray-600 text-sm md:text-base">
                    現在、トピックはありません。
                  </p>
                ) : (
                  latestTopics.map((topic, index) => (
                    <div
                      key={topic.id}
                      onClick={() => handleTopicClick(topic.id)}
                      className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white hover:shadow-lg rounded-lg p-3 md:p-4 overflow-hidden md:overflow-visible"
                      style={{
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      <div className="flex items-start gap-2 w-full">
                        <span className="text-gray-700 font-bold text-base md:text-lg flex-shrink-0" style={{ minWidth: '1.5rem' }}>
                          {index + 1}.
                        </span>
                        <div className="flex-1 min-w-0 overflow-hidden md:overflow-visible">
                          <h4 
                            className="text-sm md:text-base font-semibold mb-1 leading-tight md:leading-normal truncate md:truncate-none"
                            style={{ color: '#000000' }}
                          >
                            {topic.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                            <span>{topic.commentCount}件のコメント</span>
                            {topic.isActive && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                                募集中
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 酒場へ行ってもっと見に行くボタン */}
              <div className="mt-6 md:mt-10 flex justify-center md:justify-start">
                <button
                  onClick={handleMoreClick}
                  className="w-auto py-3 px-4 rounded text-sm font-semibold text-white transition-all hover:opacity-90 md:w-auto"
                  style={{
                    background: 'linear-gradient(135deg, #87354F 0%, #7C3AED 100%)',
                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  ▶︎  酒場へ行ってもっと見に行く
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. テキストボックス - 最上レイヤー */}
      <div 
        onClick={handleMoreClick}
        className={`absolute z-30 transition-all duration-300 ease-in-out cursor-pointer hover:opacity-90 md:!top-[12%] md:!max-w-[22%] md:!scale-[1.4] ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: '4%',
          top: '5%',
          maxWidth: '90%',
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }}
      >
        <div 
          className="bg-black rounded-lg border-2 border-gray-400 p-4 md:p-6"
          style={{
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="flex flex-col">
            <div className="mb-3 md:mb-4">
              <h2 
                className="text-xl md:text-2xl font-bold text-white mb-2"
                style={{ lineHeight: '1.5' }}
              >
                <TypewriterText 
                  text="冒険者の酒場" 
                  delay={100} 
                  isVisible={isVisible}
                  onComplete={() => setIsTitleComplete(true)}
                />
              </h2>
              <div className="h-px bg-gray-400"></div>
            </div>
            <div 
              className={`leading-relaxed text-white transition-all duration-700 ${
                isTitleComplete 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                fontSize: '0.75rem',
                lineHeight: '1.6'
              }}
            >
              <p className="mb-2">冒険者が集う酒場…</p>
              <p className="mb-2">ここはボランティア活動の有無に関わらず、冒険者がどんなときでも楽しく交流できるトークルーム。</p>
              <p>活動への思いなど熱いルームから、ちょっぴり変なお遊びルームまでさまざま。</p>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

