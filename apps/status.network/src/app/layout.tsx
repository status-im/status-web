import { Analytics } from '@vercel/analytics/next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { cx } from 'cva'
import { getLocale } from 'next-intl/server'
import { Metadata } from './_metadata'
import { jsonLD, JSONLDScript } from './_utils/json-ld'

const inter = Inter({
  variable: '--font-inter',
  weight: ['200', '300', '400', '500'],
  subsets: ['latin'],
  preload: true,
})

const organizationSchema = jsonLD.organization({
  description:
    'The first natively gasless Ethereum L2 with sustainable yield and integrated public funding 🐉',
  logo: 'https://status.network/logo.svg',
})

const websiteSchema = jsonLD.website({
  description:
    'The first natively gasless Ethereum L2 with sustainable yield and integrated public funding 🐉',
})

export const metadata = Metadata({
  metadataBase: new URL('https://status.network/'),

  title: {
    default:
      'Status Network — First gasless L2 with sustainable apps funding 🐉',
    template: '%s — Status Network',
  },
  description:
    'The first natively gasless Ethereum L2 with sustainable yield and integrated public funding 🐉',

  alternates: {
    canonical: './',
  },

  twitter: {
    card: 'summary_large_image',
    site: '@StatusL2',
  },
})

type Props = {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
  const locale = await getLocale()

  return (
    <html lang={locale}>
      <body
        className={cx(
          inter.variable,
          'bg-white-100 text-neutral-100 antialiased',
          'selection:bg-purple selection:text-white-100',
        )}
        suppressHydrationWarning
      >
        <JSONLDScript schema={[organizationSchema, websiteSchema]} />
        {children}
        <Analytics />
        <Script
          strategy="afterInteractive"
          src="https://umami.bi.status.im/script.js"
          data-website-id="0746c5dc-8cd3-45a4-9606-6bcf9adf248e"
          data-domains="status.network"
          async
        />
      </body>
    </html>
  )
}
