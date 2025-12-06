'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface MyPageSectionProps {
  currentUser: { id: string; name: string; avatar?: string } | null
}

export default function MyPageSection({ currentUser }: MyPageSectionProps) {
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

  const handleMyPageClick = () => {
    if (currentUser) {
      router.push('/mypage')
    } else {
      router.push('/login?next=/mypage')
    }
  }

  const handleRegisterClick = () => {
    router.push('/register?next=/mypage')
  }

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* 背景グラデーション（上#0B1024、下#FFFFFF） */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(to bottom, #0B1024 0%, #FFFFFF 100%)'
        }}
      />

      {/* 星の装飾 */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 5 }}>
        {[...Array(30)].map((_, i) => {
          const delay = Math.random() * 3
          const duration = Math.random() * 2 + 2
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                opacity: Math.random() * 0.8 + 0.2,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`
              }}
            />
          )
        })}
      </div>

      {/* コンテンツ */}
      <div className="relative z-10 container mx-auto px-4" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '15vh', paddingBottom: '15vh' }}>
        <div className="max-w-6xl mx-auto w-full">
          {/* メインコンテンツエリア */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* 左側：キャンプイラスト */}
            <div className="relative flex flex-col items-center justify-center min-h-[500px]">
              <div 
                className={`relative transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)',
                  zIndex: 10
                }}
              >
                <Image
                  src="/camp-illustration.png"
                  alt="キャンプ場のイラスト"
                  width={600}
                  height={600}
                  className="w-full h-auto max-w-md"
                  priority
                />
              </div>
            </div>

            {/* 右側：テキストとCTA */}
            <div 
              className={`flex flex-col justify-center space-y-6 md:space-y-8 transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
            >
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: '#0B1024' }}>
                  {currentUser ? (
                    <>
                      <span className="text-white drop-shadow-lg">あなただけの</span>
                      <br />
                      <span className="text-white drop-shadow-lg">冒険の拠点</span>
                    </>
                  ) : (
                    <>
                      <span className="text-white drop-shadow-lg">冒険の拠点を</span>
                      <br />
                      <span className="text-white drop-shadow-lg">作ろう</span>
                    </>
                  )}
                </h2>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed drop-shadow-md">
                  {currentUser ? (
                    <>
                      あなたの冒険の記録、獲得したバッジ、<br />
                      そして仲間たちとのつながり。<br />
                      すべてがここに集まります。
                    </>
                  ) : (
                    <>
                      マイページを作成して、<br />
                      あなただけの冒険の記録を残しましょう。<br />
                      テントを建てて、キャンプファイヤーを囲みながら、<br />
                      あなたの冒険を始めませんか？
                    </>
                  )}
                </p>
              </div>

              {/* ゲーム要素：冒険者カード風（クリック可能） */}
              <div 
                onClick={handleMyPageClick}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/20 cursor-pointer transition-all hover:bg-white/20 hover:scale-105 hover:shadow-2xl"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl font-bold text-white"
                    style={{
                      boxShadow: '0 4px 12px rgba(255, 140, 0, 0.5)'
                    }}
                  >
                    {currentUser ? '🏕️' : '⭐'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {currentUser ? `${currentUser.name}のキャンプ` : '新しい冒険者'}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {currentUser ? 'あなたの冒険の記録' : '冒険を始めよう'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-white/90 text-sm">
                  <div className="flex items-center gap-2">
                    <span>📝</span>
                    <span>冒険日誌の記録</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🏆</span>
                    <span>獲得バッジの確認</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>仲間とのつながり</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⭐</span>
                    <span>ブックマークした活動</span>
                  </div>
                </div>
                {!currentUser && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-white/80 text-xs text-center">
                      クリックしてログインまたは新規登録
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

