// import { Suspense } from 'react'

// import OnboardingPage from '../../../portfolio/src/app/page'
import { ToastContainer } from '@status-im/components'
import { Navbar } from '@status-im/wallet/components'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createRootRouteWithContext,
  HeadContent,
  // Navigate,
  Outlet,
  redirect,
  useRouterState,
} from '@tanstack/react-router'

// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
// import { NotAllowed } from '../../../portfolio/src/app/_components/not-allowed'
// import { AccountsProvider } from '../../../portfolio/src/app/_providers/accounts-context'
// import { ConnectKitProvider } from '../../../portfolio/src/app/_providers/connectkit-provider'
// import { QueryClientProvider } from '../../../portfolio/src/app/_providers/query-client-provider'
// import { StatusProvider } from '../../../portfolio/src/app/_providers/status-provider'
import { WagmiProvider } from '../../../portfolio/src/app/_providers/wagmi-provider'
import { Link } from '../components/link'
import { apiClient } from '../providers/api-client'
import { WalletProvider } from '../providers/wallet-context'

// import { Inter } from 'next/font/google'
import type { QueryClient } from '@tanstack/react-query'

// const inter = Inter({
//   variable: '--font-sans',
//   weight: ['400', '500', '600', '700'],
//   subsets: ['latin'],
//   preload: true,
// })

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  beforeLoad: async ({ location }) => {
    const wallets = await apiClient.wallet.all.query()
    const hasWallets = wallets && wallets.length > 0

    if (location.pathname === '/') {
      if (hasWallets) {
        throw redirect({ to: '/portfolio/assets' })
      } else {
        throw redirect({ to: '/onboarding' })
      }
    }

    if (location.pathname.startsWith('/portfolio') && !hasWallets) {
      throw redirect({ to: '/onboarding' })
    }

    if (location.pathname.startsWith('/onboarding') && hasWallets) {
      throw redirect({ to: '/portfolio/assets' })
    }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Status Portfolio Wallet',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  return (
    <>
      {/* <div className="min-h-screen bg-neutral-100 text-white-100">
        <div className="flex gap-4 p-4">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
          <Link to="/onboarding" className="[&.active]:font-bold">
            Onboarding
          </Link>
        </div>
        <hr />
        <Outlet />
      </div> */}

      <HeadContent />

      <div id="app" className="isolate" data-customisation="blue">
        {/* <StatusProvider> */}
        <WagmiProvider>
          {/* <QueryClientProvider> */}
          {/* <Suspense fallback={<div>Loading...</div>}> */}
          {/* <AccountsProvider> */}
          {/* <ConnectKitProvider> */}
          <WalletProvider>
            <div className="flex min-h-[56px] items-center px-2">
              <Navbar
                hasFeedback={/^\/portfolio\/(assets|collectibles)\/[^/]+$/.test(
                  pathname ?? '',
                )}
                linkComponent={Link}
              />
            </div>
            <div className="px-1">
              <div className="flex-1 flex-col 2md:flex xl:pb-1">
                <div className="flex h-[calc(100vh-60px)] flex-col overflow-y-auto rounded-[24px] bg-white-100">
                  {/* <OnboardingPage /> */}
                  <Outlet />
                </div>
              </div>
              {/* <NotAllowed /> */}
              <ToastContainer />
            </div>
          </WalletProvider>
          {/* </ConnectKitProvider> */}
          {/* </AccountsProvider> */}
          {/* </Suspense> */}
          {/* </QueryClientProvider> */}
        </WagmiProvider>
        {/* </StatusProvider> */}
      </div>
      {/* <ReactQueryDevtools buttonPosition="bottom-right" />
      <TanStackRouterDevtools position="bottom-left" />
      <div className="fixed inset-x-0 bottom-0 flex justify-center gap-4 bg-blur-neutral-100/70 p-4 text-white-100">
        <Link to="/">/index</Link>
        <Link to="/onboarding">/onboarding</Link>
        <Link to="/portfolio/assets">/portfolio</Link>
      </div> */}
    </>
  )
}
