import Image from 'next/image'
import Link from 'next/link'
import { getPosts, getEvents, getUsers } from '@/lib/data'
import EventCard from '@/components/EventCard'
import PostGalleryCard from '@/components/PostGalleryCard'
import { getCurrentUser } from '@/lib/auth'

const HERO_STORIES = [
  {
    title: '想いをつなげる、ボランティアの輪',
    message:
      '一人の小さなアクションが、地域や社会を大きく動かします。活動の背景にある“想い”を伝え合い、次の一歩を後押ししましょう。',
    image:
      'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
    highlight: 'Shared Missions',
  },
  {
    title: 'わたしの記録が、誰かのきっかけに',
    message:
      '現場で得た学びや気づきをシェアすることで、まだ見ぬ仲間とつながり、活動の輪が広がっていきます。',
    image:
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    highlight: 'Community Stories',
  },
  {
    title: '暮らしの中に、ボランティアという選択肢を',
    message:
      '仕事や学業と両立できる短時間の参加から、専門性を活かす長期プログラムまで。自分らしい関わり方を見つけましょう。',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    highlight: 'Everyday Impact',
  },
]

export default async function Home() {
  const [posts, events, users, currentUser] = await Promise.all([
    getPosts(),
    getEvents(),
    getUsers(),
    getCurrentUser(),
  ])
  const userMap = users.reduce<Record<string, (typeof users)[number]>>((acc, user) => {
    acc[user.id] = user
    return acc
  }, {})
  const userNameMap = users.reduce<Record<string, (typeof users)[number]>>((acc, user) => {
    acc[user.name.toLowerCase()] = user
    return acc
  }, {})
  const hero =
    HERO_STORIES[new Date().getDate() % HERO_STORIES.length] || HERO_STORIES[0]
  const featuredPosts = posts.slice(0, 3)
  const upcomingEvents = events.slice(0, 2)

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero */}
      <section className="grid gap-10 rounded-[32px] bg-white/80 p-8 shadow-xl ring-1 ring-primary-100 backdrop-blur md:grid-cols-2">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">
            {hero.highlight}
          </span>
          <h1 className="text-4xl font-bold leading-tight text-gray-900">
            {hero.title}
          </h1>
          <p className="text-lg text-gray-600">{hero.message}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/posts"
              className="rounded-full bg-primary-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-primary-700"
            >
              活動記録を読む
            </Link>
            <Link
              href="/events"
              className="rounded-full border border-primary-200 px-6 py-3 font-semibold text-primary-700 hover:bg-primary-50"
            >
              募集中のイベントを見る
            </Link>
          </div>
        </div>
        <div className="relative min-h-[320px] overflow-hidden rounded-[24px]">
          <Image
            src={hero.image}
            alt={hero.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      </section>

      <section className="mt-12 rounded-3xl border border-dashed border-primary-200 bg-white/70 p-8 shadow-inner">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary-500">
          Tips
        </p>
        <h3 className="mt-2 text-2xl font-bold text-gray-900">3つの視点で伝える</h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-600">
          <li>活動の背景・目的</li>
          <li>現場での工夫や学び</li>
          <li>次への提案・募集したいこと</li>
        </ul>
        <p className="mt-4 text-sm text-gray-500">
          文章だけでなく、写真やメモでもOK。気軽に発信してみましょう。
        </p>
      </section>

      {/* Activity Records CTA + Latest posts */}
      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl bg-gradient-to-r from-primary-600 to-primary-500 p-8 text-white shadow-lg">
          <h2 className="text-3xl font-bold">活動記録ページへ</h2>
          <p className="mt-4 text-white/90">
            活動の準備、現場での気づき、達成感。あなたのストーリーが、これからの参加者の力になります。
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/posts/new"
              className="rounded-full bg-white/90 px-6 py-3 font-semibold text-primary-700 hover:bg-white"
            >
              活動を投稿する
            </Link>
            <Link
              href="/posts"
              className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              記録をもっと見る
            </Link>
          </div>
        </div>
        <div className="rounded-3xl bg-white/80 p-8 shadow-lg ring-1 ring-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">
                Latest Entries
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                新着の活動記録
              </h2>
            </div>
            <Link
              href="/posts"
              className="text-sm font-semibold text-primary-700 hover:text-primary-800"
            >
              すべて見る →
            </Link>
          </div>
          {posts.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-gray-50 p-6 text-center text-gray-500">
              まだ活動記録がありません。最初の投稿をしてみましょう！
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {featuredPosts.map((post) => (
                <PostGalleryCard
                  key={post.id}
                  post={post}
                  authorAvatar={
                    userMap[post.authorId]?.avatar ??
                    userNameMap[post.author.toLowerCase()]?.avatar
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Volunteer recruitment */}
      <section className="mt-12 rounded-3xl bg-white/80 p-8 shadow-lg ring-1 ring-gray-100">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">
              Upcoming Events
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              ボランティア募集ページ
            </h2>
            <p className="mt-2 text-gray-600">
              近日開催予定のイベントをピックアップしています。気になる活動は詳細ページで確認しましょう。
            </p>
          </div>
          <Link
            href="/events"
            className="rounded-full border border-primary-200 px-5 py-2 font-semibold text-primary-700 hover:bg-primary-50"
          >
            募集一覧を見る
          </Link>
        </div>

        {upcomingEvents.length === 0 ? (
          <p className="rounded-2xl bg-gray-50 p-6 text-center text-gray-500">
            現在募集中のイベントはありません。
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* My Page CTA */}
      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl bg-gradient-to-r from-primary-50 to-blue-50 p-8 shadow-inner">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">
            Personal Hub
          </p>
          <h2 className="text-3xl font-bold text-gray-900">
            {currentUser ? `${currentUser.name} さんのマイページ` : 'マイページで活動を整理'}
          </h2>
          <p className="mt-4 text-gray-600">
            プロフィールや興味関心を設定し、自分の投稿をまとめて確認できます。イベント参加の記録や振り返りにも活用しましょう。
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href={currentUser ? '/mypage' : '/register'}
              className="rounded-full bg-primary-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-primary-700"
            >
              {currentUser ? 'マイページを開く' : 'マイページを作成'}
            </Link>
            {!currentUser && (
              <Link
                href="/login"
                className="rounded-full border border-primary-200 px-6 py-3 font-semibold text-primary-700 hover:bg-primary-50"
              >
                既存アカウントでログイン
              </Link>
            )}
          </div>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">できること</h3>
          <ul className="space-y-3 text-gray-600">
            <li>・ プロフィールや活動エリア、関心テーマを設定</li>
            <li>・ 自分の投稿だけを一覧で振り返り</li>
            <li>・ 次に参加したいイベントをブックマーク予定</li>
          </ul>
          <div className="mt-6 rounded-2xl bg-primary-50 p-4 text-sm text-primary-700">
            IDとパスワードでログインできるので、どこからでもマイページにアクセスできます。
          </div>
        </div>
      </section>
    </div>
  )
}

