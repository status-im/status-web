'use client'

import { ExternalIcon } from '@status-im/icons/20'
import { Link } from '@status-im/status-network/components'

import { AppCard } from '~components/app-card'
import { HubLayout } from '~components/hub-layout'
import { VaultCard } from '~components/vault-card'

export default function DashboardPage() {
  return (
    <HubLayout>
      <div className="flex h-full flex-col p-8">
        {/* Hero Section */}
        <div className="mb-12 flex flex-col items-center text-center">
          <h1 className="mb-4 text-64 font-bold text-neutral-90">
            Welcome, fren
          </h1>
          <h2 className="mb-8 text-27 font-medium text-neutral-60">
            You're so early — it's a biiiiiig advantage.
          </h2>

          {/* Hero Image Asset */}
          <div className="relative w-full max-w-4xl">
            <div className="flex aspect-[16/9] w-full items-center justify-center rounded-20 border border-neutral-20 bg-gradient-to-br from-customisation-purple-50/10 via-customisation-purple-50/5 to-neutral-10">
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-customisation-purple-50/20">
                  <svg
                    className="size-10 text-purple"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <p className="text-19 font-medium text-neutral-80">
                  DeFi Dashboard Hero Image
                </p>
                <p className="text-13 text-neutral-60">
                  Large visual asset placeholder
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="mx-auto w-full max-w-[1176px]">
          <div className="mb-8 rounded-20 border border-neutral-20 bg-white-100 p-8 shadow-2">
            <div className="mb-6 flex items-start justify-between">
              <div className="max-w-2xl">
                <h3 className="mb-2 text-27 font-bold text-neutral-90">
                  Deposit funds for yield and rewards
                </h3>
                <p className="text-15 text-neutral-60">
                  Rewards in KARMA, SNT, LINEA, MetaFi and points from native
                  apps
                </p>
              </div>
              <button className="flex items-center gap-2 text-19 font-medium text-purple transition-colors hover:text-purple-dark">
                Learn more
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 17l9.2-9.2M17 17V7H7"
                  />
                </svg>
              </button>
            </div>

            {/* Vault Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <VaultCard
                name="ETH vault"
                apy="5.2%"
                rewards={['KARMA', 'SNT', 'LINEA']}
                icon="ETH"
                onDeposit={() => console.log('Deposit to ETH vault')}
              />
              <VaultCard
                name="SNT vault"
                apy="8.7%"
                rewards={['KARMA', 'MetaFi', 'Points']}
                icon="SNT"
                onDeposit={() => console.log('Deposit to SNT vault')}
              />
              <VaultCard
                name="USDC vault"
                apy="3.9%"
                rewards={['KARMA', 'SNT', 'Points']}
                icon="USDC"
                onDeposit={() => console.log('Deposit to USDC vault')}
              />
              <VaultCard
                name="LINEA vault"
                apy="6.1%"
                rewards={['KARMA', 'MetaFi', 'LINEA']}
                icon="LINEA"
                onDeposit={() => console.log('Deposit to LINEA vault')}
              />
            </div>

            {/* Featured Apps Section */}
            <div className="rounded-20 border border-neutral-20 bg-white-100 p-8 shadow-2">
              <h3 className="mb-6 text-27 font-bold text-neutral-90">
                Featured Applications
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AppCard
                  name="Portfolio"
                  description="Track your DeFi investments and performance"
                  category="Finance"
                  onLaunch={() => console.log('Launch Portfolio')}
                />
                <AppCard
                  name="Bridge"
                  description="Cross-chain asset transfers and swaps"
                  category="DeFi"
                  onLaunch={() => console.log('Launch Bridge')}
                />
                <AppCard
                  name="Governance"
                  description="Participate in protocol decisions and voting"
                  category="DAO"
                  onLaunch={() => console.log('Launch Governance')}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="py-12">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center">
            <div className="max-w-2xl">
              <h3 className="mb-3 text-64 font-bold text-neutral-90">
                Build with us
              </h3>
              <p className="mb-8 text-27 font-medium text-neutral-60">
                Launch your app on the free network
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-12 bg-purple px-5 py-3 text-15 font-600 text-white-100 transition-colors hover:bg-purple-dark"
                >
                  Explore documentation
                  <ExternalIcon className="text-blur-white/70" />
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-12 bg-neutral-10 px-5 py-3 text-15 font-600 text-neutral-90 ring-1 ring-inset ring-neutral-20 transition-colors hover:bg-neutral-80/20"
                >
                  Submit an app
                  <ExternalIcon className="text-neutral-50" />
                </Link>
              </div>
            </div>

            {/* Ilustração — troque o placeholder pelo asset correto quando disponível no app `hub` */}
            <div className="relative w-full max-w-[420px]">
              <div className="flex aspect-[4/3] w-full items-center justify-center rounded-20 border border-neutral-20 bg-gradient-to-br from-customisation-purple-50/10 via-customisation-purple-50/5 to-neutral-10">
                <span className="text-15 text-neutral-60">
                  Unicorn illustration
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HubLayout>
  )
}
