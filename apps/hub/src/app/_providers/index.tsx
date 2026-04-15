'use client'

import { ToastContainer } from '@status-im/components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider, SIWEProvider } from 'connectkit'
import { WagmiProvider } from 'wagmi'

import { statusHoodi, wagmiConfig } from '~constants/chain'
import { siweConfig } from '~constants/siwe'
import { PreDepositStateProvider } from '~hooks/usePreDepositStateContext'
import { VaultStateProvider } from '~hooks/useVaultStateContext'

import { BringIDProvider } from './bringid-provider'
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
 * 5. PreDepositStateProvider - Pre-deposit state machine
 * 6. VaultStateProvider - Vault operation state machine
 * 7. VaultProvider - Vault-specific features
 * 8. BringIDProvider - BringID identity verification modal
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SIWEProvider {...siweConfig}>
          <ConnectKitProvider
            options={{
              initialChainId: statusHoodi.id,
            }}
          >
            <PreDepositStateProvider>
              <VaultStateProvider>
                <VaultProvider>
                  <BringIDProvider>
                    {children}
                    <ToastContainer />
                  </BringIDProvider>
                </VaultProvider>
              </VaultStateProvider>
            </PreDepositStateProvider>
          </ConnectKitProvider>
        </SIWEProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
