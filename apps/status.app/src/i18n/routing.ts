import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  // Only `en` is shipped, so Accept-Language detection can't change the
  // response — disabling it avoids per-request content-negotiation (Vary,
  // NEXT_LOCALE cookie) that contributes to cloaking false-positives and aligns
  // with get.status.app. why: https://github.com/status-im/status-web/issues/1236
  localeDetection: false,
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
  'login',
  'c',
  'cc',
  'u',
  'rss',
  'mobile-news',
  'desktop-news',
] as const
