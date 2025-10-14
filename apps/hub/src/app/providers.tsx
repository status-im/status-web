'use client'

import { ToastContainer } from '@status-im/components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { WagmiProvider } from 'wagmi'

import { ActionStatusDialog } from '~components/stake/action-status-dialog'
import { useActionStatusContent } from '~components/stake/hooks/use-action-status-content'
import { statusNetworkTestnet } from '~constants/index'
import {
  useVaultStateContext,
  VaultStateProvider,
} from '~hooks/useVaultStateContext'

import { defineWagmiConfig } from '../wagmi'

const config = defineWagmiConfig({
  chains: [statusNetworkTestnet],
  ssr: false,
})

const queryClient = new QueryClient()

const ProvidersContent = ({ children }: { children: React.ReactNode }) => {
  const { state: vaultState, reset: resetVault } = useVaultStateContext()
  const dialogContent = useActionStatusContent(vaultState)

  return (
    <>
      {children}

      {dialogContent && (
        <ActionStatusDialog
          open={true}
          onClose={resetVault}
          {...dialogContent}
        />
      )}
    </>
  )
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <VaultStateProvider>
            <ProvidersContent>{children}</ProvidersContent>
            <ToastContainer />
          </VaultStateProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
