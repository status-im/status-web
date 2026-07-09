import './globals.css'

import { Inter } from 'next/font/google'
import Script from 'next/script'
import { NextIntlClientProvider } from 'next-intl'

import { loadMessages } from '~/i18n/messages'
import { Link } from '~/i18n/navigation'
import { routing } from '~/i18n/routing'
import { HubLayout } from '~components/hub-layout'

import { Metadata } from './_metadata'
import { Providers } from './_providers'
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

export const dynamic = 'force-static'

export const metadata = Metadata({
  title: '404 — Page Not Found',
  description:
    'The page you were looking for could not be found. Return to the Status Hub homepage.',
  robots: {
    index: false,
  },
})

// Fallback for routes outside `[locale]` during static export.
export default async function GlobalNotFound() {
  const locale = routing.defaultLocale
  const messages = await loadMessages(locale)
  const notFoundMessages = messages['not_found'] as
    | Record<string, string>
    | undefined

  const title =
    notFoundMessages?.['title'] ?? "This is not the page you're looking for"
  const takeMeHome = notFoundMessages?.['take_me_home'] ?? 'Take me home'

  return (
    <html lang={locale} className={inter.variable}>
      <body
        className="font-inter antialiased"
        data-customisation="purple"
        suppressHydrationWarning
      >
        <JSONLDScript schema={[organizationSchema, websiteSchema]} />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            <HubLayout showSidebar={false} centerContent>
              <div className="mx-auto flex w-full max-w-[696px] flex-col items-center gap-8 py-10">
                <h1 className="text-balance text-center text-40 font-700 lg:text-64">
                  {title}
                </h1>

                <Link
                  href="/"
                  className="inline-flex h-10 items-center gap-1 rounded-12 border border-neutral-30 bg-white-100 px-4 py-[9px] text-15 font-500 text-dark-100 transition-all hover:border-neutral-40 hover:bg-white-80"
                >
                  {takeMeHome}
                </Link>
              </div>
            </HubLayout>
          </Providers>
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
