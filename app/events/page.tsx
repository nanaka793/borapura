import { getRecruitmentPosts } from '@/lib/data'
import EventGridSection from '@/components/EventGridSection'
import EventHeader from '@/components/EventHeader'
import EventPageClient from '@/components/EventPageClient'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const events = await getRecruitmentPosts()

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <EventPageClient events={events} />
      </div>
    </div>
  )
}

