'use client'

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
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
