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

  const [canSway, setCanSway] = useState({
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

    // ポップアップアニメーション完了後に波のアニメーションを開始
    // ヤシの木: 200ms + 700ms = 900ms
    const swayTimer1 = setTimeout(() => setCanSway((prev) => ({ ...prev, palmTree: true })), 900)
    // 黄色のヨット: 600ms + 700ms = 1300ms
    const swayTimer2 = setTimeout(() => setCanSway((prev) => ({ ...prev, yellowBoat: true })), 1300)
    // 白色のヨット: 1000ms + 700ms = 1700ms
    const swayTimer3 = setTimeout(() => setCanSway((prev) => ({ ...prev, whiteBoat: true })), 1700)
    // ロゴ: 1400ms + 700ms = 2100ms
    const swayTimer4 = setTimeout(() => setCanSway((prev) => ({ ...prev, logo: true })), 2100)
    // テキスト: 1800ms + 700ms = 2500ms
    const swayTimer5 = setTimeout(() => setCanSway((prev) => ({ ...prev, text: true })), 2500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timer5)
      clearTimeout(swayTimer1)
      clearTimeout(swayTimer2)
      clearTimeout(swayTimer3)
      clearTimeout(swayTimer4)
      clearTimeout(swayTimer5)
    }
  }, [])

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* 背景画像 - 縦を画面いっぱいに広げ、はみ出た横をカット */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          priority
          className="object-cover"
          style={{ objectPosition: 'center' }}
        />
      </div>

      {/* アニメーション要素 */}
      <div className="relative z-10" style={{ height: '100vh', width: '100%' }}>
        {/* ロゴ（画面中央より少し上） */}
        <div
          className={`absolute top-[40%] sm:top-[35%] md:top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
            isVisible.logo
              ? `opacity-100 scale-100 ${canSway.logo ? 'animate-wind-sway' : ''}`
              : 'opacity-0 scale-75'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <Image
            src="/borapura-logo.png"
            alt="ぼらぷら"
            width={390}
            height={130}
            className="h-auto w-[12rem] sm:w-[15.6rem] md:w-[18rem] lg:w-[22rem] xl:w-[26rem] 2xl:w-[30rem]"
          />
        </div>

        {/* Volunteer Platform テキスト（ロゴの下） */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 transition-all duration-700 top-[calc(40%+3rem)] md:top-[calc(40%+2rem)] ${
            isVisible.text
              ? `opacity-100 translate-y-0 ${canSway.text ? 'animate-wind-sway-text' : ''}`
              : 'opacity-0 translate-y-4'
          }`}
          style={{ 
            transitionDelay: '600ms'
          }}
        >
          <p className="text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-semibold tracking-wide">
            Volunteer Platform
          </p>
        </div>

        {/* ヤシの木（左側、海と空の境目） */}
        <div
          className={`absolute left-[8%] sm:left-[10%] md:left-[12%] top-[58%] sm:top-[60%] -translate-y-1/2 transition-all duration-700 ${
            isVisible.palmTree
              ? `opacity-100 ${canSway.palmTree ? 'animate-wave-sway-50' : ''}`
              : 'opacity-0 translate-y-[-30%]'
          }`}
          style={{ transitionDelay: '1000ms' }}
        >
          <Image
            src="/palm-tree.png"
            alt="ヤシの木"
            width={390}
            height={585}
            className="h-auto w-[10rem] sm:w-[12rem] md:w-[18rem] lg:w-[24rem] xl:w-[27rem] 2xl:w-[32rem]"
          />
        </div>

        {/* 黄色のヨット（中央左、海と空の境目） */}
        <div
          className={`absolute left-[32%] sm:left-[35%] md:left-[38%] top-[63%] sm:top-[65%] -translate-y-1/2 transition-all duration-700 ${
            isVisible.yellowBoat
              ? `opacity-100 ${canSway.yellowBoat ? 'animate-wave-sway-60' : ''}`
              : 'opacity-0 translate-y-[-30%]'
          }`}
          style={{ transitionDelay: '1400ms' }}
        >
          <Image
            src="/yellow-boat.png"
            alt="黄色のヨット"
            width={292}
            height={292}
            className="h-auto w-[8rem] sm:w-[10rem] md:w-[13rem] lg:w-[15.6rem] xl:w-[18rem] 2xl:w-[22rem]"
          />
        </div>

        {/* 白色のヨット（中央右、海と空の境目） */}
        <div
          className={`absolute right-[8%] sm:right-[9%] md:right-[10%] top-[63%] sm:top-[65%] -translate-y-1/2 transition-all duration-700 ${
            isVisible.whiteBoat
              ? `opacity-100 ${canSway.whiteBoat ? 'animate-wave-sway-50' : ''}`
              : 'opacity-0 translate-y-[-30%]'
          }`}
          style={{ transitionDelay: '1800ms' }}
        >
          <Image
            src="/white-boat.png"
            alt="白色のヨット"
            width={292}
            height={292}
            className="h-auto w-[8rem] sm:w-[10rem] md:w-[15rem] lg:w-[20rem] xl:w-[22.5rem] 2xl:w-[26rem]"
          />
        </div>
      </div>
    </section>
  )
}

