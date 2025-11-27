'use client'

import { HubLayout } from '~components/hub-layout'
import {
  FaucetCard,
  StakeForm,
  TotalStakedCard,
  WeightedBoostCard,
} from '~components/stake'
import { VaultsTable } from '~components/vaults/vaults-table'

export default function StakePage() {
  return (
    <HubLayout>
      <div className="mx-auto flex size-full flex-col gap-8 p-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-40 font-bold">Stake SNT, receive good Karma</h1>
          <p className="text-19">
            Stake SNT to increase your Karma, unlock more gasless transactions
            and increase your power over the network
          </p>
        </header>

        <section className="rounded-8 bg-neutral-2.5 p-8">
          <div className="flex flex-col gap-8">
            <FaucetCard />
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,1fr)]">
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
