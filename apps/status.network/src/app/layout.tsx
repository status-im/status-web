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
  url: 'https://status.network',
  logo: 'https://status.network/logo.svg',
  description:
    'Status Network is a privacy-first, fully gasless Ethereum Layer 2 built on the Linea zkEVM stack.',
})

const websiteSchema = jsonLD.website({
  '@id': 'https://status.network/#website',
  name: 'Status Network',
  url: 'https://status.network',
  description:
    'Status Network is a privacy-first, fully gasless Ethereum Layer 2 designed for scalable onchain activity, coordinated through reputation and native yield.',
  publisher: {
    '@id': 'https://status.network/#organization',
  },
})

const softwareApplicationSchema = jsonLD.softwareApplication({
  name: 'Status Network',
  description:
    'Status Network is a privacy-first, fully gasless Ethereum Layer 2 built on the Linea zkEVM stack. Execution is coordinated through Karma, a non-transferable reputation system, and supported by native yield and network activity.',
  applicationCategory: 'Blockchain',
  operatingSystem: 'Web3',
  url: 'https://status.network/',
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
