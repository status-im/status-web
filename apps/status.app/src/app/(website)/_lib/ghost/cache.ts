import { unstable_cache } from 'next/cache'

import { clientEnv } from '~/config/env.client.mjs'

const GHOST_RETRY_SECONDS = 60

export function cacheGhostResult<Args extends unknown[], Result>(
  name: string,
  read: (...args: Args) => Promise<Result>
) {
  const pending = new Map<string, Promise<Result | null>>()

  return unstable_cache(
    async (...args: Args) => {
      const key = JSON.stringify(args)
      const inFlight = pending.get(key)
      if (inFlight) return inFlight

      // Cache failures too so repeated requests do not wait on a dead origin.
      const result = read(...args)
        .catch(error => {
          console.error(`Failed to fetch ${name} from Ghost:`, error)
          return null
        })
        .finally(() => pending.delete(key))

      pending.set(key, result)
      return result
    },
    ['status-app-ghost', clientEnv.NEXT_PUBLIC_GHOST_API_URL, name],
    { revalidate: GHOST_RETRY_SECONDS }
  )
}

export function ghostFeedUnavailable() {
  return new Response('Feed temporarily unavailable', {
    status: 503,
    headers: {
      'cache-control': 'no-store',
      'retry-after': String(GHOST_RETRY_SECONDS),
    },
  })
}
