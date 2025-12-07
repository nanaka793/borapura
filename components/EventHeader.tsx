'use client'

import Link from 'next/link'
import { useState } from 'react'

interface EventHeaderProps {
  onFilterChange: (showActiveOnly: boolean) => void
}

export default function EventHeader({ onFilterChange }: EventHeaderProps) {
  const [showActiveOnly, setShowActiveOnly] = useState(false)

  const handleToggle = (value: boolean) => {
    setShowActiveOnly(value)
    onFilterChange(value)
  }

  return (
    <div className="mb-10 rounded-3xl bg-white p-8 shadow-lg">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">
        Volunteer Opportunities
      </p>
      <h1 className="text-4xl font-bold text-gray-900">
        ボランティア募集一覧
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        これから開催されるボランティアイベントの情報です。気になる活動を見つけたら、主催団体にお問い合わせください。
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {/* すべて表示 / 募集中のみフィルター */}
        <div className="relative inline-flex rounded-full border-2 border-primary-600 bg-white p-1">
          {/* スライドする背景 */}
          <div
            className={`absolute top-1 bottom-1 rounded-full bg-primary-600 shadow-sm transition-all duration-300 ease-in-out ${
              showActiveOnly ? 'left-1/2 right-1' : 'left-1 right-1/2'
            }`}
          />
          <button
            type="button"
            onClick={() => handleToggle(false)}
            className={`relative z-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
              !showActiveOnly
                ? 'text-white'
                : 'text-primary-600 hover:text-primary-700'
            }`}
          >
            すべて表示
          </button>
          <button
            type="button"
            onClick={() => handleToggle(true)}
            className={`relative z-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
              showActiveOnly
                ? 'text-white'
                : 'text-primary-600 hover:text-primary-700'
            }`}
          >
            募集中のみ
          </button>
        </div>
        <Link
          href="/events/new"
          className="rounded-full bg-primary-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-primary-700"
        >
          募集を掲載する
        </Link>
      </div>
    </div>
  )
}

