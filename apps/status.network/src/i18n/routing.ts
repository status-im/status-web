import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ko'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Always show locale prefix in URL
  localePrefix: 'as-needed',

  // Disable automatic locale detection
  localeDetection: false,
})
