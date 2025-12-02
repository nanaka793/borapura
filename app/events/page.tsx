import Link from 'next/link'
import { getRecruitmentPosts } from '@/lib/data'
import EventGridSection from '@/components/EventGridSection'

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const events = await getRecruitmentPosts()

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-5xl">
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
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/events/new"
              className="rounded-full bg-primary-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-primary-700"
            >
              募集を掲載する
            </Link>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
            <p className="text-gray-500">
              現在募集中のイベントはありません。少し時間をおいて再度ご確認ください。
            </p>
          </div>
        ) : (
          <EventGridSection posts={events} />
        )}
      </div>
    </div>
  )
}

