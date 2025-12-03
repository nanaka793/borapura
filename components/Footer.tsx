import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <>
      {/* フッター上部の背景イラスト（横幅にフィット） */}
      <div className="w-full bg-white">
        <Image
          src="/footer-bg.png"
          alt=""
          width={1800}
          height={600}
          priority
          className="h-auto w-full object-cover"
        />
      </div>

      {/* フッター本体（背景色 #1562A0） */}
      <footer className="mt-auto bg-[#1562A0] text-white">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">
          <div className="grid gap-10 md:grid-cols-[1.2fr,1fr,1fr] items-start">
            {/* 左列: Volunteer Platform + ロゴ（Navbarと同じロゴ構成／アイコンなし） */}
            <div>
              <p className="text-sm md:text-base mb-3">Volunteer Platform</p>
              <div className="flex items-center gap-2">
                <Image
                  src="/borapura-logo.png"
                  alt="ぼらぷら"
                  width={160}
                  height={40}
                  className="h-6 w-auto sm:h-8"
                />
              </div>
            </div>

            {/* 中央列: ホーム関連 */}
            <div className="space-y-3">
              <Link
                href="/"
                className="text-lg md:text-xl font-semibold hover:text-accent transition-colors"
              >
                ホーム
              </Link>
              <div className="mt-2 space-y-1 text-sm md:text-base text-white/90">
                <Link
                  href="/"
                  className="block hover:text-accent transition-colors"
                >
                  - このサイトでできること
                </Link>
                <Link
                  href="/"
                  className="block hover:text-accent transition-colors"
                >
                  - MAP 冒険する世界
                </Link>
              </div>
            </div>

            {/* 右列: 各ページリンク */}
            <div className="space-y-2 text-sm md:text-base">
              <Link
                href="/posts"
                className="block text-lg md:text-xl font-semibold hover:text-accent transition-colors"
              >
                冒険日誌
              </Link>
              <Link
                href="/events"
                className="block text-lg md:text-xl font-semibold hover:text-accent transition-colors"
              >
                ボランティア募集
              </Link>
              <Link
                href="/topics"
                className="block text-lg md:text-xl font-semibold hover:text-accent transition-colors"
              >
                冒険者の酒場
              </Link>
              <Link
                href="/users"
                className="block text-lg md:text-xl font-semibold hover:text-accent transition-colors"
              >
                冒険者一覧
              </Link>
              <Link
                href="/mypage"
                className="block text-lg md:text-xl font-semibold hover:text-accent transition-colors"
              >
                マイページ
              </Link>
            </div>
          </div>

          {/* コピーライト */}
          <div className="mt-8 border-t border-white/30 pt-4 text-center text-xs md:text-sm text-white/80">
            <p>&copy; {new Date().getFullYear()} ぼらぷら. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

