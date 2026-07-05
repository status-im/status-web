import { Analytics } from '@vercel/analytics/next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import '../globals.css'
import { loadMessages } from '~/i18n/messages'
import { routing } from '~/i18n/routing'
import { cx } from 'cva'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, Metadata } from '../_metadata'
import { jsonLD, JSONLDScript } from '../_utils/json-ld'

const inter = Inter({
  variable: '--font-inter',
  weight: ['200', '300', '400', '500'],
  subsets: ['latin'],
  preload: true,
})

const organizationSchema = {
  ...jsonLD.organization({
    '@id': 'https://status.network/#organization',
    name: 'Status Network',
    url: 'https://status.network/',
    logo: 'https://status.network/logo.svg',
    description:
      'Status Network is a privacy-first, fully gasless Ethereum Layer 2 built on the Linea zkEVM stack, with network-level spam protection enforced through reputation (Karma) and execution funded by native yield rather than user-paid gas fees.',
  }),
  knowsAbout: [
    { '@type': 'Thing' as const, name: 'Ethereum Layer 2' },
    { '@type': 'Thing' as const, name: 'Gasless transactions' },
    { '@type': 'Thing' as const, name: 'Composable privacy' },
    { '@type': 'Thing' as const, name: 'Spam protection' },
    { '@type': 'Thing' as const, name: 'Reputation system' },
    { '@type': 'Thing' as const, name: 'Native yield funding' },
    { '@type': 'Thing' as const, name: 'Bots' },
  ],
}

const websiteSchema = {
  ...jsonLD.website({
    '@id': 'https://status.network/#website',
    name: 'Status Network',
    url: 'https://status.network/',
    description:
      'Status Network is a privacy-first, fully gasless Ethereum Layer 2 designed for scalable onchain activity, coordinated through reputation and native yield.',
    publisher: {
      '@id': 'https://status.network/#organization',
    },
  }),
  about: [
    { '@type': 'Thing' as const, name: 'Ethereum Layer 2' },
    { '@type': 'Thing' as const, name: 'Gasless transactions' },
    { '@type': 'Thing' as const, name: 'Composable privacy' },
    { '@type': 'Thing' as const, name: 'Spam protection' },
    { '@type': 'Thing' as const, name: 'Reputation system' },
    { '@type': 'Thing' as const, name: 'Native yield funding' },
  ],
}

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

export const dynamic = 'force-static'

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export const dynamicParams = false

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await loadMessages(locale)

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
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
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
