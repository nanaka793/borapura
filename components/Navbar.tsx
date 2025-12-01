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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    { href: '/posts', label: '冒険日誌' },
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
          {/* 左端: ぼらぷらロゴ */}
          <Link 
            href="/" 
            className="text-xl sm:text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ぼらぷら
          </Link>

          {/* デスクトップ: 通常のナビゲーション */}
          <div className="hidden md:flex items-center gap-4">
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
          </div>

          {/* モバイル: ログイン/マイページとハンバーガーメニューボタン */}
          <div className="flex md:hidden items-center gap-3">
            {/* ログイン/マイページ */}
            {sessionUser ? (
              <Link
                href="/mypage"
                className={`flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 text-sm font-semibold transition ${
                  isActive('/mypage')
                    ? 'border-primary-200 text-primary-700'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Avatar src={sessionUser.avatar} name={sessionUser.name} size="sm" />
                <span className="hidden sm:inline">マイページ</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                  isActive('/login')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ログイン
              </Link>
            )}

            {/* ハンバーガーメニューボタン */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors"
              aria-label="メニュー"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* モバイル: ハンバーガーメニュー */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {sessionUser && (
                <Link
                  href="/mypage#friends"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive('/mypage')
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  旅の仲間リスト
                </Link>
              )}
              {sessionUser && (
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 text-left"
                >
                  ログアウト
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

