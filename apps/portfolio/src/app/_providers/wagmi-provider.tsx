'use client'

import { statusConnector } from '@status-im/wallet/connectors'
import { createConfig, http, WagmiProvider as WagmiProviderBase } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

import type React from 'react'

export const config = createConfig({
  chains: [mainnet],
  ssr: false,
  connectors: [
    injected(),
    statusConnector(), // Status Wallet connector - disabled due to build errors
  ],
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
