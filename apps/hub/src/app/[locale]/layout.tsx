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
  description:
    'Manage your Status Network assets, discover applications, and navigate to various services.',
  logo: 'https://hub.status.network/logo.svg',
})

const websiteSchema = jsonLD.website({
  description:
    'Manage your Status Network assets, discover applications, and navigate to various services.',
})

export const dynamic = 'force-static'

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return MetadataFn({
    alternates: {
      canonical: `/${locale}`,
    },
  })
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    redirect('/en/404')
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
