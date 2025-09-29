import { createRequestClient } from '@status-im/js'

import { clientEnv } from '~/config/env.client.mjs'

import type { RequestClient } from '@status-im/js'

let client: RequestClient | undefined

export async function getRequestClient(): Promise<RequestClient> {
  if (!client) {
    client = await createRequestClient({
      environment: clientEnv.NEXT_PUBLIC_VERCEL_ENV,
      ethProviderApiKey: clientEnv.NEXT_PUBLIC_INFURA_API_KEY,
    })

    return client
  }

  return client
}
