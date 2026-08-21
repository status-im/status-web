import { clientEnv } from '~/config/env.client.mjs'
import { SITE_URL } from '~/config/site'

/**
 * Absolute origin for URLs this app bakes into its output: Article JSON-LD,
 * social share links and the RSS feed.
 *
 * why the canonical origin is the fallback: these URLs are rendered during
 * `next build` (SSG/ISR), when neither the Vercel system vars nor the runtime
 * `SITE_URL` are guaranteed to exist. Falling through to `localhost` there
 * shipped `http://localhost:3001` to crawlers on every blog post, so localhost
 * is now opt-in for non-production builds only.
 */
export function baseUrl() {
  if (clientEnv.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return SITE_URL
  }

  if (clientEnv.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${clientEnv.NEXT_PUBLIC_VERCEL_URL}`
  }

  if (clientEnv.NODE_ENV !== 'production') {
    return `http://localhost:${clientEnv.PORT ?? 3000}`
  }

  return SITE_URL
}
