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
const IGNORED_CONSOLE_ERRORS = [
  // The help search dialog has no DialogTitle (Radix accessibility warning).
  /`DialogContent` requires a `DialogTitle`/,
]

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

/**
 * Desktop platforms: the user agent that `PlatformDetector` maps to each one,
 * the nav link it shows, and the release asset `/api/download/<platform>`
 * redirects to.
 */
export const STATUS_APP_DESKTOP_DOWNLOADS = [
  {
    platform: 'macos',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    link: /download for macos/i,
    endpoint: '/api/download/macos-silicon',
    asset: /aarch64\.dmg$/,
  },
  {
    platform: 'windows',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    link: /download for windows/i,
    endpoint: '/api/download/windows',
    asset: /\.exe$/,
  },
  {
    platform: 'linux',
    userAgent:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    link: /download for linux/i,
    endpoint: '/api/download/linux',
    asset: /x86_64\.tar\.gz$/,
  },
] as const

/**
 * User agent for direct calls to `/api/download/*`. The route forwards it to
 * Umami, which drops requests from bots, so these checks are not counted as
 * downloads.
 */
export const E2E_BOT_USER_AGENT = 'status-web-e2e-bot/1.0'
