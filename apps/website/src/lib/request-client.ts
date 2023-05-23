import { createRequestClient } from '@status-im/js'

import type { RequestClient } from '@status-im/js'

let client: RequestClient | undefined

export async function getRequestClient(): Promise<RequestClient> {
  if (!client) {
    client = await createRequestClient({ environment: 'test' })

    return client
  }

  return client
}
