import { createRequestClient } from '@felicio/js'

import type { RequestClient } from '@felicio/js'

let client: RequestClient | undefined

export async function getRequestClient(): Promise<RequestClient> {
  if (!client) {
    client = await createRequestClient({ environment: 'production' })

    return client
  }

  return client
}
