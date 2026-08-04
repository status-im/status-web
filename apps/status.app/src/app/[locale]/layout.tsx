import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import { routing } from '~/i18n/routing'

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

  // Keeps next-intl on the route param instead of `headers()` so this subtree
  // can be prerendered. why: https://next-intl.dev/docs/getting-started/app-router
  setRequestLocale(locale)

  return children
}
