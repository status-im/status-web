'use client'

import { ToastContainer } from '@status-im/components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { WagmiProvider } from 'wagmi'

import { testnet, wagmiConfig } from '~constants/chain'
import { VaultStateProvider } from '~hooks/useVaultStateContext'

import { SiweProvider } from './siwe-provider'
import { VaultProvider } from './vault-provider'

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

/**
 * Application Providers
 *
 * Provider hierarchy (order matters):
 * 1. WagmiProvider - Blockchain connection & wallet state
 * 2. QueryClientProvider - React Query for data fetching
 * 3. SiweProvider - SIWE authentication
 * 4. ConnectKitProvider - Wallet connection UI
 * 5. VaultStateProvider - Vault operation state machine
 * 6. VaultProvider - Vault-specific features
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SiweProvider>
          <ConnectKitProvider
            options={{
              initialChainId: testnet.id,
            }}
          >
            <VaultStateProvider>
              <VaultProvider>
                {children}
                <ToastContainer />
              </VaultProvider>
            </VaultStateProvider>
          </ConnectKitProvider>
        </SiweProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
