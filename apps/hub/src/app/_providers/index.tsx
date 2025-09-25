'use client'

import { QueryClientProvider, WagmiProvider } from '@status-im/wallet/providers'

import { ConnectKitProvider } from './connectkit-provider'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider>
      <QueryClientProvider>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
