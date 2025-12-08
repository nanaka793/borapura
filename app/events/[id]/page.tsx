import PostDetail from '@/components/PostDetail'
import { getPost } from '@/lib/data'
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPost(id)

  if (!post || post.type !== '募集投稿') {
    notFound()
  }

  const currentUser = await getCurrentUser()
  const nextSteps = currentUser?.nextSteps ?? []
  const initialBookmarked = nextSteps.includes(post.id)

  return (
    <div className="min-h-screen bg-gradient-to-b from-base to-white">
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-4xl">
        <Link
          href="/events"
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
          ボランティア募集に戻る
        </Link>
        <PostDetail
          post={post}
          canBookmark={!!currentUser}
          initialBookmarked={initialBookmarked}
        />
        </div>
      </div>
    </div>
  )
}


