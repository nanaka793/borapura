'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface AdventureMapSectionProps {
  children: ReactNode
}

export default function AdventureMapSection({ children }: AdventureMapSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            // 一度表示されたら監視を停止
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1, // 10%が見えたら発火
        rootMargin: '0px 0px -50px 0px', // 少し早めに発火
      }
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

  return (
    <section ref={sectionRef} className="adventure-map-section md:pb-36" style={{ backgroundColor: '#EAE4D8' }}>
      {children}
    </section>
  )
}

