'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

export default function CanDoSection() {
  const [rotation, setRotation] = useState(0)
  const [translateY, setTranslateY] = useState(-200)
  const [opacity, setOpacity] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const animationRef = useRef<number | null>(null)
  const currentValuesRef = useRef({ rotation: 0, translateY: -200, opacity: 0 })

  useEffect(() => {
    // モバイル判定
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // モバイルの場合は初期状態を設定
      if (mobile) {
        setRotation(0)
        setTranslateY(-200)
        setOpacity(0)
      } else {
        setRotation(-2)
        setTranslateY(0)
        setOpacity(1)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return

    // PC版ではアニメーションを無効化
    if (!isMobile) {
      setIsVisible(true)
      return
    }

    // Intersection Observerでセクションに入ったらアニメーション開始
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          } else {
            // セクションから出たら元に戻す
            setIsVisible(false)
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(sectionRef.current)

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [isMobile])

  // 状態更新時にrefも更新
  useEffect(() => {
    currentValuesRef.current = { rotation, translateY, opacity }
  }, [rotation, translateY, opacity])

  useEffect(() => {
    if (!isMobile) return

    // 既存のアニメーションをキャンセル
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    // 現在の値を開始値として取得
    const startRotation = currentValuesRef.current.rotation
    const startTranslateY = currentValuesRef.current.translateY
    const startOpacity = currentValuesRef.current.opacity

    // アニメーション実行
    if (isVisible) {
      // イン: 90度右回転しながら落下
      const duration = 1000 // 1秒
      const startTime = Date.now()
      const targetRotation = 90
      const targetTranslateY = 0
      const targetOpacity = 1
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // ease-out-cubicで柔らかく
        const easeOut = 1 - Math.pow(1 - progress, 3)
        
        // 回転: 開始角度から90度へ（右回転）
        const newRotation = startRotation + (targetRotation - startRotation) * easeOut
        setRotation(newRotation)
        currentValuesRef.current.rotation = newRotation
        
        // 落下: 上から下へ（開始位置から0pxへ）
        // 軽いバウンス効果を追加
        let fallProgress = easeOut
        if (progress > 0.6) {
          // 着地時の軽いバウンス
          const bounceProgress = (progress - 0.6) / 0.4
          const bounce = Math.sin(bounceProgress * Math.PI * 2) * 0.1 * (1 - bounceProgress)
          fallProgress = easeOut + bounce
        }
        const newTranslateY = startTranslateY + (targetTranslateY - startTranslateY) * fallProgress
        setTranslateY(newTranslateY)
        currentValuesRef.current.translateY = newTranslateY
        
        // フェードイン
        const newOpacity = startOpacity + (targetOpacity - startOpacity) * easeOut
        setOpacity(newOpacity)
        currentValuesRef.current.opacity = newOpacity
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          animationRef.current = null
        }
      }
      
      animationRef.current = requestAnimationFrame(animate)
    } else {
      // アウト: 元の位置に戻る
      const duration = 800 // 0.8秒
      const startTime = Date.now()
      const targetRotation = 0
      const targetTranslateY = -200
      const targetOpacity = 0
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // ease-in-cubicで柔らかく戻る
        const easeIn = Math.pow(progress, 3)
        
        // 回転: 現在の角度から0度へ
        const newRotation = startRotation + (targetRotation - startRotation) * easeIn
        setRotation(newRotation)
        currentValuesRef.current.rotation = newRotation
        
        // 位置: 現在の位置から上へ
        const newTranslateY = startTranslateY + (targetTranslateY - startTranslateY) * easeIn
        setTranslateY(newTranslateY)
        currentValuesRef.current.translateY = newTranslateY
        
        // フェードアウト
        const newOpacity = startOpacity + (targetOpacity - startOpacity) * easeIn
        setOpacity(newOpacity)
        currentValuesRef.current.opacity = newOpacity
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          animationRef.current = null
          // アニメーション完了後、初期状態にリセット
          setRotation(0)
          setTranslateY(-200)
          setOpacity(0)
          currentValuesRef.current = { rotation: 0, translateY: -200, opacity: 0 }
        }
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [isVisible, isMobile])

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
        <div className={`container mx-auto w-full ${isMobile ? 'px-2' : 'px-4'}`}>
          <div className={`mx-auto flex flex-col items-center justify-center gap-8 ${isMobile ? 'max-w-full w-full' : 'max-w-4xl'}`}>
            {/* 手紙のような白い背景（画像のみ） */}
            <div 
              ref={imageRef}
              className={`bg-white rounded-lg shadow-2xl p-4 md:p-8 lg:p-10 ${
                isMobile ? 'w-full' : 'md:rotate-[-2deg] md:transition-transform md:duration-300 md:hover:rotate-[-1deg]'
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
              <Image
                src="/closing-illustration.png"
                alt=""
                width={800}
                height={600}
                className={`w-full h-auto object-contain ${isMobile ? 'max-w-full' : 'max-w-4xl'}`}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

