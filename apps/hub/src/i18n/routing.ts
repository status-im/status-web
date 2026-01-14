import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ko'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Show locale prefix only when needed
  localePrefix: 'as-needed',

  // Disable automatic locale detection
  localeDetection: true,
})
