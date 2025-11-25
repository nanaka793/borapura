import { getPost, getUser } from '@/lib/data'
import { notFound } from 'next/navigation'
import PostDetail from '@/components/PostDetail'

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
  const author = getUser(post.authorId)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <PostDetail post={post} authorAvatar={author?.avatar} />
      </div>
    </div>
  )
}

