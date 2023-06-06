import { EthereumClient } from '@status-im/js'

let client: EthereumClient | undefined

export function getEthereumClient(): EthereumClient | undefined {
  if (!client) {
    if (!process.env.INFURA_API_KEY) {
      console.error('INFURA_API_KEY is not set')

      return
    }

    client = new EthereumClient(
      `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
    )

    return client
  }

  return client
}
