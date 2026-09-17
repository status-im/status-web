import { EthereumClient } from '@status-im/js'

import { serverEnv } from '~/config/env.server.mjs'

let client: EthereumClient | undefined

export function getEthereumClient(): EthereumClient | undefined {
  if (!client) {
    client = new EthereumClient(
      `https://mainnet.infura.io/v3/${serverEnv.INFURA_API_KEY}`,
      1
    )

    return client
  }

  return client
}
