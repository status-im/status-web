import './globals.css'

import { Inter } from 'next/font/google'

import { Providers } from './_providers'

import type { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Status Hub - DeFi Dashboard',
  description:
    'Manage your Status Network assets, discover applications, and navigate to various services.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-inter antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
