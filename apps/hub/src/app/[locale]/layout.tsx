import '../globals.css'

import { Inter } from 'next/font/google'
import { redirect } from 'next/navigation'
import Script from 'next/script'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'

import { routing } from '~/i18n/routing'

import { Metadata as MetadataFn } from '../_metadata'
import { Providers } from '../_providers'
import { jsonLD, JSONLDScript } from '../_utils/json-ld'

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

export const dynamic = 'force-static'

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return MetadataFn({
    pathname: '/',
    metadataBase: new URL('https://hub.status.network'),
    locale,
  })
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    redirect('/404')
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang={locale} className={inter.variable}>
      <body className="font-inter antialiased">
        <JSONLDScript schema={[organizationSchema, websiteSchema]} />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
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
