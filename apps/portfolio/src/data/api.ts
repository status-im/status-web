import 'server-only'

import { createAPI } from '@status-im/wallet/data'

let apiClient: Awaited<ReturnType<typeof createAPI>> | undefined

export async function getAPIClient() {
  if (!apiClient) {
    apiClient = await createAPI()
  }

  return apiClient
}
