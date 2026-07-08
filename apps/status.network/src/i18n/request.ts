import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'
import { loadMessages } from './messages'
import { routing } from './routing'

async function resolveLocale(requested: string | undefined) {
  if (requested && hasLocale(routing.locales, requested)) {
    return requested
  }

  const headerLocale = (await headers()).get('x-next-intl-locale')
  if (headerLocale && hasLocale(routing.locales, headerLocale)) {
    return headerLocale
  }

  const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value
  if (cookieLocale && hasLocale(routing.locales, cookieLocale)) {
    return cookieLocale
  }

  return routing.defaultLocale
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = await resolveLocale(requested)
  const messages = await loadMessages(locale)

  return {
    locale,
    messages,
  }
})
