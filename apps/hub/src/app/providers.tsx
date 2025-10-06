'use client'

import { ToastContainer } from '@status-im/components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { WagmiProvider } from 'wagmi'

import { statusNetworkTestnet } from '../config/chain'
import { defineWagmiConfig } from '../wagmi'
import { ActionStatusDialog } from './_components/stake/action-status-dialog'
import { useActionStatusContent } from './_components/stake/use-action-status-content'
import {
  useVaultStateContext,
  VaultStateProvider,
} from './_hooks/vault-state-context'

const config = defineWagmiConfig({
  chains: [statusNetworkTestnet],
  ssr: false,
})

const queryClient = new QueryClient()

const ProvidersContent = ({ children }: { children: React.ReactNode }) => {
  const { state: vaultState, reset: resetVault } = useVaultStateContext()
  const dialogContent = useActionStatusContent(vaultState)

  console.log('vaultState', vaultState)
  console.log('dialogContent', dialogContent)

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
