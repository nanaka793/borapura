import { getTopics } from '@/lib/data'
import TopicCard from '@/components/TopicCard'

export default async function TopicsPage() {
  const topics = await getTopics(true) // アクティブなトピックのみ取得

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">冒険者の酒場</h1>
          <p className="text-gray-600 text-lg">
            ボランティア参加の有無に関わらず、みんなでテーマについて語り合いましょう！
          </p>
        </div>

        {topics.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">
              現在、アクティブなトピックはありません。
            </p>
            <p className="text-gray-400 text-sm mt-2">
              新しいトピックが追加されるまでお待ちください。
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

