import Link from 'next/link'

export default function Footer() {
  const navLinks = [
    { href: '/', label: 'ホーム' },
    { href: '/posts', label: '冒険日誌' },
    { href: '/events', label: 'ボランティア募集' },
    { href: '/topics', label: '冒険者の酒場' },
    { href: '/users', label: '冒険者一覧' },
  ]

  return (
    <footer className="bg-gray-100 text-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* タイトルとサブコピー */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">ぼらぷら</h2>
            <p className="text-gray-600 text-lg">世界を広げる冒険へ！</p>
          </div>

          {/* ナビゲーションリンク */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">メニュー</h3>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* コピーライト */}
        <div className="mt-8 pt-8 border-t border-gray-300 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} ぼらぷら. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

