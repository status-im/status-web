'use client'

import { WagmiProvider as WagmiProviderBase } from 'wagmi'

import { config } from '../config/wagmi'

import type React from 'react'

export { config as wagmiConfig }

type Props = {
  children: React.ReactNode
}

export function WagmiProvider(props: Props) {
  const { children } = props

  return <WagmiProviderBase config={config}>{children}</WagmiProviderBase>
}
