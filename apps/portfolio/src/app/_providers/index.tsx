'use client'

import { Suspense } from 'react'

// import { QueryClientProvider, WagmiProvider } from '@status-im/wallet/providers'
import { AccountsProvider } from './accounts-context'
import { ConnectKitProvider } from './connectkit-provider'
import { QueryClientProvider } from './query-client-provider'
import { StatusProvider } from './status-provider'
import { WagmiProvider } from './wagmi-provider'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <StatusProvider>
      <WagmiProvider>
        <QueryClientProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <AccountsProvider>
              <ConnectKitProvider>{children}</ConnectKitProvider>
            </AccountsProvider>
          </Suspense>
        </QueryClientProvider>
      </WagmiProvider>
    </StatusProvider>
  )
}
