import { createConfig, http, injected } from 'wagmi'
import { mainnet } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet],
  ssr: false,
  transports: {
    // todo: replace public clients
    [mainnet.id]: http(),
  },
  connectors: [injected()],
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
