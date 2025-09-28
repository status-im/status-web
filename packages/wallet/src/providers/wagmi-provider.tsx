'use client'

import { createConfig, http, WagmiProvider as WagmiProviderBase } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

import type React from 'react'

export const config = createConfig({
  chains: [mainnet],
  ssr: false,
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: '8df20b513ed696e861c8d97865870271',
      showQrModal: false,
    }),
  ],
  transports: {
    // todo: replace public clients
    [mainnet.id]: http(),
  },
}) as unknown

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

  const wagmiConfig = (() => {
    const cast = config as unknown
    return cast as React.ComponentProps<typeof WagmiProviderBase>['config']
  })()

  return <WagmiProviderBase config={wagmiConfig}>{children}</WagmiProviderBase>
}

export { config as wagmiConfig, WagmiProvider }
