import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ko'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Use 'as-needed' - default locale (en) has no prefix, others (ko) do
  // Note: Static export normally requires 'always', but our build script
  // handles copying /en files to root, so 'as-needed' works for client-side nav
  localePrefix: 'as-needed',

  // Disable automatic locale detection (required for static export)
  localeDetection: false,
})
