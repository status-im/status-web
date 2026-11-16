import 'server-only'

import { createAPI } from '@status-im/wallet/data'

/**
 * Builds a caller per request. `createAPI` reads the incoming request headers
 * (memoized per request with React `cache()`), which the rate limiter uses to
 * identify the client, so the caller must never be shared across requests.
 */
export async function getAPIClient() {
  return createAPI()
}
