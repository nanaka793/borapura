import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ボランティアプラットフォーム',
  description: 'ボランティア同士がつながり、活動記録を共有するプラットフォーム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
          {children}
        </main>
      </body>
    </html>
  )
}

