import PostDetail from '@/components/PostDetail'
import { getPost } from '@/lib/data'
import { notFound } from 'next/navigation'

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

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <PostDetail post={post} />
      </div>
    </div>
  )
}

