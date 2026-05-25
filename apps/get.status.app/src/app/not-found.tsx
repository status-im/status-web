import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description:
    'The page you were looking for could not be found. Return to the Status homepage.',
  robots: { index: false },
}

const NOT_FOUND_COPY = {
  title: "Oh no! It looks like you're lost",
  description: "The page you were looking for doesn't exist",
  goHome: 'Go to homepage',
} as const

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-8 px-5 text-center">
      <div className="flex max-w-lg flex-col items-center gap-2">
        <h1 className="text-19 font-semibold">{NOT_FOUND_COPY.title}</h1>
        <p className="text-15">{NOT_FOUND_COPY.description}</p>
      </div>
      <a className="underline" href="/">
        {NOT_FOUND_COPY.goHome}
      </a>
    </main>
  )
}
