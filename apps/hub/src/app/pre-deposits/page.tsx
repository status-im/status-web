'use client'

import { useCallback, useRef, useState } from 'react'

import { Tooltip } from '@status-im/components'
import { InfoIcon } from '@status-im/icons/16'
import Image from 'next/image'

import { formatCurrency } from '~/utils/currency'

import { HubLayout } from '../_components/hub-layout'
import { PreDepositModal } from '../_components/pre-deposit-modal'
import { VaultCard } from '../_components/vault-card'
import { type Vault, VAULTS } from '../_constants/address'
import { TOOLTIP_CONFIG } from '../_constants/staking'
import { useTotalTVL } from '../_hooks/useTotalTVL'
import { useUserVaultDeposit } from '../_hooks/useUserVaultDeposit'
import { REWARDS } from '../dashboard/page'

function VaultCardWithDeposit({
  vault,
  onDeposit,
  registerRefetch,
}: {
  vault: Vault
  onDeposit: () => void
  registerRefetch: (vaultId: string, refetch: () => void) => void
}) {
  const { data: depositedBalance, refetch } = useUserVaultDeposit({ vault })

  registerRefetch(vault.id, refetch)

  return (
    <VaultCard
      vault={vault}
      onDeposit={onDeposit}
      depositedBalance={depositedBalance}
    />
  )
}

export default function PreDepositPage() {
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null)
  const { data: totalTVL, isLoading: isLoadingTVL } = useTotalTVL()

  const refetchFunctionsRef = useRef<Record<string, () => void>>({})

  const registerRefetch = useCallback(
    (vaultId: string, refetch: () => void) => {
      refetchFunctionsRef.current[vaultId] = refetch
    },
    []
  )

  const handleDepositSuccess = useCallback(() => {
    if (selectedVault) {
      refetchFunctionsRef.current[selectedVault.id]?.()
    }
  }, [selectedVault])

  const defaultVault = VAULTS.find(v => v.id === 'SNT') ?? VAULTS[0]
  const activeVaults = VAULTS.filter(v => !v.soon)

  const formattedTVL = totalTVL ? formatCurrency(totalTVL) : '$0'

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
                and native apps. <br />
                Funds will be unlocked at mainnet launch.
              </p>
            </div>
          </div>
          <div className="relative flex w-full flex-col gap-2 rounded-32 bg-white-100 px-5 py-3 shadow-1 lg:max-w-[208px] lg:self-end">
            <p className="text-13 font-500 text-neutral-50">
              Total Value Locked
            </p>
            <InfoTooltip />
            <p className="text-27 font-600 text-neutral-100">
              {isLoadingTVL ? '...' : formattedTVL}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2">
          {VAULTS.map(vault => (
            <VaultCardWithDeposit
              key={vault.id}
              vault={vault}
              onDeposit={() => setSelectedVault(vault)}
              registerRefetch={registerRefetch}
            />
          ))}
        </div>
        <Image
          src="/dragon.png"
          alt="Dragon"
          width="354"
          height="320"
          className="relative m-auto"
        />
      </div>
      <PreDepositModal
        open={selectedVault !== null}
        onOpenChange={open => !open && setSelectedVault(null)}
        vault={selectedVault ?? defaultVault}
        vaults={activeVaults}
        setActiveVault={setSelectedVault}
        onDepositSuccess={handleDepositSuccess}
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
          Sum of token value locked across all vaults
        </span>
      </div>
    }
  >
    <InfoIcon className="absolute right-4 top-3 size-4 text-neutral-50 hover:text-neutral-100" />
  </Tooltip>
)
