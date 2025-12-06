'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Topic } from '@/lib/types'

interface TavernSectionProps {
  topics: Topic[]
}

export default function TavernSection({ topics }: TavernSectionProps) {
  const router = useRouter()
  
  // 最新の3つのトピックを取得
  const latestTopics = topics.slice(0, 3)

  const handleMoreClick = () => {
    router.push('/topics')
  }

  const handleTopicClick = (topicId: string) => {
    router.push(`/topics/${topicId}`)
  }

  return (
    <section className="relative w-full overflow-hidden">
      {/* 背景画像 */}
      <div className="relative w-full">
        <Image
          src="/tavern-bg.png"
          alt=""
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      {/* コンテンツ - 背景画像の上に重ねる */}
      <div className="absolute inset-0 z-10">
        <div className="w-full h-full relative">
          {/* 左側：テキストのみ（背景は画像に含まれている） */}
          {/* 背景画像の左上を基準に、右に10%、下に15%の位置にタイトルの左上を合わせる */}
          <div 
            className="absolute text-white"
            style={{
              left: '0%',
              top: '15%',
              maxWidth: '22%'
            }}
          >
            <h2 
              className="text-2xl md:text-4xl font-bold mb-4 md:mb-6"
              style={{ marginLeft: '7%' }}
            >
              冒険者の酒場
            </h2>
            <div 
              className="text-sm md:text-base leading-relaxed text-white overflow-hidden"
              style={{
                aspectRatio: '3/4',
                maxWidth: '100%',
                padding: '1rem',
                boxSizing: 'border-box',
                marginLeft: '7%'
              }}
            >
              <p className="h-full overflow-y-auto" style={{ paddingRight: '0.5rem' }}>
                冒険者が集う酒場…ここはボランティア活動の有無に関わらず、冒険者がどんなときでも楽しく交流できるトークルーム。活動への思いなど熱いルームから、ちょっぴり変なお遊びルームまでさまざま。
              </p>
            </div>
          </div>

          {/* 右側：ベージュ部分（MENU） */}
          {/* 背景画像の上部から10%の位置に配置 */}
          <div 
            className="absolute right-0 flex flex-col"
            style={{
              top: '10%',
              right: '5%',
              maxWidth: '45%'
            }}
          >
            <div className="w-full max-w-md">
              {/* MENUタイトル */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  MENU
                </h3>
                <div className="h-1 w-20 bg-gray-600"></div>
              </div>

              {/* トピックリスト */}
              <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                {latestTopics.length === 0 ? (
                  <p className="text-gray-600 text-sm md:text-base">
                    現在、トピックはありません。
                  </p>
                ) : (
                  latestTopics.map((topic, index) => (
                    <div
                      key={topic.id}
                      onClick={() => handleTopicClick(topic.id)}
                      className="cursor-pointer hover:opacity-90 transition-opacity bg-white rounded-lg p-4 md:p-5"
                      style={{
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-gray-600 font-semibold text-lg md:text-xl flex-shrink-0">
                          {index + 1}.
                        </span>
                        <div className="flex-1">
                          <h4 className="text-base md:text-lg font-bold text-gray-800 mb-1">
                            {topic.title}
                          </h4>
                          {topic.description && (
                            <p className="text-sm md:text-base text-gray-600 line-clamp-2">
                              {topic.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs md:text-sm text-gray-500">
                            <span>{topic.commentCount}件のコメント</span>
                            {topic.isActive && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">
                                募集中
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* もっと見るボタン */}
              <button
                onClick={handleMoreClick}
                className="w-full py-3 md:py-4 px-6 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #87354F 0%, #7C3AED 100%)',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                }}
              >
                もっと見る
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

