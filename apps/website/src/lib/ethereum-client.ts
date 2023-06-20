import { EthereumClient } from '@status-im/js'

import { envServer } from '@/config/env.server.mjs'

let client: EthereumClient | undefined

export function getEthereumClient(): EthereumClient | undefined {
  if (!client) {
    client = new EthereumClient(
      `https://mainnet.infura.io/v3/${envServer.INFURA_API_KEY}`
    )

    return client
  }

  return client
}
