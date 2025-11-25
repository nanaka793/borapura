import { NextRequest, NextResponse } from 'next/server'
import { savePost, getPosts, getPost } from '@/lib/data'
import { Post } from '@/lib/types'
import { getCurrentUser } from '@/lib/auth'
import { uploadAttachment } from '@/lib/airtable'

export async function GET() {
  const posts = await getPosts()
  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: '投稿するにはログインが必要です。' },
        { status: 401 }
      )
    }

    const contentType = request.headers.get('content-type') || ''
    let title = ''
    let content = ''
    let category = ''
    let location = ''
    let postType = '記録投稿'
    let organization = ''
    let imageFiles: File[] = []

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      title = (formData.get('title') ?? '').toString().trim()
      content = (formData.get('content') ?? '').toString().trim()
      category = (formData.get('category') ?? '').toString().trim()
      location = (formData.get('location') ?? '').toString().trim()
      organization = (formData.get('organization') ?? '').toString().trim()
      postType = (formData.get('type') ?? '記録投稿').toString().trim() || '記録投稿'

      const images = formData.getAll('images') || []
      imageFiles = images.filter(
        (value): value is File => value instanceof File && value.size > 0
      )
    } else {
      const body = await request.json()
      title = (body.title ?? '').toString().trim()
      content = (body.content ?? '').toString().trim()
      category = (body.category ?? '').toString().trim()
      location = (body.location ?? '').toString().trim()
      organization = (body.organization ?? '').toString().trim()
      postType = (body.type ?? '記録投稿').toString().trim() || '記録投稿'
    }

    if (!title || !content) {
      return NextResponse.json(
        { error: 'タイトルと内容は必須です。' },
        { status: 400 }
      )
    }

    if (imageFiles.length > 5) {
      return NextResponse.json(
        { error: '画像は最大5枚までアップロードできます。' },
        { status: 400 }
      )
    }

    const newPost: Post = {
      id: '',
      title,
      type: postType,
      content,
      author: currentUser.name,
      authorId: currentUser.id,
      category: category || undefined,
      tags: category ? [category] : undefined,
      location: location || undefined,
      organization: organization || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      comments: [],
      images: [],
    }

    const { post: savedPost, recordId } = await savePost(newPost)

    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        await uploadAttachment(file, {
          recordId,
          fieldKey: 'PostsImage',
        })
      }
    }

    const finalPost = imageFiles.length > 0 ? await getPost(recordId) : savedPost

    return NextResponse.json(finalPost, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    const errorMessage =
      error instanceof Error ? error.message : '投稿の作成に失敗しました'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

