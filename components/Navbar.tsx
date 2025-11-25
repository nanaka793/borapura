'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Avatar from './Avatar'

interface SessionUser {
  id: string
  name: string
  email: string
  avatar?: string
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null)

  useEffect(() => {
    let isMounted = true
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session', { cache: 'no-store' })
        const data = await res.json()
        if (isMounted) {
          setSessionUser(data.user)
        }
      } catch {
        if (isMounted) setSessionUser(null)
      }
    }
    fetchSession()
    return () => {
      isMounted = false
    }
  }, [pathname])

  const navLinks = [
    { href: '/', label: 'ホーム' },
    { href: '/posts', label: '活動記録' },
    { href: '/events', label: 'ボランティア募集' },
    { href: '/users', label: 'ユーザー' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setSessionUser(null)
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            ボラプラ
          </Link>
          <div className="flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {sessionUser ? (
              <>
                <Link
                  href="/mypage"
                  className={`flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 text-sm font-semibold transition ${
                    isActive('/mypage')
                      ? 'border-primary-200 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  <Avatar src={sessionUser.avatar} name={sessionUser.name} size="sm" />
                  <span>マイページ</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive('/login')
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  ログイン
                </Link>
                <Link
                  href="/register"
                  className="rounded-full border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
                >
                  新規登録
                </Link>
              </>
            )}
            <Link
              href="/posts/new"
              className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-primary-700"
            >
              活動を投稿
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

