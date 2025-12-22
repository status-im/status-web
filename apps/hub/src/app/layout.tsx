import './globals.css'

import { Inter } from 'next/font/google'
import Script from 'next/script'

import { Metadata } from './_metadata'
import { Providers } from './_providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = Metadata({
  metadataBase: new URL('https://hub.status.network/'),

  title: 'Status Network Hub',
  description:
    'Get started on the gasless L2 with native yield and composable privacy! Try apps and deposit assets to earn Karma',

  alternates: {
    canonical: './',
  },

  openGraph: {
    title: 'Status Network Hub',
    description:
      'Get started on the gasless L2 with native yield and composable privacy! Try apps and deposit assets to earn Karma',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@StatusL2',
    // title: 'Status Network Hub',
    // description:
    //   'Get started on the gasless L2 with native yield and composable privacy! Try apps and deposit assets to earn Karma',
    // images: [
    // ],
    // creator: '@StatusL2',
  },
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-inter antialiased">
        <Providers>{children}</Providers>
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
