import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F7F3EA',   // ベースカラーのごく薄いトーン
          100: '#EFE9DC',  // ベースカラー
          200: '#C7D6E6',
          300: '#9FBFE0',
          400: '#4A88C0',
          500: '#1562A0',  // メインカラー
          600: '#114E80',
          700: '#0C3A60',
          800: '#08263F',
          900: '#041528',
        },
        accent: '#F7C215', // アクセントカラー
        base: '#EFE9DC',   // ベースカラー
        textmain: '#09314E', // テキストカラー
      },
    },
  },
  plugins: [],
}
export default config

