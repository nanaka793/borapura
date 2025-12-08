import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import ProfileForm from '@/components/ProfileForm'
import Avatar from '@/components/Avatar'
import StarBackground from '@/components/StarBackground'

export default async function ProfileSettingsPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect('/login?next=/mypage/profile')
  }

  const { passwordHash: _passwordHash, ...safeUser } = currentUser

  const themeColor = '#0B1024' // マイキャンプのテーマカラー

  return (
    <div className="min-h-screen relative" style={{ background: `linear-gradient(to bottom, ${themeColor}, white)` }}>
      <div className="relative min-h-screen">
        <StarBackground />
        <div className="container mx-auto px-4 pt-24 pb-10 relative z-10">
          <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex items-center gap-4">
          <Avatar src={currentUser.avatar} name={currentUser.name} size="lg" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">
              Profile Settings
            </p>
            <h1 className="text-3xl font-bold text-white">
              {currentUser.name} さんのプロフィール設定
            </h1>
          </div>
        </div>

            <div className="rounded-3xl bg-white/85 p-8 drop-shadow-lg">
              <ProfileForm user={safeUser} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




