import 'server-only'

import { serverEnv } from '~/config/env.server.mjs'

const DEFAULT_UMAMI_API_URL = 'https://umami.bi.status.im/api/send'

type EventPayload = Record<string, string | number | boolean | null | undefined>

/**
 * Server-side Umami event tracking.
 *
 * Replaces `@vercel/analytics/server` for self-hosted deployments. Fires from
 * route handlers (e.g. `/api/download/*` where the server-side redirect
 * prevents client-side tracking from firing).
 *
 * Configured via env:
 *   UMAMI_WEBSITE_ID  — required; the website ID from the Umami dashboard
 *   UMAMI_API_URL     — optional; defaults to https://umami.bi.status.im/api/send
 *
 * Errors are swallowed: analytics must never break the user's request.
 *
 * @see https://umami.is/docs/api/sending-stats
 */
export async function track(
  name: string,
  data?: EventPayload,
  request?: Request
): Promise<void> {
  const websiteId = serverEnv.UMAMI_WEBSITE_ID
  if (!websiteId) {
    return
  }

  const endpoint = serverEnv.UMAMI_API_URL ?? DEFAULT_UMAMI_API_URL
  const userAgent = request?.headers.get('user-agent') ?? 'status-app-server'
  const referrer = request?.headers.get('referer') ?? ''
  const url = request ? new URL(request.url).pathname : '/'

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgent,
      },
      body: JSON.stringify({
        type: 'event',
        payload: {
          website: websiteId,
          name,
          data,
          url,
          referrer,
        },
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      console.warn(`[umami] track('${name}') responded with ${response.status}`)
    }
  } catch (error) {
    console.warn(`[umami] track('${name}') failed:`, error)
  }
}
