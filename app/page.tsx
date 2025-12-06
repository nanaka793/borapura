import Image from 'next/image'
import Link from 'next/link'
import { getPosts, getUsers, getRecruitmentPosts } from '@/lib/data'
import EventCard from '@/components/EventCard'
import PostGalleryCard from '@/components/PostGalleryCard'
import { getCurrentUser } from '@/lib/auth'
import HeroSection from '@/components/HeroSection'
import AdventureDiarySection from '@/components/AdventureDiarySection'

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
  const [posts, recruitmentPosts, users, currentUser] = await Promise.all([
    getPosts(),
    getRecruitmentPosts(),
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
  const activityPosts = posts.filter((post) => post.type !== '募集投稿')
  const featuredPosts = activityPosts.slice(0, 3)
  const upcomingEvents = recruitmentPosts.slice(0, 2)

  return (
    <div>
      {/* ヒーロー画面 */}
      <HeroSection />

      {/* このサイトへの想いセクション */}
      <section className="relative w-full overflow-hidden">
        {/* 背景画像 - 横幅いっぱいに表示、上端をヒーロー画面の下端に揃える */}
        <div className="relative w-full" style={{ aspectRatio: 'auto' }}>
          <Image
            src="/beach-bg.png"
            alt=""
            width={1920}
            height={1080}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        {/* コンテンツ - 背景画像の上に重ねる */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="container mx-auto px-4 w-full">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-textmain mb-6 text-center">
                このサイトへの想い
              </h2>
              <div className="bg-white/90 rounded-lg p-8 md:p-12 shadow-lg">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed whitespace-pre-wrap">
                ここにこのサイトへの想いを記述します。
                ボランティア活動を通じて、多くの人々がつながり、共に成長していく場を作りたいという想いを込めています。
                一人ひとりの小さなアクションが、大きな変化につながることを信じています。
              </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* このサイトでできることセクション */}
      <section className="relative w-full overflow-hidden">
        {/* 背景画像 - 横幅いっぱいに表示、上端を前のセクションの下端に揃える */}
        <div className="relative w-full">
          <Image
            src="/beach-elements-bg.png"
            alt=""
            width={1920}
            height={1080}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        {/* コンテンツ - 背景画像の上に重ねる */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="container mx-auto px-4 w-full">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-textmain mb-8 text-center">
                このサイトでできること
              </h2>
              <div className="bg-white/90 rounded-lg p-8 md:p-12 shadow-lg">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold text-primary-600 mb-3">
                      冒険日誌を書く
                    </h3>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      ボランティア活動の記録や体験を投稿できます。写真やメモを添えて、あなたの冒険を共有しましょう。
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold text-primary-600 mb-3">
                      ボランティア募集を探す
                    </h3>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      地域のボランティア活動やイベントを探して、参加したい活動を見つけることができます。
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold text-primary-600 mb-3">
                      冒険者の酒場で交流
                    </h3>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      週替わりのテーマについて、みんなでコメントを残して交流を楽しめます。ボランティア参加の有無に関わらず、誰でも参加できます。
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold text-primary-600 mb-3">
                      冒険者同士でつながる
                    </h3>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      他のユーザーのプロフィールを閲覧したり、友達として登録して、活動の輪を広げることができます。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 冒険マップセクション */}
      <section className="relative w-full overflow-hidden">
        {/* 背景画像 - 横幅いっぱいに表示、上端を前のセクションの下端に揃える */}
        <div className="relative w-full">
          <Image
            src="/map-bg.png"
            alt=""
            width={1920}
            height={1080}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        {/* コンテンツ - 背景画像の上に重ねる */}
        <div className="absolute inset-0 z-10 flex items-center justify-center py-12 md:py-16">
          <div className="container mx-auto px-4 w-full">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-textmain mb-8 md:mb-12 text-center">
                冒険マップ
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                {/* 教育 */}
                <div className="bg-white/95 rounded-lg p-3 md:p-5 shadow-lg border-2 border-primary-200 hover:border-primary-400 transition-all">
                  <div className="text-2xl md:text-3xl mb-1.5 text-center">📖</div>
                  <h3 className="text-base md:text-lg font-bold text-primary-700 text-center mb-1.5">
                    教育
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 text-center">
                    学びの賢者
                  </p>
                </div>

                {/* 子ども */}
                <div className="bg-white/95 rounded-lg p-3 md:p-5 shadow-lg border-2 border-primary-200 hover:border-primary-400 transition-all">
                  <div className="text-2xl md:text-3xl mb-1.5 text-center">🛡️</div>
                  <h3 className="text-base md:text-lg font-bold text-primary-700 text-center mb-1.5">
                    子ども
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 text-center">
                    未来の勇者の守り手
                  </p>
                </div>

                {/* 国際協力 */}
                <div className="bg-white/95 rounded-lg p-3 md:p-5 shadow-lg border-2 border-primary-200 hover:border-primary-400 transition-all">
                  <div className="text-2xl md:text-3xl mb-1.5 text-center">🌏</div>
                  <h3 className="text-base md:text-lg font-bold text-primary-700 text-center mb-1.5">
                    国際協力
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 text-center">
                    世界橋渡しの旅人
                  </p>
                </div>

                {/* 環境保護 */}
                <div className="bg-white/95 rounded-lg p-3 md:p-5 shadow-lg border-2 border-primary-200 hover:border-primary-400 transition-all">
                  <div className="text-2xl md:text-3xl mb-1.5 text-center">🌳</div>
                  <h3 className="text-base md:text-lg font-bold text-primary-700 text-center mb-1.5">
                    環境保護
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 text-center">
                    エコレンジャー
                  </p>
                </div>

                {/* 福祉 */}
                <div className="bg-white/95 rounded-lg p-3 md:p-5 shadow-lg border-2 border-primary-200 hover:border-primary-400 transition-all">
                  <div className="text-2xl md:text-3xl mb-1.5 text-center">💝</div>
                  <h3 className="text-base md:text-lg font-bold text-primary-700 text-center mb-1.5">
                    福祉
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 text-center">
                    やさしさの司祭
                  </p>
                </div>

                {/* 災害支援 */}
                <div className="bg-white/95 rounded-lg p-3 md:p-5 shadow-lg border-2 border-primary-200 hover:border-primary-400 transition-all">
                  <div className="text-2xl md:text-3xl mb-1.5 text-center">🚒</div>
                  <h3 className="text-base md:text-lg font-bold text-primary-700 text-center mb-1.5">
                    災害支援
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 text-center">
                    救援レスキュー
                  </p>
                </div>

                {/* 地域活動 */}
                <div className="bg-white/95 rounded-lg p-3 md:p-5 shadow-lg border-2 border-primary-200 hover:border-primary-400 transition-all">
                  <div className="text-2xl md:text-3xl mb-1.5 text-center">🏘️</div>
                  <h3 className="text-base md:text-lg font-bold text-primary-700 text-center mb-1.5">
                    地域活動
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 text-center">
                    ローカルガーディアン
                  </p>
                </div>

                {/* 医療・健康 */}
                <div className="bg-white/95 rounded-lg p-3 md:p-5 shadow-lg border-2 border-primary-200 hover:border-primary-400 transition-all">
                  <div className="text-2xl md:text-3xl mb-1.5 text-center">🌱</div>
                  <h3 className="text-base md:text-lg font-bold text-primary-700 text-center mb-1.5">
                    医療・健康
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 text-center">
                    癒しの治癒師
                  </p>
                </div>

                {/* スポーツ */}
                <div className="bg-white/95 rounded-lg p-3 md:p-5 shadow-lg border-2 border-primary-200 hover:border-primary-400 transition-all">
                  <div className="text-2xl md:text-3xl mb-1.5 text-center">👟</div>
                  <h3 className="text-base md:text-lg font-bold text-primary-700 text-center mb-1.5">
                    スポーツ
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 text-center">
                    アクションランナー
                  </p>
                </div>

                {/* 文化 */}
                <div className="bg-white/95 rounded-lg p-3 md:p-5 shadow-lg border-2 border-primary-200 hover:border-primary-400 transition-all">
                  <div className="text-2xl md:text-3xl mb-1.5 text-center">✏️</div>
                  <h3 className="text-base md:text-lg font-bold text-primary-700 text-center mb-1.5">
                    文化
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 text-center">
                    文化の旅人
                  </p>
                </div>

                {/* イベント */}
                <div className="bg-white/95 rounded-lg p-3 md:p-5 shadow-lg border-2 border-primary-200 hover:border-primary-400 transition-all">
                  <div className="text-2xl md:text-3xl mb-1.5 text-center">🌝</div>
                  <h3 className="text-base md:text-lg font-bold text-primary-700 text-center mb-1.5">
                    イベント
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-600 text-center">
                    イベントマエストロ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 冒険日誌の新着セクション */}
      <AdventureDiarySection posts={activityPosts} users={users} />

      {/* 既存のコンテンツ */}
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
              冒険日誌を読む
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
          <h2 className="text-3xl font-bold">冒険日誌ページへ</h2>
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
                新着の冒険日誌
              </h2>
            </div>
            <Link
              href="/posts"
              className="text-sm font-semibold text-primary-700 hover:text-primary-800"
            >
              すべて見る →
            </Link>
          </div>
          {featuredPosts.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-gray-50 p-6 text-center text-gray-500">
              まだ冒険日誌がありません。最初の投稿をしてみましょう！
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
                  showTypeBadge={false}
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
              <EventCard key={event.id} post={event} />
            ))}
          </div>
        )}
      </section>

      {/* 冒険者の酒場 CTA */}
      <section className="mt-12 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold">冒険者の酒場</h2>
        <p className="mt-4 text-white/90">
          ボランティア参加の有無に関わらず、みんなでテーマについて語り合いましょう。週替わりのテーマにコメントを残して、他の冒険者との交流を楽しんでください。
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/topics"
            className="rounded-full bg-white/90 px-6 py-3 font-semibold text-amber-700 hover:bg-white"
          >
            酒場に行く
          </Link>
          <Link
            href="/topics"
            className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10"
          >
            テーマを見る
          </Link>
        </div>
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
    </div>
  )
}

