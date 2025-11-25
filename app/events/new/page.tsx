import EventForm from '@/components/EventForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function NewEventPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="rounded-3xl bg-gradient-to-r from-primary-600 to-blue-500 p-10 text-white shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
            Volunteer Opportunity
          </p>
          <h1 className="mt-3 text-4xl font-bold">ボランティア募集を掲載する</h1>
          <p className="mt-4 text-lg text-white/90">
            開催予定のイベントや人手が必要な活動を募集しましょう。応募者が連絡しやすいよう、詳細を丁寧にご記入ください。
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/events"
              className="rounded-full border border-white/40 px-5 py-2 font-semibold text-white hover:bg-white/10"
            >
              一覧へ戻る
            </Link>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-10 shadow-xl">
          <EventForm />
        </div>
      </div>
    </div>
  )
}

