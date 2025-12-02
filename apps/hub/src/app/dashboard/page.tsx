'use client'

import { ExternalIcon } from '@status-im/icons/20'
import { ButtonLink } from '@status-im/status-network/components'
import Image from 'next/image'

import { HubLayout } from '~components/hub-layout'

// import { VaultCard } from '~components/vault-card'
import { Apps } from '../_components/apps'
import { Hero } from '../_components/hero'

export default function DashboardPage() {
  return (
    <HubLayout>
      <div className="flex flex-col p-4 lg:px-6 lg:py-8">
        {/* Hero Section */}
        <Hero />

        {/* Main Content Card */}
        <div className="mx-auto mt-7 w-full max-w-[1176px]">
          {/* <div className="mb-8 rounded-32 bg-neutral-2.5 p-8">
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

            <section className="relative ml-auto w-full max-w-[906px]">
              <Image
                src="/dragon.png"
                alt="Dragon"
                width="354"
                height="320"
                className="absolute left-[-290px] top-[120px]"
              />
              <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2">
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
            </section>
          </div> */}
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
                >
                  Read docs
                  <ExternalIcon className="text-blur-white/70" />
                </ButtonLink>

                <ButtonLink
                  href="https://statusnetwork.typeform.com/partner"
                  variant="grey"
                  size="32"
                >
                  Submit an app
                  <ExternalIcon className="text-neutral-50" />
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
    </HubLayout>
  )
}
