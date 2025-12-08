import Link from 'next/link'
import Image from 'next/image'
import { Topic } from '@/lib/types'

interface TopicCardProps {
  topic: Topic
  themeColor?: string
}

export default function TopicCard({ topic, themeColor }: TopicCardProps) {
  const defaultThemeColor = themeColor || '#87354F'

  return (
    <Link
      href={`/topics/${topic.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
    >
      {topic.image && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <Image
            src={topic.image}
            alt={topic.title}
            width={800}
            height={400}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-800 flex-1">{topic.title}</h3>
        {topic.isActive && (
          <span className="ml-3 px-3 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: `${defaultThemeColor}20`, color: defaultThemeColor }}>
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



