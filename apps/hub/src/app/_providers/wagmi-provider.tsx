'use client'

import { createConfig, http, WagmiProvider as WagmiProviderBase } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

import type React from 'react'

export const config = createConfig({
  chains: [mainnet],
  ssr: false,
  connectors: [injected()],
  transports: {
    // todo: replace public clients
    [mainnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

type Props = {
  children: React.ReactNode
}

function WagmiProvider(props: Props) {
  const { children } = props

  return (
    <WagmiProviderBase
      config={
        config as unknown as React.ComponentProps<
          typeof WagmiProviderBase
        >['config']
      }
    >
      {children}
    </WagmiProviderBase>
  )
}

export { config as wagmiConfig, WagmiProvider }
