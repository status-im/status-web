import './globals.css'

import { Inter } from 'next/font/google'
import Script from 'next/script'

import type { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Status Hub',
  description:
    'Manage your Status Network assets, discover applications, and navigate to various services.',
  alternates: {
    languages: {
      'en-GB': '/',
      'ko-KR': '/ko',
    },
  },
}

type Props = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-inter antialiased">
        {children}
        <Script
          strategy="afterInteractive"
          src="https://umami.bi.status.im/script.js"
          data-website-id="5a1d3ceb-20f1-4808-b2c3-3414704740e5"
          data-domains="hub.status.network"
        />
      </body>
    </html>
  )
}
