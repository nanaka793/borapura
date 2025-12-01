import { getPost, getUser } from '@/lib/data'
import { notFound } from 'next/navigation'
import PostDetail from '@/components/PostDetail'
import { getCurrentUser } from '@/lib/auth'

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

