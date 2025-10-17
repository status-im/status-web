'use client'

import { PreDepositStateProvider } from '../_hooks/usePreDepositStateContext'
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
          <PreDepositStateProvider>{children}</PreDepositStateProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
