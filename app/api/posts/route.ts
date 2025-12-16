import { NextRequest, NextResponse } from 'next/server'
import { savePost, getPosts, getPost, updateUserBadges } from '@/lib/data'
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
    let contact = ''
    let cost = ''
    let period = ''
    let eventDateValue = ''
    let subtitle = ''
    let styles: string[] = []
    let tags: string[] = []
    let questStyle: number | undefined
    let emotionMeter: number | undefined
    let growthDiscovery = ''
    let finalBoss = ''
    let imageFiles: File[] = []

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      title = (formData.get('title') ?? '').toString().trim()
      content = (formData.get('content') ?? '').toString().trim()
      category = (formData.get('category') ?? '').toString().trim()
      location = (formData.get('location') ?? '').toString().trim()
      organization = (formData.get('organization') ?? '').toString().trim()
      postType = (formData.get('type') ?? '記録投稿').toString().trim() || '記録投稿'
      contact = (formData.get('contact') ?? '').toString().trim()
      cost = (formData.get('cost') ?? '').toString().trim()
      subtitle = (formData.get('subtitle') ?? '').toString().trim()
      const stylesValue = formData.get('styles')
      if (typeof stylesValue === 'string' && stylesValue.trim()) {
        try {
          const parsed = JSON.parse(stylesValue)
          if (Array.isArray(parsed)) {
            styles = parsed.map((s: string) => s.toString().trim()).filter(Boolean)
          }
        } catch {
          styles = []
        }
      }
      const tagsValue = formData.get('tags')
      if (typeof tagsValue === 'string' && tagsValue.trim()) {
        try {
          const parsed = JSON.parse(tagsValue)
          if (Array.isArray(parsed)) {
            tags = parsed
          }
        } catch {
          tags = []
        }
      }
      period = (formData.get('period') ?? '').toString().trim()
      eventDateValue = (formData.get('eventDate') ?? formData.get('date') ?? '').toString().trim()
      
      const questStyleValue = formData.get('questStyle')
      if (questStyleValue) {
        const parsed = parseInt(questStyleValue.toString(), 10)
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 6) {
          questStyle = parsed
        }
      }
      
      const emotionMeterValue = formData.get('emotionMeter')
      if (emotionMeterValue) {
        const parsed = parseInt(emotionMeterValue.toString(), 10)
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 6) {
          emotionMeter = parsed
        }
      }

      growthDiscovery = (formData.get('growthDiscovery') ?? '').toString().trim()
      finalBoss = (formData.get('finalBoss') ?? '').toString().trim()

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
      contact = (body.contact ?? '').toString().trim()
      cost = (body.cost ?? '').toString().trim()
      subtitle = (body.subtitle ?? '').toString().trim()
      if (Array.isArray(body.styles)) {
        styles = body.styles.map((s: string) => s.toString().trim()).filter(Boolean)
      }
      if (Array.isArray(body.tags)) {
        tags = body.tags.map((tag: string) => tag.toString().trim()).filter(Boolean)
      }
      period = (body.period ?? '').toString().trim()
      eventDateValue = (body.eventDate ?? body.date ?? '').toString().trim()
      
      if (typeof body.questStyle === 'number' && body.questStyle >= 0 && body.questStyle <= 6) {
        questStyle = body.questStyle
      } else if (typeof body.questStyle === 'string') {
        const parsed = parseInt(body.questStyle, 10)
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 6) {
          questStyle = parsed
        }
      }
      
      if (typeof body.emotionMeter === 'number' && body.emotionMeter >= 0 && body.emotionMeter <= 6) {
        emotionMeter = body.emotionMeter
      } else if (typeof body.emotionMeter === 'string') {
        const parsed = parseInt(body.emotionMeter, 10)
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 6) {
          emotionMeter = parsed
        }
      }
      
      growthDiscovery = (body.growthDiscovery ?? '').toString().trim()
      finalBoss = (body.finalBoss ?? '').toString().trim()
    }

    if (!title || !content) {
      return NextResponse.json(
        { error: 'タイトルと内容は必須です。' },
        { status: 400 }
      )
    }

    if (imageFiles.length > 10) {
      return NextResponse.json(
        { error: '画像は最大10枚までアップロードできます。' },
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
      category: category || tags[0] || undefined,
      tags: tags.length > 0 ? tags : category ? [category] : undefined,
      location: location || undefined,
      organization: organization || undefined,
      subtitle: subtitle || undefined,
      styles: styles.length > 0 ? styles : undefined,
      contact: contact || undefined,
      cost: cost || undefined,
      period: period || undefined,
      eventDate: eventDateValue || undefined,
      questStyle: questStyle !== undefined ? questStyle : undefined,
      emotionMeter: emotionMeter !== undefined ? emotionMeter : undefined,
      growthDiscovery: growthDiscovery || undefined,
      finalBoss: finalBoss || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      comments: [],
      images: [],
    }

    const { post: savedPost, recordId } = await savePost(newPost)

    // 画像アップロードを試行（失敗しても投稿は成功させる）
    if (imageFiles.length > 0) {
      const uploadPromises = imageFiles.map(async (file) => {
        try {
          await uploadAttachment(file, {
            recordId,
            fieldKey: 'PostsImage',
            tableName: 'Posts',
          })
        } catch (error) {
          console.error('Failed to upload image:', file.name, error)
          // 画像アップロードに失敗しても投稿は成功させる
        }
      })
      await Promise.allSettled(uploadPromises)
    }

    // 画像をアップロードした場合は、最新の投稿データを取得
    const finalPost = imageFiles.length > 0 ? await getPost(recordId) : savedPost

    // バッジを更新（非同期で実行、エラーが発生しても投稿は成功させる）
    updateUserBadges(currentUser.id).catch((error) => {
      console.error('Failed to update user badges:', error)
    })

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

