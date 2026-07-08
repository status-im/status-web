import { routing } from '~/i18n/routing'
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'

export const dynamicParams = false

// Static export requires at least one param; this placeholder always 404s.
export function generateStaticParams() {
  return routing.locales.map(locale => ({
    locale,
    rest: ['_'],
  }))
}

export default function CatchAllPage() {
  notFound()
}
