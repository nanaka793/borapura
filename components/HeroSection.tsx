'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState({
    palmTree: false,
    yellowBoat: false,
    whiteBoat: false,
    logo: false,
    text: false,
  })

  useEffect(() => {
    // 順番にアニメーションを開始
    const timer1 = setTimeout(() => setIsVisible((prev) => ({ ...prev, palmTree: true })), 200)
    const timer2 = setTimeout(() => setIsVisible((prev) => ({ ...prev, yellowBoat: true })), 600)
    const timer3 = setTimeout(() => setIsVisible((prev) => ({ ...prev, whiteBoat: true })), 1000)
    const timer4 = setTimeout(() => setIsVisible((prev) => ({ ...prev, logo: true })), 1400)
    const timer5 = setTimeout(() => setIsVisible((prev) => ({ ...prev, text: true })), 1800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timer5)
    }
  }, [])

  return (
    <section className="relative w-full min-h-[600px] md:min-h-[700px] overflow-hidden">
      {/* 背景画像（2枚目の画像） */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* アニメーション要素 */}
      <div className="relative z-10 h-100vh min-h-[600px] md:min-h-[700px] flex items-center justify-center">
        <div className="container mx-auto px-4 relative w-full md:min-h-[700px]">
          {/* ロゴ（中央上部） */}
          <div
            className={`absolute top-[38%] -translate-y-1/2 left-1/2 -translate-x-1/2 transition-all duration-700 ${
              isVisible.logo
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-75'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <Image
              src="/borapura-logo.png"
              alt="ぼらぷら"
              width={390}
              height={130}
              className="h-auto w-[15.6rem] md:w-[20.8rem]"
            />
          </div>

          {/* Volunteer Platform テキスト（ロゴの下） */}
          <div
            className={`absolute top-[45%] -translate-y-1/2 left-1/2 -translate-x-1/2 transition-all duration-700 ${
              isVisible.text
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <p className="text-gray-700 text-sm md:text-base font-semibold tracking-wide">
              Volunteer Platform
            </p>
          </div>

          {/* ヤシの木（左側、海と空の境目） */}
          <div
            className={`absolute left-[12%] top-[55%] -translate-y-1/2 transition-all duration-700 ${
              isVisible.palmTree
                ? 'opacity-100 translate-y-[-50%]'
                : 'opacity-0 translate-y-[-30%]'
            }`}
            style={{ transitionDelay: '1000ms' }}
          >
            <Image
              src="/palm-tree.png"
              alt="ヤシの木"
              width={390}
              height={585}
              className="h-auto w-[15.6rem] md:w-[27rem]"
            />
          </div>

          {/* 黄色のヨット（中央左、海と空の境目） */}
          <div
            className={`absolute left-[38%] top-[66%] -translate-y-1/2 transition-all duration-700 ${
              isVisible.yellowBoat
                ? 'opacity-100 translate-y-[-60%]'
                : 'opacity-0 translate-y-[-30%]'
            }`}
            style={{ transitionDelay: '1400ms' }}
          >
            <Image
              src="/yellow-boat.png"
              alt="黄色のヨット"
              width={292}
              height={292}
              className="h-auto w-[11.7rem] md:w-[15.6rem]"
            />
          </div>

          {/* 白色のヨット（中央右、海と空の境目） */}
          <div
            className={`absolute right-[10%] top-[66%] -translate-y-1/2 transition-all duration-700 ${
              isVisible.whiteBoat
                ? 'opacity-100 translate-y-[-50%]'
                : 'opacity-0 translate-y-[-30%]'
            }`}
            style={{ transitionDelay: '1800ms' }}
          >
            <Image
              src="/white-boat.png"
              alt="白色のヨット"
              width={292}
              height={292}
              className="h-auto w-[11.7rem] md:w-[22.5rem]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

