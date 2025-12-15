'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

export default function CanDoSection() {
  const [rotation, setRotation] = useState(-2)
  const [translateY, setTranslateY] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const [scale, setScale] = useState(1.3)
  const [isMobile, setIsMobile] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const lastOpacityRef = useRef(0)

  useEffect(() => {
    // モバイル判定
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // モバイルの場合は初期状態を設定
      if (mobile) {
        setRotation(-5)
        setTranslateY(-150)
        setOpacity(0)
        setScale(1.3)
        lastOpacityRef.current = 0
      } else {
        setRotation(-2)
        setTranslateY(0)
        setOpacity(1)
        setScale(1.3)
        lastOpacityRef.current = 1
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!imageRef.current || !sectionRef.current) return

    // PC版ではアニメーションを無効化
    if (!isMobile) {
      return
    }

    let rafId: number | null = null

    const updateAnimation = () => {
      if (!imageRef.current) {
        rafId = null
        return
      }

      const rect = imageRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const centerY = viewportHeight / 2
      const imageCenterY = rect.top + rect.height / 2
      
      // 画像の中心が画面中央にどれだけ近いか（0-1の値）
      // より滑らかな計算のために、より広い範囲を使用
      const distanceFromCenter = Math.abs(imageCenterY - centerY)
      const maxDistance = viewportHeight * 0.5
      const rawProgress = Math.max(0, Math.min(1, 1 - distanceFromCenter / maxDistance))
      
      // スムーズなイージング関数（ease-in-out-cubic）
      const smoothProgress = rawProgress < 0.5
        ? 4 * rawProgress * rawProgress * rawProgress
        : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2
      
      if (isMobile) {
        // スマホ版: 画面中央に来たら90度回転して落下
        const animationStart = 0.1
        const animationEnd = 0.9
        
        if (smoothProgress > animationStart) {
          // アニメーション進行度（0-1）- より広い範囲で滑らかに
          const animProgress = Math.min(1, (smoothProgress - animationStart) / (animationEnd - animationStart))
          
          // 回転アニメーション（-5度から90度へ）
          const rotationProgress = Math.min(1, animProgress / 0.65)
          const rotationEase = 1 - Math.pow(1 - rotationProgress, 2.5)
          const targetRotation = -5 + (90 - (-5)) * rotationEase
          setRotation(targetRotation)
          
          // 90度回転に近づいたら画像を拡大（70度以上で拡大開始）
          if (targetRotation >= 70) {
            const scaleProgress = Math.min(1, (targetRotation - 70) / 20) // 70度から90度の間で拡大
            const targetScale = 1.3 + (1.8 - 1.3) * scaleProgress // 1.3から1.8に拡大
            setScale(targetScale)
          } else {
            setScale(1.3)
          }
          
          // 落下アニメーション（上から下へ、バウンス効果付き）
          const fallProgress = Math.min(1, animProgress / 0.75)
          let easeOutBounce
          if (fallProgress < 1 / 2.75) {
            easeOutBounce = 7.5625 * fallProgress * fallProgress
          } else if (fallProgress < 2 / 2.75) {
            const t = fallProgress - 1.5 / 2.75
            easeOutBounce = 7.5625 * t * t + 0.75
          } else if (fallProgress < 2.5 / 2.75) {
            const t = fallProgress - 2.25 / 2.75
            easeOutBounce = 7.5625 * t * t + 0.9375
          } else {
            const t = fallProgress - 2.625 / 2.75
            easeOutBounce = 7.5625 * t * t + 0.984375
          }
          setTranslateY(-150 + 150 * easeOutBounce)
          
          // フェードイン/アウト（より遅いアニメーション）
          // フェードインはゆっくりと完了させる
          const fadeStart = 0.0
          const fadeEnd = 0.7 // より長い範囲でゆっくりと
          let newOpacity = 0
          
          if (animProgress >= fadeEnd) {
            // フェードイン完了後は常に1
            newOpacity = 1
          } else if (animProgress > fadeStart) {
            // フェードイン中（よりゆっくりとしたease-out）
            const fadeProgress = (animProgress - fadeStart) / (fadeEnd - fadeStart)
            // ease-out-cubicで滑らかに（より緩やか）
            newOpacity = 1 - Math.pow(1 - fadeProgress, 2)
          }
          
          // 前回の値との差が小さい場合は更新しない（チカチカ防止）
          if (Math.abs(newOpacity - lastOpacityRef.current) > 0.01 || newOpacity === 0 || newOpacity === 1) {
            setOpacity(newOpacity)
            lastOpacityRef.current = newOpacity
          }
        } else {
          // 中央に来る前は上から落ちてくる準備
          setRotation(-5)
          setTranslateY(-150)
          setOpacity(0)
          setScale(1.3)
          lastOpacityRef.current = 0
        }
      }
      
      rafId = null
    }

    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      rafId = requestAnimationFrame(updateAnimation)
    }

    // 初回チェック
    handleScroll()
    
    // スクロールイベント
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    
    // Intersection Observerでセクションに入ったらアニメーション開始
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleScroll()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [isMobile])

  return (
    <section ref={sectionRef} id="can-do" className="relative w-full overflow-hidden" style={{ minHeight: isMobile ? '80vh' : '100vh' }}>
      {/* 背景画像 - 縦を画面いっぱいに広げ、はみ出た横をカット */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/beach-elements-bg.png"
          alt=""
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
          priority
          style={{ objectPosition: 'center' }}
        />
      </div>

      {/* コンテンツ - 背景画像の上に重ねる */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="container mx-auto px-4 w-full">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-8">
            {/* 手紙のような白い背景（画像のみ） */}
            <div 
              ref={imageRef}
              className={`bg-white rounded-lg shadow-2xl p-12 md:p-16 lg:p-20 ${
                isMobile ? '' : 'md:rotate-[-2deg] md:transition-transform md:duration-300 md:hover:rotate-[-1deg]'
              }`}
              style={{
                transform: isMobile 
                  ? `rotate(${rotation}deg) translateY(${translateY}px)`
                  : undefined,
                opacity: opacity,
                transformOrigin: 'center center',
                willChange: isMobile ? 'transform, opacity' : 'auto',
                transition: isMobile ? 'none' : undefined
              }}
            >
              <div style={{ transform: `scale(${scale})` }}>
                <Image
                  src="/closing-illustration.png"
                  alt=""
                  width={800}
                  height={600}
                  className="w-full h-auto max-w-2xl object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

