'use client'

import { useState } from 'react'

import { ExternalIcon } from '@status-im/icons/16'
import { ButtonLink, Link } from '@status-im/status-network/components'
import Image from 'next/image'

import { formatCurrency } from '~/utils/currency'

import { HubLayout } from '../_components/hub-layout'
import { InfoTooltip } from '../_components/info-tooltip'
import { PreDepositModal } from '../_components/pre-deposit-modal'
import { VaultCard } from '../_components/vault-card'
import { type Vault, VAULTS } from '../_constants/address'
import { useTotalTVL } from '../_hooks/useTotalTVL'
import { useVaultRefetch } from '../_hooks/useVaultRefetch'
import { REWARDS } from '../dashboard/page'

export default function PreDepositPage() {
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null)
  const { data: totalTVL, isLoading: isLoadingTVL } = useTotalTVL()
  const { registerRefetch, refetchVault } = useVaultRefetch()

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
                and native apps. Funds will be unlocked at mainnet launch.
                <br />
                All contracts have been{' '}
                <Link
                  href="https://github.com/aragon/status-predeposit-vaults/blob/development/audit/report-aragon-pre-deposit-vaults.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple hover:text-purple-dark"
                >
                  audited
                </Link>
                .
              </p>
            </div>
          </div>
          <div className="self-start">
            <ButtonLink
              variant="outline"
              href="https://status-im.notion.site/status-network-pre-deposit"
              className="self-start bg-white-100"
              size="32"
              icon={<ExternalIcon className="text-neutral-50" />}
            >
              Learn more
            </ButtonLink>
          </div>
        </div>
        <div className="relative flex w-full flex-col gap-2 rounded-32 bg-white-100 px-8 py-4 shadow-1">
          <div className="flex items-start justify-between">
            <p className="text-13 font-500 text-neutral-50">
              Total Value Locked
            </p>
            <InfoTooltip content="Sum of token value locked across all vaults" />
          </div>
          <p className="text-27 font-600 text-neutral-100">
            {isLoadingTVL ? '...' : formattedTVL}
          </p>
        </div>
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2">
          {VAULTS.map(vault => (
            <VaultCard
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
        onDepositSuccess={() => refetchVault(selectedVault)}
      />
    </HubLayout>
  )
}
