import { hasLocale } from 'next-intl'

import { routing } from './routing'

type MessageValue = string | Record<string, unknown>
export type Messages = Record<string, MessageValue>

export function transformMessages(obj: Record<string, unknown>): Messages {
  const result: Messages = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const objValue = value as Record<string, unknown>
      if (
        'translation' in objValue &&
        typeof objValue['translation'] === 'string'
      ) {
        result[key] = objValue['translation']
      } else {
        result[key] = transformMessages(objValue)
      }
    } else if (typeof value === 'string') {
      result[key] = value
    }
  }

  return result
}

export async function loadMessages(locale: string): Promise<Messages> {
  const resolvedLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale

  const rawMessages = (await import(`../../messages/${resolvedLocale}.json`))
    .default as Record<string, unknown>

  return transformMessages(rawMessages)
}
