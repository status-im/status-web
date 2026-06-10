import { ButtonLink } from './_components/button-link'
import { Metadata } from './_metadata'

export const metadata = Metadata({
  title: '404 — Page Not Found',
  description:
    'The page you were looking for could not be found. Return to the Status Network homepage.',
  robots: {
    index: false,
  },
})

// Outside [locale] routes — use static copy (no next-intl request context).
const NOT_FOUND_COPY = {
  title: "This is not the page you're looking for",
  takeMeHome: 'Take me home',
} as const

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100dvh-189px)] flex-1 items-center justify-center px-5 lg:min-h-[calc(100dvh-118px)]">
      <div className="flex max-w-[696px] flex-col items-center gap-8">
        <h1 className="text-center text-40 font-700 lg:text-64">
          {NOT_FOUND_COPY.title}
        </h1>

        <ButtonLink href="/">{NOT_FOUND_COPY.takeMeHome}</ButtonLink>
      </div>
    </main>
  )
}
