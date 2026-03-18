import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: true,
})

/**
 * Paths that should not be processed by the i18n middleware.
 * NOTE: These values are duplicated in the middleware config.matcher
 *       because Next.js requires config to be static.
 *       If you change this list, also update src/middleware.ts.
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
