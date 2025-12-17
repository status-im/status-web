import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import { routing } from './routing'

type MessageValue = string | Record<string, unknown>
type Messages = Record<string, MessageValue>

// Transform messages: { key: { translation: "value", notes: "..." } } -> { key: "value" }
// Preserves nested structure for next-intl
function transformMessages(obj: Record<string, unknown>): Messages {
  const result: Messages = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const objValue = value as Record<string, unknown>
      // If it has a 'translation' property, extract just the translation string
      if (
        'translation' in objValue &&
        typeof objValue['translation'] === 'string'
      ) {
        result[key] = objValue['translation']
      } else {
        // Otherwise, recurse into nested object (preserving structure)
        result[key] = transformMessages(objValue)
      }
    } else if (typeof value === 'string') {
      result[key] = value
    }
  }

  return result
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale

  // If no locale is requested (e.g., root path), use default locale
  // This prevents browser language detection from overriding the default
  const locale =
    requested && hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale

  const rawMessages = (await import(`../../messages/${locale}.json`)).default
  const messages = transformMessages(rawMessages)

  return {
    locale,
    messages,
  }
})
