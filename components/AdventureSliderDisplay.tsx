'use client'

interface AdventureSliderDisplayProps {
  label: string
  leftLabel: string
  rightLabel: string
  value: number
  className?: string
}

export default function AdventureSliderDisplay({
  label,
  leftLabel,
  rightLabel,
  value,
  className = '',
}: AdventureSliderDisplayProps) {
  const MIN_VALUE = 0
  const MAX_VALUE = 6

  // パーセンテージを計算（0-100%）
  const percentage = (value / (MAX_VALUE - MIN_VALUE)) * 100

  return (
    <div className={`mb-6 ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 mb-4">{label}</label>
      
      <div className="relative">
        {/* スライダートラック */}
        <div className="relative h-2 bg-gray-200 rounded-full">
          {/* スライダーハンドル */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-primary-500 rounded-full shadow-lg z-10"
            style={{ 
              left: `calc(12px + (100% - 24px) * ${percentage} / 100)`
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
