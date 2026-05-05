'use client'

import { ToastContainer } from '@status-im/components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { mainnet } from 'viem/chains'
import { WagmiProvider } from 'wagmi'

import { wagmiConfig } from '~constants/chain'
import { PreDepositStateProvider } from '~hooks/usePreDepositStateContext'

import { PreDepositProvider } from './pre-deposit-provider'

interface ProvidersProps {
  children: React.ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      retryOnMount: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
})

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          options={{
            initialChainId: mainnet.id,
          }}
        >
          <PreDepositStateProvider>
            <PreDepositProvider>
              {children}
              <ToastContainer />
            </PreDepositProvider>
          </PreDepositStateProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
