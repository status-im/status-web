import { createConfig, http } from 'wagmi'
import { arbitrum, mainnet, optimism } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, optimism, arbitrum],
  ssr: false,
  transports: {
    // todo: replace public clients
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
