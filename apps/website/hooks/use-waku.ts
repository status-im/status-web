import { useState, useEffect } from 'react'

import { createRequestClient } from '@status-im/js'

export type Client = Awaited<ReturnType<typeof createRequestClient>>

export const useWaku = (
  publicKey: string | undefined,
  onReady: (client: Client) => Promise<void>,
) => {
  const [client, setClient] = useState<Client>()

  useEffect(() => {
    if (!publicKey) {
      return
    }

    const load = async () => {
      const client = await createRequestClient({
        environment: 'test',
      })

      onReady(client)
      setClient(client)
    }

    load()
  }, [publicKey])

  return client
}
