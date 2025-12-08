'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

export default function ThoughtSection() {
  const [titleText, setTitleText] = useState('')
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [isTitleComplete, setIsTitleComplete] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const lineIndexRef = useRef(0)

  const fullTitle = 'ボランティアは、世界を広げる "冒険" だ'
  const fullBodyLines = [
    '誰かのためになりたいとか、もっと面白いことをしたいとか',
    'そうやって自らの思いを胸に始めた冒険は',
    'あなたを知らなかった世界へと出会わせてくれる',
    '新たな冒険と仲間との出会いをここで始めよう'
  ]

  useEffect(() => {
    // Intersection Observerでセクションがビューポートに入ったかを監視
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.3 } // セクションの30%が表示されたら開始
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

  useEffect(() => {
    // セクションが表示されたらタイトルのタイプライターアニメーションを開始
    if (!isVisible) return

    let titleIndex = 0
    const titleInterval = setInterval(() => {
      if (titleIndex < fullTitle.length) {
        setTitleText(fullTitle.slice(0, titleIndex + 1))
        titleIndex++
      } else {
        clearInterval(titleInterval)
        setIsTitleComplete(true)
      }
    }, 120) // 120msごとに1文字

    return () => clearInterval(titleInterval)
  }, [isVisible])

  useEffect(() => {
    // タイトル完了後に本文を一行ずつふわっと表示
    if (!isTitleComplete) return

    lineIndexRef.current = 0
    let lineInterval: NodeJS.Timeout | null = null

    // タイトル完了後、少し間を置いてからテキストアニメーションを開始
    const delayTimer = setTimeout(() => {
      // 最初の行を即座に表示
      setVisibleLines([0])
      lineIndexRef.current = 1
      
      // 最初の行を表示した後、すぐに800ms間隔で次の行を表示
      lineInterval = setInterval(() => {
        const currentIndex = lineIndexRef.current
        if (currentIndex < fullBodyLines.length) {
          setVisibleLines((prev) => {
            if (!prev.includes(currentIndex)) {
              return [...prev, currentIndex]
            }
            return prev
          })
          lineIndexRef.current = currentIndex + 1
        } else {
          if (lineInterval) clearInterval(lineInterval)
        }
      }, 800) // 800msごとに次の行を表示
    }, 400) // タイトル完了後400ms待つ

    return () => {
      clearTimeout(delayTimer)
      if (lineInterval) clearInterval(lineInterval)
    }
  }, [isTitleComplete, fullBodyLines.length])

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden">
      {/* 背景画像 - 横幅いっぱいに表示、上端をヒーロー画面の下端に揃える */}
      <div className="relative w-full" style={{ aspectRatio: 'auto' }}>
        <Image
          src="/beach-bg.png"
          alt=""
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      {/* コンテンツ - 背景画像の上に重ねる */}
      <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ transform: 'translateY(20%)' }}>
        <div className="container mx-auto px-4 w-full">
          <div className="max-w-4xl mx-auto">
            {/* タイトル - 常にスペースを確保 */}
            <h2 className="text-3xl md:text-4xl font-bold text-textmain mb-6 text-center min-h-[3rem] md:min-h-[4rem] flex items-center justify-center">
              {titleText}
              {!isTitleComplete && <span className="animate-pulse">|</span>}
            </h2>
            {/* テキスト - 一行ずつふわっと表示 */}
            <div className="text-lg md:text-xl text-gray-700 text-center" style={{ lineHeight: '2.5' }}>
              {fullBodyLines.map((fullLine, index) => {
                const isVisible = visibleLines.includes(index)
                
                return (
                  <div 
                    key={index} 
                    className={`relative h-[2.5em] flex items-center justify-center transition-all duration-700 ${
                      isVisible 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <span>{fullLine}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

