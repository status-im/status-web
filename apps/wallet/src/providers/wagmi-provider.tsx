'use client'

import { createClient } from 'viem'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { arbitrum, base, bsc, mainnet, optimism, polygon } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

import { StatusAutoConnect } from './status-auto-connect'

export const supportedChains = [
  mainnet,
  optimism,
  arbitrum,
  base,
  polygon,
  bsc,
] as const

type Props = {
  children: React.ReactNode
}

function WagmiProviderComponent(props: Props) {
  const { children } = props

  const config = createConfig({
    chains: supportedChains,
    connectors: [injected()],
    client({ chain }) {
      return createClient({ chain, transport: http() })
    },
  })

  return (
    <WagmiProvider config={config} reconnectOnMount={true}>
      <StatusAutoConnect />
      {children}
    </WagmiProvider>
  )
}

export { WagmiProviderComponent as WagmiProvider }
