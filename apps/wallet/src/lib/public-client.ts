import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

import { getRpcProxyUrl } from './rpc-proxy'

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(getRpcProxyUrl(mainnet.id)),
})
