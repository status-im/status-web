import { Analytics } from '@vercel/analytics/next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { cx } from 'cva'
import { getLocale } from 'next-intl/server'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, Metadata } from './_metadata'
import { jsonLD, JSONLDScript } from './_utils/json-ld'

const inter = Inter({
  variable: '--font-inter',
  weight: ['200', '300', '400', '500'],
  subsets: ['latin'],
  preload: true,
})

const organizationSchema = jsonLD.organization({
  '@id': 'https://status.network/#organization',
  name: 'Status Network',
  url: 'https://status.network/',
  logo: 'https://status.network/logo.svg',
  description:
    'Status Network is a privacy-first, fully gasless Ethereum Layer 2 built on the Linea zkEVM stack, with network-level spam protection enforced through reputation (Karma) and execution funded by native yield rather than user-paid gas fees.',
  knowsAbout: [
    { '@type': 'Thing', name: 'Ethereum Layer 2' },
    { '@type': 'Thing', name: 'Gasless transactions' },
    { '@type': 'Thing', name: 'Composable privacy' },
    { '@type': 'Thing', name: 'Spam protection' },
    { '@type': 'Thing', name: 'Reputation system' },
    { '@type': 'Thing', name: 'Native yield funding' },
    { '@type': 'Thing', name: 'Bots' }
  ]
})

const websiteSchema = jsonLD.website({
  '@id': 'https://status.network/#website',
  name: 'Status Network',
  url: 'https://status.network/',
  description:
    'Status Network is a privacy-first, fully gasless Ethereum Layer 2 designed for scalable onchain activity, coordinated through reputation and native yield.',
  publisher: {
    '@id': 'https://status.network/#organization',
  },
  about: [
    { '@type': 'Thing', name: 'Ethereum Layer 2' },
    { '@type': 'Thing', name: 'Gasless transactions' },
    { '@type': 'Thing', name: 'Composable privacy' },
    { '@type': 'Thing', name: 'Spam protection' },
    { '@type': 'Thing', name: 'Reputation system' },
    { '@type': 'Thing', name: 'Native yield funding' },
  ],
})

export const metadata = Metadata({
  metadataBase: new URL('https://status.network/'),

  title: {
    default: DEFAULT_TITLE,
    template: '%s',
  },
  description: DEFAULT_DESCRIPTION,

  pathname: '/',

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
        <JSONLDScript
          schema={[
            organizationSchema,
            websiteSchema,
            softwareApplicationSchema,
          ]}
        />
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
