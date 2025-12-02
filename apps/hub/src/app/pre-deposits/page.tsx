'use client'

import { useState } from 'react'

import { Tooltip } from '@status-im/components'
import { InfoIcon } from '@status-im/icons/16'
import Image from 'next/image'

import { HubLayout } from '../_components/hub-layout'
import { PreDepositModal } from '../_components/pre-deposit-modal'
import { VaultCard } from '../_components/vault-card'
import { type Vault, VAULTS } from '../_constants/address'
import { TOOLTIP_CONFIG } from '../_constants/staking'
import { REWARDS } from '../dashboard/page'

export default function PreDepositPage() {
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null)

  const defaultVault = VAULTS.find(v => v.id === 'SNT') ?? VAULTS[0]
  const activeVaults = VAULTS.filter(v => !v.soon)

  return (
    <HubLayout>
      <div className="mx-auto flex flex-col gap-4 rounded-32 p-4 lg:my-14 lg:gap-8 lg:bg-neutral-2.5 lg:p-8">
        <div className="flex flex-col justify-between gap-4 lg:flex-row">
          <div className="flex flex-col gap-4">
            <h1 className="text-27 font-bold text-neutral-100">
              Pre-Deposit Vaults
            </h1>
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
                Rewards in KARMA, SNT, LINEA and points from Generic Protocol
                and native app. <br />
                Funds will be unlocked during mainnet launch.
              </p>
            </div>
          </div>
          <div className="relative flex w-full flex-col gap-2 rounded-32 bg-white-100 px-4 py-3 shadow-1 lg:max-w-[248px] lg:self-end">
            <p className="text-13 font-500 text-neutral-50">
              Total Value Locked
            </p>
            <InfoTooltip />
            <p className="text-27 font-600 text-neutral-100">$100M</p>
          </div>
        </div>
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2">
          {VAULTS.map(vault => (
            <VaultCard
              key={vault.id}
              vault={vault}
              onDeposit={() => setSelectedVault(vault)}
            />
          ))}
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

const InfoTooltip = () => (
  <Tooltip
    delayDuration={TOOLTIP_CONFIG.DELAY_DURATION}
    side="top"
    content={
      <div className="flex w-[286px] flex-col gap-4 rounded-8 bg-white-100 p-4">
        <span className="text-13 text-neutral-100">
          Sum of value of all coins held in smart contracts of all the protocols
          on the chain
        </span>
      </div>
    }
  >
    <InfoIcon className="absolute right-4 top-3 size-4 text-neutral-50 hover:text-neutral-100" />
  </Tooltip>
)
