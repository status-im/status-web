'use client'

import { VaultStateProvider } from '../_hooks/useVaultStateContext'
import { ConnectKitProvider } from './connectkit-provider'
import { QueryClientProvider } from './query-client-provider'
import { WagmiProvider } from './wagmi-provider'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider>
      <QueryClientProvider>
        <ConnectKitProvider>
          <VaultStateProvider>{children}</VaultStateProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
