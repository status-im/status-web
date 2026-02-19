import './globals.css'

import { Inter } from 'next/font/google'
import Script from 'next/script'
import { getLocale } from 'next-intl/server'

import { Metadata as MetadataFn } from './_metadata'
import { jsonLD, JSONLDScript } from './_utils/json-ld'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const organizationSchema = jsonLD.organization({
  '@id': 'https://hub.status.network/#organization',
  name: 'Status Network',
  url: 'https://hub.status.network',
  logo: 'https://hub.status.network/og-image.png',
  description: 'The gasless network with sustainable funding for app builders',
})

const websiteSchema = jsonLD.website({
  '@id': 'https://hub.status.network/#website',
  name: 'Status Network Hub',
  url: 'https://hub.status.network',
  description:
    'Explore Status Network, a gasless Ethereum Layer 2 with a native privacy layer, shared yield, staking, and reputation-based governance.',
  publisher: {
    '@id': 'https://hub.status.network/#organization',
  },
})

export const metadata = MetadataFn({
  metadataBase: new URL('https://hub.status.network'),
  // title: 'Status Hub',
  // description:
  // 'Manage your Status Network assets, discover applications, and navigate to various services.',
  pathname: '/',
})

type Props = {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
  const locale = await getLocale()

  return (
    <html lang={locale} className={inter.variable}>
      <body className="font-inter antialiased">
        <JSONLDScript schema={[organizationSchema, websiteSchema]} />
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
