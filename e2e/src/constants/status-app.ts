import { STATUS_APP_URL, strictConsole } from '@config/site.js'

import type { SiteRules } from '@fixtures/site.fixture.js'

/** Analytics endpoints answered locally so test runs are not counted. */
const BLOCKED_REQUESTS = [
  /umami\.bi\.status\.im/,
  /\/_vercel\/(insights|speed-insights)\//,
  /va\.vercel-scripts\.com/,
]

/**
 * Console errors that do not fail a test. Each entry is a known site bug: fix
 * it, then delete the entry.
 */
const IGNORED_CONSOLE_ERRORS: RegExp[] = []

export const STATUS_APP_RULES: SiteRules = {
  blockedRequests: BLOCKED_REQUESTS,
  ignoredConsoleErrors: IGNORED_CONSOLE_ERRORS,
  strictConsole: strictConsole(STATUS_APP_URL),
  testIntervalMs: 0,
}

/** Known console errors limited to one route, same rule as above. */
export const STATUS_APP_KNOWN_ROUTE_ERRORS: Record<string, RegExp[]> = {
  // The exchanges table renders "x minutes ago" on the server and again in the
  // browser, so the text never matches (React error #418).
  '/snt/exchanges': [/#418|hydrat/i],
}

/**
 * Pages every run opens. Each must answer 200 and render a non-empty `h1`;
 * page-specific checks live in their own spec.
 */
export const STATUS_APP_CORE_ROUTES = [
  '/',
  '/apps',
  '/blog',
  '/brand',
  '/help',
  '/jobs',
  '/keycard',
  '/learn',
  '/legal/privacy-policy',
  '/legal/terms-of-use',
  '/manifesto',
  '/security',
  '/snt',
  '/snt/exchanges',
  '/snt/release-schedule',
  '/specs',
  '/team',
] as const
