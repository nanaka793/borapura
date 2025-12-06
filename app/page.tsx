import Image from 'next/image'
import { getPosts, getUsers, getRecruitmentPosts, getTopics } from '@/lib/data'
import { getCurrentUser } from '@/lib/auth'
import HeroSection from '@/components/HeroSection'
import AdventureDiarySection from '@/components/AdventureDiarySection'
import RecruitmentSection from '@/components/RecruitmentSection'
import TavernSection from '@/components/TavernSection'
import AdventurerListSection from '@/components/AdventurerListSection'
import MyPageSection from '@/components/MyPageSection'

export default async function Home() {
  const [posts, recruitmentPosts, users, currentUser, topics] = await Promise.all([
    getPosts(),
    getRecruitmentPosts(),
    getUsers(),
    getCurrentUser(),
    getTopics(true), // アクティブなトピックのみ取得
  ])
  const activityPosts = posts.filter((post) => post.type !== '募集投稿')

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

      {/* ボランティア募集の新着セクション */}
      <RecruitmentSection posts={recruitmentPosts} users={users} />

      {/* 冒険者の酒場セクション */}
      <TavernSection topics={topics} />

      {/* 冒険者リストセクション */}
      <AdventurerListSection 
        users={users.map((user) => ({
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          headline: user.headline,
          location: user.location,
          postCount: posts.filter((p) => p.authorId === user.id || p.author === user.name).length,
        }))}
        currentUserPostCount={currentUser ? posts.filter((p) => p.authorId === currentUser.id || p.author === currentUser.name).length : undefined}
      />

      {/* マイページ誘導セクション */}
      <MyPageSection 
        currentUser={currentUser ? { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar } : null}
      />
    </div>
  )
}

