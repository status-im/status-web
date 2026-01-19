'use client'

import { useTranslations } from 'next-intl'

import { HubLayout } from '~components/hub-layout'
import { VaultsTable } from '~components/vaults/vaults-table'
import { useRequireStatusNetwork } from '~hooks/useRequireStatusNetwork'

import {
  FaucetCard,
  FaucetCardSkeleton,
} from '../../_components/stake/stake-faucet-card'
import {
  StakeForm,
  StakeFormSkeleton,
} from '../../_components/stake/stake-form'
import {
  TotalStakedCard,
  TotalStakedCardSkeleton,
} from '../../_components/stake/stake-total-staked-card'
import {
  WeightedBoostCard,
  WeightedBoostCardSkeleton,
} from '../../_components/stake/stake-weighted-boost-card'
import { jsonLD, JSONLDScript } from '../../_utils/json-ld'

const breadcrumbListSchema = jsonLD.breadcrumbList([
  {
    name: 'Hub',
    url: 'https://hub.status.network/',
  },
  {
    name: 'Stake',
    url: 'https://hub.status.network/stake',
  },
])

const softwareApplicationSchema = jsonLD.softwareApplication({
  name: 'Status Network Staking',
  applicationCategory: 'DeFi',
  operatingSystem: 'Web',
  url: 'https://hub.status.network/stake',
  description:
    "Stake assets to earn yield and support Status Network's gasless Ethereum Layer 2.",
})

function StakeCardsSkeleton() {
  return (
    <>
      <section className="rounded-8 bg-neutral-2.5 md:p-8">
        <div className="flex flex-col gap-4 md:gap-8">
          <FaucetCardSkeleton />
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,1fr)]">
            <StakeFormSkeleton />
            <div className="flex flex-col gap-[18px]">
              <TotalStakedCardSkeleton />
              <WeightedBoostCardSkeleton />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function StakeCards() {
  return (
    <>
      <section className="rounded-8 bg-neutral-2.5 md:p-8">
        <div className="flex flex-col gap-4 md:gap-8">
          <FaucetCard />
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,1fr)]">
            <StakeForm />
            <div className="flex flex-col gap-[18px]">
              <TotalStakedCard />
              <WeightedBoostCard />
            </div>
          </div>
        </div>
      </section>
      <VaultsTable />
    </>
  )
}

export default function StakePage() {
  const t = useTranslations()
  const { isCorrectChain, isConnected, isSwitching } = useRequireStatusNetwork()

  const showSkeleton = isConnected && (!isCorrectChain || isSwitching)

  return (
    <HubLayout>
      <JSONLDScript
        schema={[breadcrumbListSchema, softwareApplicationSchema]}
      />
      <div className="mx-auto flex size-full flex-col gap-8 p-4 md:p-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-27 font-bold md:text-40">{t('stake.title')}</h1>
          <p className="text-13 md:text-19">{t('stake.description')}</p>
        </header>

        {showSkeleton ? <StakeCardsSkeleton /> : <StakeCards />}
      </div>
    </HubLayout>
  )
}
