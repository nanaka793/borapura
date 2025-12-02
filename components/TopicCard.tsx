import Link from 'next/link'
import { Topic } from '@/lib/types'

interface TopicCardProps {
  topic: Topic
}

export default function TopicCard({ topic }: TopicCardProps) {
  return (
    <Link
      href={`/topics/${topic.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-800 flex-1">{topic.title}</h3>
        {topic.isActive && (
          <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            募集中
          </span>
        )}
      </div>
      {topic.description && (
        <p className="text-gray-600 mb-4 line-clamp-2">{topic.description}</p>
      )}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{topic.commentCount}件のコメント</span>
        <span>{new Date(topic.createdAt).toLocaleDateString('ja-JP')}</span>
      </div>
    </Link>
  )
}

