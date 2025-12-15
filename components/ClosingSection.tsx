'use client'

import { useEffect, useState, useRef } from 'react'

export default function ClosingSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const closingLines = [
    '冒険を楽しめるこの世界は',
    'きっとこれからもワクワクで溢れている'
  ]

  useEffect(() => {
    // Intersection Observerでセクションがビューポートに入ったかを監視
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // アニメーション開始前に少し遅延を追加
            setTimeout(() => {
              setIsVisible(true)
            }, 500) // 500ms待つ
          }
        })
      },
      { 
        threshold: 0.3, // セクションの30%が表示されたら開始
        rootMargin: '0px 0px -20% 0px' // セクションがもっと下に入ってから開始
      }
    )

    const currentRef = sectionRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 w-full">
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[200px]">
          <div 
            className={`text-base md:text-3xl text-black text-center font-bold transition-all duration-2000 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
            style={{ lineHeight: '2.5' }}
          >
            {closingLines.map((fullLine, index) => (
              <div key={index} className="mb-4 last:mb-0">
                {fullLine}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

