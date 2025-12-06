'use client'

import { useState } from 'react'

import { ExternalIcon } from '@status-im/icons/20'
import { ButtonLink } from '@status-im/status-network/components'
import Image from 'next/image'

import { HubLayout } from '~components/hub-layout'
import { PreDepositModal } from '~components/pre-deposit-modal'
import { VaultCard } from '~components/vault-card'
import { type Vault, VAULTS } from '~constants/index'

import { Apps } from '../_components/apps'
import { Hero } from '../_components/hero'

export const REWARDS = ['KARMA', 'SNT', 'LINEA']

export default function DashboardPage() {
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null)

  const defaultVault = VAULTS.find(v => v.id === 'SNT') ?? VAULTS[0]

  const activeVaults = VAULTS.filter(v => !v.soon)

  return (
    <HubLayout>
      <div className="flex flex-col p-4 lg:px-6 lg:py-8">
        {/* Hero Section */}
        <Hero />

        {/* Main Content Card */}
        <div className="mx-auto mt-7 w-full max-w-[1176px]">
          <div className="mb-8 rounded-32 p-0 lg:bg-neutral-2.5 lg:p-8">
            <div className="mb-6 flex items-start justify-between">
              <div className="max-w-2xl">
                <h3 className="text-19 font-600 text-neutral-90 lg:text-27">
                  Deposit funds for yield and rewards
                </h3>
                <div className="flex flex-col gap-2 lg:flex-row lg:items-start">
                  <div className="flex -space-x-2">
                    {REWARDS.map((reward, index) => (
                      <Image
                        key={index}
                        src={`/tokens/${reward.toLowerCase()}.png`}
                        alt={reward}
                        width="22"
                        height="22"
                        className="size-5 rounded-full border border-neutral-10"
                      />
                    ))}
                  </div>
                  <p className="text-15 text-neutral-60">
                    Rewards in KARMA, SNT, LINEA, MetaFi and points from native
                    apps
                  </p>
                </div>
              </div>
              <ButtonLink
                variant="outline"
                href="https://status-im.gitbook.io/status-network/user-guides/hub"
                className="bg-white-100"
                size="32"
                icon={<ExternalIcon className="text-neutral-50" />}
              >
                Learn more
              </ButtonLink>
            </div>

            <section className="relative w-full">
              <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 lg:mx-0 lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
                {VAULTS.map(vault => (
                  <div
                    key={vault.id}
                    className="w-[200px] shrink-0 lg:h-full lg:w-auto"
                  >
                    <VaultCard
                      vault={vault}
                      onDeposit={() => setSelectedVault(vault)}
                    />
                  </div>
                ))}
              </div>
              <Image
                src="/dragon.png"
                alt="Dragon"
                width="354"
                height="320"
                className="relative lg:absolute lg:left-[-290px] lg:top-[120px]"
              />
            </section>
          </div>
          <Apps />
        </div>

        <div className="pb-8 pt-4 lg:py-12">
          <div className="flex flex-col items-center justify-center gap-8 text-center lg:flex-row lg:items-center lg:justify-center lg:text-left">
            <div className="order-2 max-w-2xl lg:order-1">
              <h3 className="mb-2 text-27 font-medium text-neutral-90 lg:mb-3 lg:text-64 lg:font-bold">
                Build with us
              </h3>
              <p className="mb-4 text-13 font-medium text-neutral-60 lg:mb-8 lg:text-27">
                Launch your app on the free network
              </p>

              <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                <ButtonLink
                  href="https://docs.status.network"
                  variant="primary"
                  size="32"
                  className="text-white-100"
                  icon={<ExternalIcon className="text-blur-white/70" />}
                >
                  Read docs
                </ButtonLink>

                <ButtonLink
                  href="https://statusnetwork.typeform.com/partner"
                  variant="grey"
                  size="32"
                  className="bg-neutral-10 text-neutral-100"
                  icon={<ExternalIcon className="text-neutral-50" />}
                >
                  Submit an app
                </ButtonLink>
              </div>
            </div>

            <div className="relative order-1 w-full max-w-[420px] lg:order-2">
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
      <PreDepositModal
        open={selectedVault !== null}
        onOpenChange={open => !open && setSelectedVault(null)}
        vault={selectedVault ?? defaultVault}
        vaults={activeVaults}
        setActiveVault={setSelectedVault}
      />
    </HubLayout>
  )
}
