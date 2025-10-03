'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { WagmiProvider } from 'wagmi'
import { mainnet } from 'wagmi/chains'

import { defineWagmiConfig } from '../wagmi'
import { ActionStatusDialog } from './_components/stake/action-status-dialog'
import { useActionStatusContent } from './_components/stake/use-action-status-content'
import { useVaultStateMachine } from './_hooks/use-vault-state-machine'

const config = defineWagmiConfig({
  chains: [mainnet],
  ssr: false,
})

const queryClient = new QueryClient()

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const { state: vaultState, reset: resetVault } = useVaultStateMachine()
  const dialogContent = useActionStatusContent(vaultState)

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>

        {dialogContent && (
          <ActionStatusDialog
            open={true}
            onClose={resetVault}
            title={dialogContent.title}
            description={dialogContent.description}
            state={dialogContent.state}
            showCloseButton={dialogContent.showCloseButton}
          />
        )}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
