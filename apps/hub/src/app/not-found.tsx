import './globals.css'

import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import Link from 'next/link'
import { hasLocale } from 'next-intl'

import { loadMessages } from '~/i18n/messages'
import { routing } from '~/i18n/routing'

import { Metadata } from './_metadata'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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

function getLocaleFromPath(pathname: string) {
  const segment = pathname.split('/').filter(Boolean)[0]

  if (segment && hasLocale(routing.locales, segment)) {
    return segment
  }

  return routing.defaultLocale
}

// Fallback for routes outside `[locale]` during static export.
export default async function GlobalNotFound() {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const locale = getLocaleFromPath(pathname)
  const messages = await loadMessages(locale)
  const notFoundMessages = messages['not_found'] as
    | Record<string, string>
    | undefined

  const title =
    notFoundMessages?.['title'] ?? "This is not the page you're looking for"
  const takeMeHome = notFoundMessages?.['take_me_home'] ?? 'Take me home'
  const homeHref = locale === routing.defaultLocale ? '/' : `/${locale}`

  return (
    <html lang={locale} className={inter.variable}>
      <body
        className="font-inter antialiased"
        data-customisation="purple"
        suppressHydrationWarning
      >
        <main className="flex min-h-dvh flex-1 items-center justify-center bg-neutral-100 px-5">
          <div className="flex max-w-[696px] flex-col items-center gap-8 rounded-20 bg-white-100 p-8">
            <h1 className="text-center text-40 font-700 lg:text-64">{title}</h1>

            <Link
              href={homeHref}
              className="inline-flex h-10 items-center gap-1 rounded-12 border border-neutral-30 bg-white-100 px-4 py-[9px] text-15 font-500 text-dark-100 transition-all hover:border-neutral-40 hover:bg-white-80"
            >
              {takeMeHome}
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
