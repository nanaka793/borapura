import Image from 'next/image'
import { getPosts, getUsers, getRecruitmentPosts, getTopics } from '@/lib/data'
import { getCurrentUser } from '@/lib/auth'
import HeroSection from '@/components/HeroSection'
import ThoughtSection from '@/components/ThoughtSection'
import CanDoSection from '@/components/CanDoSection'
import AdventureDiarySection from '@/components/AdventureDiarySection'
import RecruitmentSection from '@/components/RecruitmentSection'
import TavernSection from '@/components/TavernSection'
import AdventurerListSection from '@/components/AdventurerListSection'
import MyPageSection from '@/components/MyPageSection'
import ClosingSection from '@/components/ClosingSection'
import AdventureMapSection from '@/components/AdventureMapSection'

// このページを動的レンダリングとして明示的に指定
export const dynamic = 'force-dynamic'

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
      <ThoughtSection />

      {/* このサイトでできることセクション */}
      <CanDoSection />

      {/* 冒険マップセクション */}
      <AdventureMapSection>
      <div id="adventure-map" className="relative w-full overflow-hidden py-12 md:py-0 md:pb-96" style={{ minHeight: '70vh', backgroundColor: '#EAE4D8' }}>

        {/* コンテンツ - 背景画像の上に重ねる */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container mx-auto px-4 w-full">
            <div className="max-w-5xl mx-auto w-full">
              <h2 className="text-3xl md:text-4xl font-bold text-textmain mb-2 md:mb-3 text-center">
                冒険MAP
              </h2>
              <p className="text-base md:text-lg text-textmain mb-4 md:mb-6 text-center">
                冒険者が活躍するさまざまなボランティア。<br />
                活動の報告数に応じて獲得できるバッジを確認！
              </p>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-0">
                {/* 教育 */}
                <div className="perspective-[1000px] aspect-[10/6] w-[90%] h-[90%] md:w-[75%] md:h-[75%] lg:w-[70%] lg:h-[70%] mx-auto group card-drop">
                  <div className="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:[transform:rotateY(180deg)]">
                    {/* 表面（白） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <h3 className="text-sm md:text-base font-bold text-center" style={{ color: '#3A1E13' }}>
                        教育
                      </h3>
                    </div>
                    {/* 裏面（グレー） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden rotate-y-180 flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <div className="text-lg md:text-xl mb-1 text-center">📖</div>
                      <p className="text-[7px] md:text-xs text-white text-center font-medium">
                        学びの賢者
                      </p>
                    </div>
                  </div>
                </div>

                {/* 子ども */}
                <div className="perspective-[1000px] aspect-[10/6] w-[90%] h-[90%] md:w-[75%] md:h-[75%] lg:w-[70%] lg:h-[70%] mx-auto group card-drop">
                  <div className="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:[transform:rotateY(180deg)]">
                    {/* 表面（白） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <h3 className="text-sm md:text-base font-bold text-center" style={{ color: '#3A1E13' }}>
                        子ども
                      </h3>
                    </div>
                    {/* 裏面（グレー） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden rotate-y-180 flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <div className="text-lg md:text-xl mb-1 text-center">🛡️</div>
                      <p className="text-[7px] md:text-xs text-white text-center font-medium">
                        未来の勇者の守り手
                      </p>
                    </div>
                  </div>
                </div>

                {/* 国際協力 */}
                <div className="perspective-[1000px] aspect-[10/6] w-[90%] h-[90%] md:w-[75%] md:h-[75%] lg:w-[70%] lg:h-[70%] mx-auto group card-drop">
                  <div className="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:[transform:rotateY(180deg)]">
                    {/* 表面（白） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <h3 className="text-sm md:text-base font-bold text-center" style={{ color: '#3A1E13' }}>
                        国際協力
                      </h3>
                    </div>
                    {/* 裏面（グレー） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden rotate-y-180 flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <div className="text-lg md:text-xl mb-1 text-center">🌏</div>
                      <p className="text-[7px] md:text-xs text-white text-center font-medium">
                        世界橋渡しの旅人
                      </p>
                    </div>
                  </div>
                </div>

                {/* 環境保護 */}
                <div className="perspective-[1000px] aspect-[10/6] w-[90%] h-[90%] md:w-[75%] md:h-[75%] lg:w-[70%] lg:h-[70%] mx-auto group card-drop">
                  <div className="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:[transform:rotateY(180deg)]">
                    {/* 表面（白） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <h3 className="text-sm md:text-base font-bold text-center" style={{ color: '#3A1E13' }}>
                        環境保護
                      </h3>
                    </div>
                    {/* 裏面（グレー） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden rotate-y-180 flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <div className="text-lg md:text-xl mb-1 text-center">🌳</div>
                      <p className="text-[7px] md:text-xs text-white text-center font-medium">
                        エコレンジャー
                      </p>
                    </div>
                  </div>
                </div>

                {/* 福祉 */}
                <div className="perspective-[1000px] aspect-[10/6] w-[90%] h-[90%] md:w-[75%] md:h-[75%] lg:w-[70%] lg:h-[70%] mx-auto group card-drop">
                  <div className="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:[transform:rotateY(180deg)]">
                    {/* 表面（白） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <h3 className="text-sm md:text-base font-bold text-center" style={{ color: '#3A1E13' }}>
                        福祉
                      </h3>
                    </div>
                    {/* 裏面（グレー） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden rotate-y-180 flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <div className="text-lg md:text-xl mb-1 text-center">💝</div>
                      <p className="text-[7px] md:text-xs text-white text-center font-medium">
                        やさしさの司祭
                      </p>
                    </div>
                  </div>
                </div>

                {/* 災害支援 */}
                <div className="perspective-[1000px] aspect-[10/6] w-[90%] h-[90%] md:w-[75%] md:h-[75%] lg:w-[70%] lg:h-[70%] mx-auto group card-drop">
                  <div className="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:[transform:rotateY(180deg)]">
                    {/* 表面（白） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <h3 className="text-sm md:text-base font-bold text-center" style={{ color: '#3A1E13' }}>
                        災害支援
                      </h3>
                    </div>
                    {/* 裏面（グレー） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden rotate-y-180 flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <div className="text-lg md:text-xl mb-1 text-center">🚒</div>
                      <p className="text-[7px] md:text-xs text-white text-center font-medium">
                        救援レスキュー
                      </p>
                    </div>
                  </div>
                </div>

                {/* 地域活動 */}
                <div className="perspective-[1000px] aspect-[10/6] w-[90%] h-[90%] md:w-[75%] md:h-[75%] lg:w-[70%] lg:h-[70%] mx-auto group card-drop">
                  <div className="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:[transform:rotateY(180deg)]">
                    {/* 表面（白） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <h3 className="text-sm md:text-base font-bold text-center" style={{ color: '#3A1E13' }}>
                        地域活動
                      </h3>
                    </div>
                    {/* 裏面（グレー） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden rotate-y-180 flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <div className="text-lg md:text-xl mb-1 text-center">🏘️</div>
                      <p className="text-[7px] md:text-xs text-white text-center font-medium">
                        ローカルガーディアン
                      </p>
                    </div>
                  </div>
                </div>

                {/* 医療・健康 */}
                <div className="perspective-[1000px] aspect-[10/6] w-[90%] h-[90%] md:w-[75%] md:h-[75%] lg:w-[70%] lg:h-[70%] mx-auto group card-drop">
                  <div className="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:[transform:rotateY(180deg)]">
                    {/* 表面（白） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <h3 className="text-sm md:text-base font-bold text-center" style={{ color: '#3A1E13' }}>
                        医療・健康
                      </h3>
                    </div>
                    {/* 裏面（グレー） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden rotate-y-180 flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <div className="text-lg md:text-xl mb-1 text-center">🌱</div>
                      <p className="text-[7px] md:text-xs text-white text-center font-medium">
                        癒しの治癒師
                      </p>
                    </div>
                  </div>
                </div>

                {/* スポーツ */}
                <div className="perspective-[1000px] aspect-[10/6] w-[90%] h-[90%] md:w-[75%] md:h-[75%] lg:w-[70%] lg:h-[70%] mx-auto group card-drop">
                  <div className="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:[transform:rotateY(180deg)]">
                    {/* 表面（白） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <h3 className="text-sm md:text-base font-bold text-center" style={{ color: '#3A1E13' }}>
                        スポーツ
                      </h3>
                    </div>
                    {/* 裏面（グレー） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden rotate-y-180 flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <div className="text-lg md:text-xl mb-1 text-center">👟</div>
                      <p className="text-[7px] md:text-xs text-white text-center font-medium">
                        アクションランナー
                      </p>
                    </div>
                  </div>
                </div>

                {/* 文化 */}
                <div className="perspective-[1000px] aspect-[10/6] w-[90%] h-[90%] md:w-[75%] md:h-[75%] lg:w-[70%] lg:h-[70%] mx-auto group card-drop">
                  <div className="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:[transform:rotateY(180deg)]">
                    {/* 表面（白） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <h3 className="text-sm md:text-base font-bold text-center" style={{ color: '#3A1E13' }}>
                        文化
                      </h3>
                    </div>
                    {/* 裏面（グレー） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden rotate-y-180 flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <div className="text-lg md:text-xl mb-1 text-center">✏️</div>
                      <p className="text-[7px] md:text-xs text-white text-center font-medium">
                        文化の旅人
                      </p>
                    </div>
                  </div>
                </div>

                {/* イベント */}
                <div className="perspective-[1000px] aspect-[10/6] w-[90%] h-[90%] md:w-[75%] md:h-[75%] lg:w-[70%] lg:h-[70%] mx-auto group card-drop">
                  <div className="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:[transform:rotateY(180deg)]">
                    {/* 表面（白） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <h3 className="text-sm md:text-base font-bold text-center" style={{ color: '#3A1E13' }}>
                        イベント
                      </h3>
                    </div>
                    {/* 裏面（グレー） */}
                    <div className="absolute inset-0 rounded-lg p-2 md:p-3 backface-hidden rotate-y-180 flex flex-col items-center justify-center" style={{ backgroundColor: 'rgba(45, 45, 45, 0.95)', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
                      <div className="text-lg md:text-xl mb-1 text-center">🌝</div>
                      <p className="text-[7px] md:text-xs text-white text-center font-medium">
                        イベントマエストロ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </AdventureMapSection>

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

      {/* 締めのコピーセクション */}
      <ClosingSection />
    </div>
  )
}

