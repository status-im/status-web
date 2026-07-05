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

export const metadata = Metadata({
  title: '404 — Page Not Found',
  description:
    'The page you were looking for could not be found. Return to the Status Network homepage.',
  robots: {
    index: false,
  },
})

const NOT_FOUND_COPY = {
  title: "This is not the page you're looking for",
  takeMeHome: 'Take me home',
} as const

// Fallback for routes outside `[locale]` during static export.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} bg-white-100 text-neutral-100 antialiased selection:bg-purple selection:text-white-100`}
        suppressHydrationWarning
      >
        <main className="flex min-h-dvh flex-1 items-center justify-center px-5">
          <div className="flex max-w-[696px] flex-col items-center gap-8">
            <h1 className="text-center text-40 font-700 lg:text-64">
              {NOT_FOUND_COPY.title}
            </h1>

            <ButtonLink href="/">{NOT_FOUND_COPY.takeMeHome}</ButtonLink>
          </div>
        </main>
      </body>
    </html>
  )
}
