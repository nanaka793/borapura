import { getPost, getUser } from '@/lib/data'
import { notFound } from 'next/navigation'
import PostDetail from '@/components/PostDetail'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    notFound()
  }
  const author = await getUser(post.authorId)
  const currentUser = await getCurrentUser()

  const nextSteps = currentUser?.nextSteps ?? []
  const isRecruitment = post.type === '募集投稿'
  const initialBookmarked = nextSteps.includes(post.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/posts"
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
          冒険日誌に戻る
        </Link>
        <PostDetail
          post={post}
          authorAvatar={author?.avatar}
          canBookmark={!!currentUser}
          initialBookmarked={isRecruitment ? initialBookmarked : false}
        />
      </div>
    </div>
  )
}

