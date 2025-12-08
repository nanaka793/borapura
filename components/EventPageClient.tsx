'use client'

import { useState } from 'react'
import type { Post } from '@/lib/types'
import EventGridSection from './EventGridSection'
import EventHeader from './EventHeader'

interface EventPageClientProps {
  events: Post[]
  themeColor?: string
}

export default function EventPageClient({ events, themeColor }: EventPageClientProps) {
  const [showActiveOnly, setShowActiveOnly] = useState(false)

  const handleFilterChange = (value: boolean) => {
    setShowActiveOnly(value)
  }

  return (
    <>
      <EventHeader onFilterChange={handleFilterChange} themeColor={themeColor} />
      {events.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
          <p className="text-gray-500">
            現在募集中のイベントはありません。少し時間をおいて再度ご確認ください。
          </p>
        </div>
      ) : (
        <EventGridSection posts={events} showActiveOnly={showActiveOnly} themeColor={themeColor} />
      )}
    </>
  )
}

