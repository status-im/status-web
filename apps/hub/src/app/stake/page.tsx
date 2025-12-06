'use client'

import { HubLayout } from '~components/hub-layout'
import { VaultsTable } from '~components/vaults/vaults-table'

import { FaucetCard } from '../_components/stake/stake-faucet-card'
import { StakeForm } from '../_components/stake/stake-form'
import { TotalStakedCard } from '../_components/stake/stake-total-staked-card'
import { WeightedBoostCard } from '../_components/stake/stake-weighted-boost-card'

export default function StakePage() {
  return (
    <HubLayout>
      <div className="mx-auto flex size-full flex-col gap-8 p-4 md:p-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-27 font-bold md:text-40">
            Stake SNT, receive good Karma
          </h1>
          <p className="text-13 md:text-19">
            Stake SNT to increase your Karma, unlock more gasless transactions
            and increase your power over the network
          </p>
        </header>

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
      </div>
    </HubLayout>
  )
}
