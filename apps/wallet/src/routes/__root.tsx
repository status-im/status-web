import { ToastContainer } from '@status-im/components'
import { Navbar } from '@status-im/wallet/components'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  redirect,
} from '@tanstack/react-router'

import { Link } from '../components/link'
import { apiClient } from '../providers/api-client'
import { PasswordProvider } from '../providers/password-context'
import { PendingTransactionsProvider } from '../providers/pending-transactions-context'
import { SignerProvider } from '../providers/signer-context'
import { WagmiConfigProvider } from '../providers/wagmi-provider'
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
    try {
      const wallets = await apiClient.wallet.all.query()
      const hasWallets = Array.isArray(wallets) && wallets.length > 0

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
    } catch (error) {
      if (error && typeof error === 'object' && 'isRedirect' in error) {
        throw error
      }
      console.error('Error loading wallets in beforeLoad:', error)
      if (
        location.pathname === '/' ||
        location.pathname.startsWith('/portfolio')
      ) {
        throw redirect({ to: '/onboarding' })
      }
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
        title: '!Status Portfolio Wallet (Beta)',
      },
    ],
  }),
  component: RootComponent,
  /**
   * what
   *
   * - Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
   * - etc.
   *
   * when
   *
   * - on refreshing
   */
  errorComponent: function RootErrorComponent({ error }) {
    console.error('RootComponent: Error:', error)

    return (
      <>
        <div className="flex min-h-[56px] items-center px-2">
          <Navbar hasFeedback linkComponent={Link} />
        </div>
        <div className="px-1">
          <div className="flex-1 flex-col 2md:flex xl:pb-1">
            <div className="flex h-[calc(100vh-60px)] flex-col items-center justify-center overflow-y-hidden rounded-[24px] bg-white-100">
              {/* todo: global error illustration or split view */}
              <h2 className="pt-[68px] text-15 font-semibold text-neutral-100 first-line:mb-0.5">
                Something went wrong.
              </h2>
              <p className="mb-5 text-13 font-regular text-neutral-100">
                Refresh or try again later.
              </p>
            </div>
          </div>
        </div>
      </>
    )
  },
  notFoundComponent: function RootNotFoundComponent() {
    console.info('RootNotFoundComponent: Info: not found')

    // todo: global not found illustration
    // fixme?: show feedback in navbar
    return
  },
})

function RootComponent() {
  return (
    <>
      <HeadContent />

      <div id="app" className="isolate" data-customisation="blue">
        <WalletProvider>
          <PasswordProvider>
            <SignerProvider>
              <WagmiConfigProvider>
                <PendingTransactionsProvider>
                  <div className="flex min-h-[56px] items-center px-2">
                    <Navbar hasFeedback linkComponent={Link} />
                  </div>
                  <div className="px-1">
                    <div className="flex-1 flex-col 2md:flex xl:pb-1">
                      <div className="flex h-[calc(100vh-60px)] flex-col overflow-y-hidden rounded-[24px] bg-white-100">
                        {/* <OnboardingPage /> */}
                        <Outlet />
                      </div>
                    </div>
                    {/* <NotAllowed /> */}
                    <ToastContainer />
                  </div>
                </PendingTransactionsProvider>
              </WagmiConfigProvider>
            </SignerProvider>
          </PasswordProvider>
        </WalletProvider>
      </div>
    </>
  )
}
