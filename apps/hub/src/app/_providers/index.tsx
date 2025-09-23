'use client'

import { QueryClientProvider, WagmiProvider } from '@status-im/wallet/providers'
import { ConnectKitProvider as ConnectKit } from 'connectkit'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider>
      <QueryClientProvider>
        <ConnectKit>{children}</ConnectKit>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
