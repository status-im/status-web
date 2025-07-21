import { createClient } from 'viem'
import { createConfig, http, injected } from 'wagmi'
import { arbitrum, mainnet, optimism } from 'wagmi/chains'

export const supportedChains = [mainnet, optimism, arbitrum] as const

export const config = createConfig({
  chains: supportedChains,
  ssr: false,
  connectors: [injected()],
  // todo: replace public clients
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
