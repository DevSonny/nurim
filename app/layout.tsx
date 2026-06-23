import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://nurim.pages.dev'),
  title: '누림',
  description: '매일이 자라는 곳',
  openGraph: {
    title: '누림',
    description: '매일이 자라는 곳',
    images: [{ url: '/api/og?streak=14&orbit=공부&avg=87', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/api/og?streak=14&orbit=공부&avg=87'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={spaceGrotesk.variable}>
      <body>{children}</body>
    </html>
  )
}
