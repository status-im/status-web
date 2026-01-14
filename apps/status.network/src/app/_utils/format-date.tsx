import { localeMap } from '~/i18n/locale-map'

export function formatDate(
  date: Date | string,
  style: Intl.DateTimeFormatOptions['dateStyle'] = 'medium',
  locale?: string,
): string {
  const resolvedLocale = localeMap[locale ?? 'en'] ?? (locale || 'en')

  return new Intl.DateTimeFormat(resolvedLocale, { dateStyle: style }).format(
    new Date(date),
  )
}
