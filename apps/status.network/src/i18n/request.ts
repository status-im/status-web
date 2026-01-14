import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment from the URL
  const requested = await requestLocale

  // Validate and use the requested locale, or fall back to default
  // This is necessary even with localeDetection enabled, as requestLocale
  // can be undefined (e.g., root path) or invalid (not in supported locales)
  const locale =
    requested && hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
