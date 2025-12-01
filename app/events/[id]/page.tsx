import PostDetail from '@/components/PostDetail'
import { getPost } from '@/lib/data'
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

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
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <PostDetail
          post={post}
          canBookmark={!!currentUser}
          initialBookmarked={initialBookmarked}
        />
      </div>
    </div>
  )
}


