'use client'

import { createConfig, http, WagmiProvider as WagmiProviderBase } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

import { clientEnv } from '~/config/env.client.mjs'

import type React from 'react'

export const config = createConfig({
  chains: [mainnet],
  ssr: false,
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: clientEnv.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      showQrModal: false,
    }),
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
