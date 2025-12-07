'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

export default function ThoughtSection() {
  const [titleText, setTitleText] = useState('')
  const [currentLineIndex, setCurrentLineIndex] = useState(-1)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isTitleComplete, setIsTitleComplete] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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
    // タイトル完了後に本文のタイプライターアニメーションを開始
    if (!isTitleComplete) return

    let bodyInterval: NodeJS.Timeout | null = null

    // タイトル完了後、少し間を置いてからテキストアニメーションを開始
    const delayTimer = setTimeout(() => {
      setCurrentLineIndex(0)
      setCurrentCharIndex(0)

      let lineIndex = 0
      let charIndex = 0
      bodyInterval = setInterval(() => {
        if (lineIndex < fullBodyLines.length) {
          const currentLine = fullBodyLines[lineIndex]
          if (charIndex < currentLine.length) {
            setCurrentLineIndex(lineIndex)
            setCurrentCharIndex(charIndex + 1)
            charIndex++
          } else {
            // 現在の行が完了したら次の行へ
            lineIndex++
            charIndex = 0
            setCurrentLineIndex(lineIndex)
            setCurrentCharIndex(0)
          }
        } else {
          if (bodyInterval) clearInterval(bodyInterval)
          // アニメーション完了後も全ての行を表示するため、最後の行インデックスを保持
          setCurrentLineIndex(fullBodyLines.length - 1)
          setCurrentCharIndex(fullBodyLines[fullBodyLines.length - 1].length)
        }
      }, 75) // 75msごとに1文字
    }, 400) // タイトル完了後400ms待つ

    return () => {
      clearTimeout(delayTimer)
      if (bodyInterval) clearInterval(bodyInterval)
    }
  }, [isTitleComplete])

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
            {/* テキスト - 常に表示して高さを固定 */}
            <div className="text-lg md:text-xl text-gray-700 text-center" style={{ lineHeight: '2.5', minHeight: `${2.5 * fullBodyLines.length}em` }}>
              {fullBodyLines.map((fullLine, index) => {
                const isCurrentLine = index === currentLineIndex
                const isComplete = index < currentLineIndex || (index === currentLineIndex && currentCharIndex >= fullLine.length)
                const showCursor = isCurrentLine && currentCharIndex < fullLine.length
                
                // アニメーション完了後も全ての行を表示
                let typedLength = 0
                if (index < currentLineIndex) {
                  // 前の行は全て表示
                  typedLength = fullLine.length
                } else if (index === currentLineIndex) {
                  // 現在の行はタイプされた部分まで表示
                  typedLength = currentCharIndex
                } else {
                  // 後の行は非表示
                  typedLength = 0
                }
                
                return (
                  <div key={index} className="relative h-[2.5em] flex items-center justify-center">
                    <span className="relative inline-block">
                      {fullLine.substring(0, typedLength)}
                      {showCursor && <span className="animate-pulse">|</span>}
                      {typedLength < fullLine.length && (
                        <span className="opacity-0">{fullLine.substring(typedLength)}</span>
                      )}
                    </span>
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

