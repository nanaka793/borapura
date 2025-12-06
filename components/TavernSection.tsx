'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Topic } from '@/lib/types'

interface TavernSectionProps {
  topics: Topic[]
}

export default function TavernSection({ topics }: TavernSectionProps) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  
  // 最新の4つのトピックを取得
  const latestTopics = topics.slice(0, 4)

  // スクロール検知でアニメーション開始
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.2 }
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
    <section ref={sectionRef} className="relative w-full overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* 1. 紫のグラデーション背景 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/tavern-gradient-bg.png"
          alt=""
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* 2. お酒の透過素材 - 左下から斜め左上にスライド移動するループアニメーション */}
      <div 
        className="absolute z-10"
        style={{
          left: '0%',
          bottom: '0%',
          width: '100%',
          height: '100%'
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
        className="absolute z-20 transition-transform duration-1000 ease-out"
        style={{
          top: '-8%',
          right: '-10%',
          width: '72%',
          maxWidth: 'none',
          transform: isVisible 
            ? 'translateX(0) scale(1.1)' 
            : 'translateX(100%) scale(1.1)',
          transformOrigin: 'top right'
        }}
      >
        <div className="relative w-full flex flex-col">
          {/* メニュー表の画像 */}
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
          
          {/* メニュー表の上にコンテンツを配置 */}
          <div className="absolute inset-0" style={{ padding: '12rem 5rem 2rem 14rem' }}>
            <div className="h-full flex flex-col">
              {/* MENUタイトル */}
              <div className="mb-4 md:mb-6 flex-shrink-0">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1" style={{ letterSpacing: '0.1em' }}>
                  MENU
                </h3>
                <div className="h-0.5 w-16 bg-gray-700"></div>
              </div>

              {/* トピックリスト - 飲食店のメニュー表風 */}
              <div className="space-y-3 md:space-y-4">
                {latestTopics.length === 0 ? (
                  <p className="text-gray-600 text-sm md:text-base">
                    現在、トピックはありません。
                  </p>
                ) : (
                  latestTopics.map((topic, index) => (
                    <div
                      key={topic.id}
                      onClick={() => handleTopicClick(topic.id)}
                      className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white hover:shadow-lg rounded-lg p-3 md:p-4"
                      style={{
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-gray-700 font-bold text-base md:text-lg flex-shrink-0" style={{ minWidth: '1.5rem' }}>
                          {index + 1}.
                        </span>
                        <div className="flex-1">
                          <h4 
                            className="text-sm md:text-base font-semibold mb-1 leading-tight"
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
              <div className="mt-10">
                <button
                  onClick={handleMoreClick}
                  className="w-auto py-3 px-4 rounded text-sm font-semibold text-white transition-all hover:opacity-90"
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
        className={`absolute z-30 text-white transition-all duration-300 ease-in-out cursor-pointer hover:opacity-80 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: '4%',
          top: '12%',
          maxWidth: '22%',
          transform: 'scale(1.4)',
          transformOrigin: 'top left'
        }}
      >
        <div 
          className="relative"
          style={{
            padding: '1rem',
            boxSizing: 'border-box'
          }}
        >
          <Image
            src="/tavern-text-box.png"
            alt=""
            width={400}
            height={600}
            className="w-full h-auto"
            style={{
              aspectRatio: 'auto'
            }}
          />
          <div 
            className="absolute inset-0 flex flex-col justify-start items-start"
            style={{
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              padding: '2rem 1.5rem',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ marginLeft: '15%' }}>
              <h2 
                className="text-xl md:text-2xl font-bold mb-1"
                style={{ lineHeight: '2' }}
              >
                冒険者の酒場
              </h2>
              <div className="h-px bg-white mb-1 md:mb-1" style={{ width: '100%' }}></div>
            </div>
            <div 
              className="leading-relaxed text-white overflow-hidden"
              style={{
                aspectRatio: '3/4',
                maxWidth: '100%',
                padding: '0.6rem 0.6rem',
                boxSizing: 'border-box',
                marginLeft: '8%',
                fontSize: '0.75rem'
              }}
            >
              <div className="h-full overflow-y-auto" style={{ paddingLeft: '8%', lineHeight: '1.5' }}>
                <p>冒険者が集う酒場…</p>
                <br />
                <p>ここはボランティア活動の有無に関わらず、冒険者がどんなときでも楽しく交流できるトークルーム。</p>
                <br />
                <p>活動への思いなど熱いルームから、ちょっぴり変なお遊びルームまでさまざま。</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

