import { getTopic, getTopicComments } from '@/lib/data'
import { notFound } from 'next/navigation'
import TopicCommentSection from '@/components/TopicCommentSection'
import Link from 'next/link'

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [topic, comments] = await Promise.all([
    getTopic(id),
    getTopicComments(id),
  ])

  if (!topic) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
        <Link
          href="/topics"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
          冒険者の酒場に戻る
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex-1">
              {topic.title}
            </h1>
            {topic.isActive ? (
              <span className="ml-4 px-4 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                募集中
              </span>
            ) : (
              <span className="ml-4 px-4 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                終了
              </span>
            )}
          </div>
          {topic.description && (
            <p className="text-gray-600 text-lg mb-4 whitespace-pre-wrap">
              {topic.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{topic.commentCount}件のコメント</span>
            <span>
              作成日: {new Date(topic.createdAt).toLocaleDateString('ja-JP')}
            </span>
          </div>
        </div>

        <TopicCommentSection topicId={id} initialComments={comments} />
        </div>
      </div>
    </div>
  )
}

