import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ko'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: true,
})

/**
 * Paths that should not be processed by the i18n middleware.
 * Used in both middleware matcher and Link component.
 */
export const nonLocalizedPaths = [
  'api',
  'admin',
  'c',
  'cc',
  'u',
  'rss',
  'mobile-news',
  'desktop-news',
] as const
