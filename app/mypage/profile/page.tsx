import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import ProfileForm from '@/components/ProfileForm'
import Avatar from '@/components/Avatar'

export default async function ProfileSettingsPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect('/login?next=/mypage/profile')
  }

  const { passwordHash: _passwordHash, ...safeUser } = currentUser

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex items-center gap-4">
          <Avatar src={currentUser.avatar} name={currentUser.name} size="lg" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">
              Profile Settings
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              {currentUser.name} さんのプロフィール設定
            </h1>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-md">
          <ProfileForm user={safeUser} />
        </div>
      </div>
    </div>
  )
}


