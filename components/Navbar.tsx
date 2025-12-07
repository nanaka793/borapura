'use client'

import Link from 'next/link'
import Image from 'next/image'
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
  const [isScrolled, setIsScrolled] = useState(false)
  const isHomePage = pathname === '/'

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

  // ホーム画面でのスクロール検知
  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(true)
      return
    }

    const handleScroll = () => {
      // ヒーローセクションの高さ（約700px）を超えたら表示
      const scrollThreshold = 500
      setIsScrolled(window.scrollY > scrollThreshold)
    }

    // 初期状態を設定
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isHomePage])

  // テーマカラーのマッピング
  const themeColors: Record<string, { bg: string; text: string }> = {
    '/': { bg: '#F7C215', text: '#FFFFFF' }, // ホーム - 黄色（明るいので黒文字）
    '/posts': { bg: '#57AABC', text: '#FFFFFF' }, // 冒険日誌 - 青（白文字）
    '/events': { bg: '#799A0E', text: '#FFFFFF' }, // ボランティア募集 - 緑（白文字）
    '/topics': { bg: '#87354F', text: '#FFFFFF' }, // 冒険者の酒場 - 赤紫（白文字）
    '/users': { bg: '#626262', text: '#FFFFFF' }, // 冒険者リスト - グレー（白文字）
    '/mypage': { bg: '#0B1024', text: '#FFFFFF' }, // マイキャンプ - ほぼ黒（白文字）
  }

  // 現在のパスからテーマカラーを取得
  const getThemeColor = (path: string) => {
    // パスに基づいてテーマカラーを判定
    if (path === '/') return themeColors['/']
    if (path.startsWith('/posts')) return themeColors['/posts']
    if (path.startsWith('/events')) return themeColors['/events']
    if (path.startsWith('/topics')) return themeColors['/topics']
    if (path.startsWith('/users')) return themeColors['/users']
    if (path.startsWith('/mypage')) return themeColors['/mypage']
    return null
  }

  const navLinks = [
    { href: '/', label: 'ホーム' },
    { href: '/posts', label: '冒険日誌' },
    { href: '/events', label: 'ボランティア募集' },
    { href: '/topics', label: '冒険者の酒場' },
    { href: '/users', label: '冒険者リスト' },
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

  // ホーム画面ではスクロールしていないときは非表示
  const shouldShow = !isHomePage || isScrolled

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-2 transition-transform duration-300 ${
        shouldShow ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-11">
          {/* 左端: アイコン + ロゴ画像 */}
          <Link 
            href="/" 
            className="flex items-center gap-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="sr-only">ぼらぷら ホームへ</span>
            <Image
              src="/borapura-icon.png"
              alt="ぼらぷら アイコン"
              width={100}
              height={100}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full"
              priority
            />
            <Image
              src="/borapura-logo.png"
              alt="ぼらぷら"
              width={160}
              height={40}
              className="h-6 w-auto sm:h-8"
              priority
            />
          </Link>

          {/* デスクトップ: 通常のナビゲーション */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              const theme = themeColors[link.href]
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-4 py-2 text-sm font-semibold transition-colors"
                  style={
                    active && theme
                      ? {
                          backgroundColor: `${theme.bg}E6`, // 透明度90%（E6は16進数で約90%）
                          color: theme.text,
                        }
                      : {
                          color: '#4B5563', // text-gray-600
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!active && theme) {
                      e.currentTarget.style.backgroundColor = `${theme.bg}1A` // ホバー時は透明度10%
                      e.currentTarget.style.color = '#4B5563' // ホバー時はグレーのまま
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = ''
                      e.currentTarget.style.color = '#4B5563'
                    }
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
            {sessionUser ? (
              <>
                <Link
                  href="/mypage"
                  className="flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 text-sm font-semibold transition"
                  style={
                    isActive('/mypage') && themeColors['/mypage']
                      ? {
                          backgroundColor: `${themeColors['/mypage'].bg}E6`,
                          color: themeColors['/mypage'].text,
                          borderColor: `${themeColors['/mypage'].bg}66`,
                        }
                      : {
                          color: '#4B5563',
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive('/mypage') && themeColors['/mypage']) {
                      e.currentTarget.style.backgroundColor = `${themeColors['/mypage'].bg}1A`
                      e.currentTarget.style.color = '#4B5563' // ホバー時はグレーのまま
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive('/mypage')) {
                      e.currentTarget.style.backgroundColor = ''
                      e.currentTarget.style.color = '#4B5563'
                    }
                  }}
                >
                  <Avatar src={sessionUser.avatar} name={sessionUser.name} size="sm" />
                  <span>マイキャンプ</span>
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
                  className="rounded-md px-4 py-2 text-sm font-semibold transition-colors"
                  style={
                    isActive('/login')
                      ? {
                          backgroundColor: '#E5E7EB', // bg-gray-100相当
                          color: '#374151', // text-gray-700相当
                        }
                      : {
                          color: '#4B5563', // text-gray-600
                        }
                  }
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
                className="flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 text-sm font-semibold transition"
                style={
                  isActive('/mypage') && themeColors['/mypage']
                    ? {
                        backgroundColor: `${themeColors['/mypage'].bg}E6`,
                        color: themeColors['/mypage'].text,
                        borderColor: `${themeColors['/mypage'].bg}66`,
                      }
                    : {
                        color: '#4B5563',
                      }
                }
                onClick={() => setIsMobileMenuOpen(false)}
                onMouseEnter={(e) => {
                  if (!isActive('/mypage') && themeColors['/mypage']) {
                    e.currentTarget.style.backgroundColor = `${themeColors['/mypage'].bg}1A`
                    e.currentTarget.style.color = '#4B5563' // ホバー時はグレーのまま
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/mypage')) {
                    e.currentTarget.style.backgroundColor = ''
                    e.currentTarget.style.color = '#4B5563'
                  }
                }}
              >
                <Avatar src={sessionUser.avatar} name={sessionUser.name} size="sm" />
                <span className="hidden sm:inline">マイキャンプ</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-sm font-semibold transition-colors"
                style={
                  isActive('/login')
                    ? {
                        backgroundColor: '#E5E7EB',
                        color: '#374151',
                      }
                    : {
                        color: '#4B5563',
                      }
                }
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
              {navLinks.map((link) => {
                const active = isActive(link.href)
                const theme = themeColors[link.href]
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-md px-4 py-2 text-sm font-semibold transition-colors"
                    style={
                      active && theme
                        ? {
                            backgroundColor: `${theme.bg}E6`,
                            color: theme.text,
                          }
                        : {
                            color: '#4B5563',
                          }
                    }
                    onMouseEnter={(e) => {
                      if (!active && theme) {
                        e.currentTarget.style.backgroundColor = `${theme.bg}1A`
                        e.currentTarget.style.color = '#4B5563' // ホバー時はグレーのまま
                      } else if (!active) {
                        e.currentTarget.style.backgroundColor = '#F9FAFB' // bg-gray-50
                        e.currentTarget.style.color = '#4B5563'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = ''
                        e.currentTarget.style.color = '#4B5563'
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                )
              })}
              {sessionUser && (
                <Link
                  href="/mypage#friends"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-md px-4 py-2 text-sm font-semibold transition-colors"
                  style={
                    isActive('/mypage') && themeColors['/mypage']
                      ? {
                          backgroundColor: `${themeColors['/mypage'].bg}E6`,
                          color: themeColors['/mypage'].text,
                        }
                      : {
                          color: '#4B5563',
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive('/mypage') && themeColors['/mypage']) {
                      e.currentTarget.style.backgroundColor = `${themeColors['/mypage'].bg}1A`
                      e.currentTarget.style.color = '#4B5563' // ホバー時はグレーのまま
                    } else if (!isActive('/mypage')) {
                      e.currentTarget.style.backgroundColor = '#F9FAFB'
                      e.currentTarget.style.color = '#4B5563'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive('/mypage')) {
                      e.currentTarget.style.backgroundColor = ''
                      e.currentTarget.style.color = '#4B5563'
                    }
                  }}
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

