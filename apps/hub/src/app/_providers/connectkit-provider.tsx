'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider as ConnectKit } from 'connectkit'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { mainnet } from 'wagmi/chains'

import { AccountProvider } from './account-provider'

const config = createConfig({
  chains: [mainnet],
  ssr: false,
  transports: {
    [mainnet.id]: http(),
  },
})

const queryClient = new QueryClient()

type ConnectKitProviderProps = {
  children: React.ReactNode
}

export function ConnectKitProvider({ children }: ConnectKitProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AccountProvider>
          <ConnectKit>{children}</ConnectKit>
        </AccountProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
