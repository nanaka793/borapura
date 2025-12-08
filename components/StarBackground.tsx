'use client'

import { useState, useEffect } from 'react'

export default function StarBackground() {
  const [stars, setStars] = useState<Array<{
    left: number
    top: number
    width: number
    height: number
    opacity: number
    delay: number
    duration: number
  }>>([])

  useEffect(() => {
    // クライアント側でのみランダム値を生成
    setStars(
      [...Array(300)].map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        width: Math.random() * 3 + 1,
        height: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        delay: Math.random() * 3,
        duration: Math.random() * 2 + 2,
      }))
    )
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.width}px`,
            height: `${star.height}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`
          }}
        />
      ))}
    </div>
  )
}

