'use client'

import { WagmiProvider } from 'wagmi'

import { config } from './_config'

type Props = {
  children: React.ReactNode
}

function _WagmiProvider(props: Props) {
  const { children } = props

  return <WagmiProvider config={config}>{children}</WagmiProvider>
}

export { _WagmiProvider as WagmiProvider }
