'use client'

import { useState } from 'react'

import { ExternalIcon } from '@status-im/icons/20'
import { ButtonLink, Link } from '@status-im/status-network/components'
import Image from 'next/image'
import { match, P } from 'ts-pattern'

import { HubLayout } from '~components/hub-layout'
import { PreDepositModal } from '~components/pre-deposit-modal'
import { VaultCard } from '~components/vault-card'
import { TEST_VAULT, type Vault } from '~constants/index'

import { Apps } from '../_components/apps'
import { Hero } from '../_components/hero'

const REWARDS = ['karma', 'linea', 'snt']

const VAULTS: Vault[] = [
  // {
  //   id: 'ETH',
  //   name: 'ETH vault',
  //   apy: '5.2%',
  //   rewards: ['KARMA', 'SNT', 'LINEA'],
  //   icon: 'ETH',
  //   token: wETH_TOKEN,

  // },
  // {
  //   id: 'SNT',
  //   name: 'SNT vault',
  //   apy: '8.7%',
  //   rewards: ['KARMA', 'MetaFi', 'Points'],
  //   icon: 'SNT',
  //   token: SNT_TOKEN,
  // },
  // {
  //   id: 'USDC',
  //   name: 'USDC vault',
  //   apy: '3.9%',
  //   rewards: ['KARMA', 'SNT', 'Points'],
  //   icon: 'USDC',
  //   token: wETH_TOKEN,
  // },
  TEST_VAULT,
]

export default function DashboardPage() {
  const [selectedVault, setActiveVault] = useState<Vault | null>(null)

  return (
    <HubLayout>
      <div className="flex flex-col px-6 py-8">
        {/* Hero Section */}
        <Hero />

        {/* Main Content Card */}
        <div className="mx-auto mt-7 w-full max-w-[1176px]">
          <div className="mb-8 rounded-32 bg-neutral-2.5 p-8">
            <div className="mb-6 flex items-start justify-between">
              <div className="max-w-2xl">
                <h3 className="mb-2 text-27 font-600 text-neutral-90">
                  Deposit funds for yield and rewards
                </h3>
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {REWARDS.map((reward, index) => (
                      <Image
                        key={index}
                        src={`/tokens/${reward}.png`}
                        alt={reward}
                        width="22"
                        height="22"
                        className="size-5 rounded-full border border-neutral-10"
                      />
                    ))}
                  </div>
                  <p className="ml-1 text-15 text-neutral-60">
                    Rewards in KARMA, SNT, LINEA, MetaFi and points from native
                    apps
                  </p>
                </div>
              </div>
              <ButtonLink
                variant="outline"
                size="32"
                href="https://status-im.gitbook.io/status-network/user-guides/hub"
              >
                Learn more
                <ExternalIcon className="text-neutral-50" />
              </ButtonLink>
            </div>

            {/* Vault Cards Grid */}
            <section className="relative ml-auto w-full max-w-[906px]">
              <Image
                src="/dragon.png"
                alt="Dragon"
                width="354"
                height="320"
                className="absolute left-[-290px] top-[120px]"
              />
              <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2">
                {VAULTS.map(vault => (
                  <VaultCard
                    key={vault.id}
                    name={vault.name}
                    apy={vault.apy}
                    rewards={vault.rewards}
                    icon={vault.icon}
                    onDeposit={() => setActiveVault(vault)}
                  />
                ))}
              </div>
            </section>
          </div>
          <Apps />
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

            <div className="relative w-full max-w-[420px]">
              <Image
                src="/build-unicorn.png"
                alt="Unicorn"
                width="298"
                height="318"
                className="mx-auto mt-8 lg:mt-0"
              />
            </div>
          </div>
        </div>
      </div>
      {match(selectedVault)
        .with(P.nonNullable, vault => (
          <PreDepositModal
            open={true}
            onOpenChange={open => !open && setActiveVault(null)}
            vault={vault}
            setActiveVault={setActiveVault}
          />
        ))
        .otherwise(() => null)}
    </HubLayout>
  )
}
