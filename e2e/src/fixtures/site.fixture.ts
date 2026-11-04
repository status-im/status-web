import { BYPASS_HEADER, BYPASS_TOKEN } from '@config/site.js'
import { expect, test as base } from '@playwright/test'

import type {
  APIRequestContext,
  BrowserContext,
  Page,
  Request,
} from '@playwright/test'

/**
 * Fixture for website suites that run against a live URL (local, staging or
 * production).
 *
 * - Adds the CDN bypass header to same-origin requests only. A custom header on
 *   a cross-origin fetch would trigger a CORS preflight the third party rejects.
 * - Answers analytics requests locally so test traffic never shows up in Umami
 *   or Vercel Analytics.
 * - Fails a test on uncaught page errors and, with `strictConsole`, on console
 *   errors that are not in `ignoredConsoleErrors`.
 */

export interface SiteRules {
  /** URL patterns answered with an empty 200 instead of reaching the network. */
  blockedRequests: RegExp[]
  /** Console errors that do not fail the test. */
  ignoredConsoleErrors: RegExp[]
  /**
   * Fail on `console.error` too, not only on uncaught page errors. Off against
   * `next dev`, which logs development warnings that production builds strip.
   */
  strictConsole: boolean
  /**
   * Minimum time between the starts of two tests in one worker. A fresh
   * context downloads every chunk again, so back-to-back tests can trip a
   * server rate limit (logos.co answers 503 past roughly 10 requests a second).
   */
  testIntervalMs: number
}

/**
 * One object rather than two array options: `test.use` reads a two-item array
 * whose second item is an object (such as a RegExp) as `[value, options]`.
 */
export interface SiteOptions {
  siteRules: SiteRules
}

interface SiteFixtures {
  /** Console and page errors seen so far; checked when the test ends. */
  consoleErrors: string[]
  /** Waits out `testIntervalMs` before the test starts. */
  pacing: void
}

// One value per worker process.
let lastTestStart = 0

function isSameOrigin(request: Request, baseURL: string | undefined) {
  if (!baseURL) return false
  return new URL(request.url()).origin === new URL(baseURL).origin
}

const REQUEST_METHODS = new Set([
  'delete',
  'fetch',
  'get',
  'head',
  'patch',
  'post',
  'put',
])

/**
 * Wrap an API request context so the bypass header goes to the site under test
 * only. Specs also call GitHub through `request`, and the token must never
 * leave the origin it was issued for.
 */
function withBypassHeader(
  request: APIRequestContext,
  baseURL: string | undefined,
): APIRequestContext {
  if (!BYPASS_TOKEN || !baseURL) return request
  const origin = new URL(baseURL).origin

  return new Proxy(request, {
    get(target, property, receiver) {
      const value: unknown = Reflect.get(target, property, receiver)
      if (typeof value !== 'function') return value
      if (typeof property !== 'string' || !REQUEST_METHODS.has(property)) {
        return value.bind(target)
      }
      return (
        url: unknown,
        options: { headers?: Record<string, string> } = {},
      ) => {
        const sameOrigin =
          typeof url === 'string' && new URL(url, baseURL).origin === origin
        const headers = sameOrigin
          ? { ...options.headers, [BYPASS_HEADER]: BYPASS_TOKEN }
          : options.headers
        return value.call(target, url, { ...options, headers })
      }
    },
  })
}

async function prepareContext(
  context: BrowserContext,
  baseURL: string | undefined,
  blockedRequests: RegExp[],
) {
  for (const pattern of blockedRequests) {
    await context.route(pattern, route =>
      route.fulfill({
        status: 200,
        contentType:
          route.request().resourceType() === 'script'
            ? 'application/javascript'
            : 'text/plain',
        body: '',
      }),
    )
  }

  if (!BYPASS_TOKEN) return

  // Registered last so it runs first; blocked requests fall through to the
  // handlers above.
  await context.route('**/*', route => {
    if (!isSameOrigin(route.request(), baseURL)) return route.fallback()
    return route.fallback({
      headers: { ...route.request().headers(), [BYPASS_HEADER]: BYPASS_TOKEN },
    })
  })
}

function collectErrors(page: Page, errors: string[], strictConsole: boolean) {
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`))
  if (!strictConsole) return
  page.on('console', message => {
    if (message.type() !== 'error') return
    const location = message.location().url
    errors.push(
      location
        ? `${message.text()} (${location})`
        : `console: ${message.text()}`,
    )
  })
}

export const test = base.extend<SiteOptions & SiteFixtures>({
  siteRules: [
    {
      blockedRequests: [],
      ignoredConsoleErrors: [],
      strictConsole: true,
      testIntervalMs: 0,
    },
    { option: true },
  ],

  context: async ({ context, baseURL, siteRules }, use) => {
    await prepareContext(context, baseURL, siteRules.blockedRequests)
    await use(context)
  },

  request: async ({ playwright, baseURL }, use) => {
    const request = await playwright.request.newContext({ baseURL })
    await use(withBypassHeader(request, baseURL))
    await request.dispose()
  },

  pacing: [
    async ({ siteRules }, use) => {
      const wait = lastTestStart + siteRules.testIntervalMs - Date.now()
      if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait))
      lastTestStart = Date.now()
      await use()
    },
    { auto: true },
  ],

  consoleErrors: [
    async ({ page, siteRules }, use) => {
      const errors: string[] = []
      collectErrors(page, errors, siteRules.strictConsole)
      await use(errors)
      const unexpected = errors.filter(
        error =>
          !siteRules.ignoredConsoleErrors.some(pattern => pattern.test(error)),
      )
      expect(unexpected, 'console or page errors').toEqual([])
    },
    { auto: true },
  ],
})

export { expect }
