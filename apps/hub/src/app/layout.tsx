import './globals.css'

import { Inter } from 'next/font/google'
import Script from 'next/script'

import { Metadata as MetadataFn } from './_metadata'
import { Providers } from './_providers'
import { jsonLD, JSONLDScript } from './_utils/json-ld'

import type { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const organizationSchema = jsonLD.organization({
  description:
    'Manage your Status Network assets, discover applications, and navigate to various services.',
  logo: 'https://hub.status.network/logo.svg',
})

const websiteSchema = jsonLD.website({
  description:
    'Manage your Status Network assets, discover applications, and navigate to various services.',
})

export const metadata: Metadata = MetadataFn({
  title: 'Status Hub',
  description:
    'Manage your Status Network assets, discover applications, and navigate to various services.',
  alternates: {
    canonical: '/',
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
        <JSONLDScript schema={[organizationSchema, websiteSchema]} />
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
