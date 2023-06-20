import { EthereumClient } from '@status-im/js'

import { env } from '@/config/env.mjs'

let client: EthereumClient | undefined

export function getEthereumClient(): EthereumClient | undefined {
  if (!client) {
    client = new EthereumClient(
      `https://mainnet.infura.io/v3/${env.INFURA_API_KEY}`
    )

    return client
  }

  return client
}
