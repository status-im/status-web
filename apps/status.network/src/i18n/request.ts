import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale

  // If no locale is requested (e.g., root path), use default locale
  // This prevents browser language detection from overriding the default
  const locale =
    requested && hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
