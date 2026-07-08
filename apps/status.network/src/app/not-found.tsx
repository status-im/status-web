import { loadMessages } from '~/i18n/messages'
import { routing } from '~/i18n/routing'
import { Inter } from 'next/font/google'
import { ButtonLink } from './_components/button-link'
import { Metadata } from './_metadata'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  weight: ['200', '300', '400', '500'],
  subsets: ['latin'],
  preload: true,
})

export const dynamic = 'force-static'

export const metadata = Metadata({
  title: '404 — Page Not Found',
  description:
    'The page you were looking for could not be found. Return to the Status Network homepage.',
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
    <html lang={locale}>
      <body
        className={`${inter.variable} bg-white-100 text-neutral-100 antialiased selection:bg-purple selection:text-white-100`}
        suppressHydrationWarning
      >
        <main className="flex min-h-dvh flex-1 items-center justify-center px-5">
          <div className="flex max-w-[696px] flex-col items-center gap-8">
            <h1 className="text-balance text-center text-40 font-700 lg:text-64">
              {title}
            </h1>

            <ButtonLink href="/">{takeMeHome}</ButtonLink>
          </div>
        </main>
      </body>
    </html>
  )
}
