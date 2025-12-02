'use client'

import { useState, useRef, useEffect } from 'react'

interface AdventureSliderProps {
  label: string
  leftLabel: string
  rightLabel: string
  value: number
  onChange: (value: number) => void
  className?: string
}

export default function AdventureSlider({
  label,
  leftLabel,
  rightLabel,
  value,
  onChange,
  className = '',
}: AdventureSliderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const MIN_VALUE = 0
  const MAX_VALUE = 6

  // マウス/タッチ位置から値を計算（滑らかな連続値）
  const getValueFromPosition = (clientX: number): number => {
    if (!sliderRef.current) return value
    const rect = sliderRef.current.getBoundingClientRect()
    const HANDLE_RADIUS = 12 // ハンドルの半径（24px / 2）
    // ハンドルの中心が移動可能な範囲（左右に12pxずつのマージン）
    const usableStart = rect.left + HANDLE_RADIUS
    const usableEnd = rect.right - HANDLE_RADIUS
    const usableWidth = usableEnd - usableStart
    
    // クリック位置を利用可能な範囲にマッピング
    const positionInUsableRange = Math.max(0, Math.min(usableWidth, clientX - usableStart))
    const percentage = usableWidth > 0 ? positionInUsableRange / usableWidth : 0
    
    // 小数点を含む連続値を返す（滑らかな移動）
    const smoothValue = percentage * (MAX_VALUE - MIN_VALUE)
    return Math.max(MIN_VALUE, Math.min(MAX_VALUE, smoothValue))
  }

  // マウスダウン
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    const newValue = getValueFromPosition(e.clientX)
    onChange(newValue)
  }

  // タッチ開始
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
    const touch = e.touches[0]
    const newValue = getValueFromPosition(touch.clientX)
    onChange(newValue)
  }

  // ドラッグ中の処理
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const newValue = getValueFromPosition(e.clientX)
      onChange(newValue)
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const newValue = getValueFromPosition(touch.clientX)
      onChange(newValue)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, value, onChange])

  // パーセンテージを計算（0-100%）
  const percentage = (value / (MAX_VALUE - MIN_VALUE)) * 100

  return (
    <div className={`mb-6 ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 mb-4">{label}</label>
      
      <div className="relative">
        {/* スライダートラック */}
        <div
          ref={sliderRef}
          className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* スライダーハンドル */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-primary-500 rounded-full cursor-grab active:cursor-grabbing shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-150 z-10"
            style={{ 
              left: `calc(12px + (100% - 24px) * ${percentage} / 100)`,
              transition: isDragging ? 'none' : 'left 0.1s ease-out, transform 0.15s ease-out'
            }}
          />
        </div>
      </div>

      {/* ラベル */}
      <div className="flex justify-between mt-3 text-sm text-gray-600">
        <span className="text-left">{leftLabel}</span>
        <span className="text-right">{rightLabel}</span>
      </div>
    </div>
  )
}
