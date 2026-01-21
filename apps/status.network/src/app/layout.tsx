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
    'Status Network is a privacy-first, fully gasless Ethereum Layer 2 built on the Linea zkEVM stack.',
  logo: 'https://status.network/logo.svg',
})

const websiteSchema = jsonLD.website({
  description:
    'Status Network is a privacy-first, fully gasless Ethereum Layer 2 designed for scalable onchain activity, coordinated through reputation and native yield.',
})

const webpageSchema = jsonLD.webpage({
  name: 'A Privacy-First Gasless Ethereum Layer 2 Powered by Native Yield',
  description:
    'Status Network is a privacy-first, fully gasless Ethereum Layer 2. It replaces per-transaction gas with reputation-based coordination and uses native yield and network activity to cover execution costs.',
  url: 'https://status.network/',
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
    default:
      'Status Network | Gasless Ethereum L2 with Native Yield',
    template: '%s — Status Network',
  },
  description:
    'Status Network is a gasless zkEVM Ethereum Layer 2 with native yield, privacy by design, and reputation-based governance for scalable onchain apps.',

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
        <JSONLDScript schema={[organizationSchema,websiteSchema,webpageSchema,softwareApplicationSchema,]}/>
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
