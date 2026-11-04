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
