'use client'

import { Skeleton } from '@status-im/components'
import { ExternalIcon } from '@status-im/icons/16'
import { ButtonLink } from '@status-im/status-network/components'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { formatCurrency } from '~/utils/currency'

import { HubLayout } from '../../_components/hub-layout'
import { InfoTooltip } from '../../_components/info-tooltip'
import { PreDepositModal } from '../../_components/pre-deposit-modal'
import { RewardsSection } from '../../_components/rewards-section'
import { VaultCard } from '../../_components/vault-card'
import { VAULTS } from '../../_constants/address'
import { useTotalTVL } from '../../_hooks/useTotalTVL'
import { useVaultSelection } from '../../_hooks/useVaultSelection'

export default function PreDepositPage() {
  const t = useTranslations()
  const { data: totalTVL, isLoading: isLoadingTVL } = useTotalTVL()
  const {
    selectedVault,
    setSelectedVault,
    defaultVault,
    activeVaults,
    registerRefetch,
    handleDepositSuccess,
    isModalOpen,
  } = useVaultSelection()

  const formattedTVL = totalTVL ? formatCurrency(totalTVL) : '$0'

  return (
    <HubLayout>
      <div className="mx-auto flex flex-col gap-4 rounded-32 p-4 lg:my-14 lg:gap-8 lg:bg-neutral-2.5 lg:p-8">
        <div className="flex flex-col justify-between gap-4 lg:flex-row">
          <div className="flex flex-col gap-4">
            <h1 className="text-27 font-bold text-neutral-100">
              {t('pre_deposits.title')}
            </h1>
            <RewardsSection />
          </div>
          <div className="self-start">
            <ButtonLink
              variant="outline"
              href="https://status.app/blog/status-network-pre-deposit-vaults-be-early-to-the-gasless-l2"
              className="self-start bg-white-100"
              size="32"
              icon={<ExternalIcon className="text-neutral-50" />}
            >
              {t('common.learn_more')}
            </ButtonLink>
          </div>
        </div>
        <div className="relative flex w-full flex-col gap-2 rounded-32 bg-white-100 px-8 py-4 shadow-1">
          <div className="flex items-start justify-between">
            <p className="text-13 font-500 text-neutral-50">
              {t('pre_deposits.total_value_locked')}
            </p>
            <InfoTooltip content={t('pre_deposits.tvl_tooltip')} />
          </div>
          <p className="text-27 font-600 text-neutral-100">
            {isLoadingTVL ? (
              <Skeleton width={120} height={27} className="rounded-6" />
            ) : (
              formattedTVL
            )}
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
          src="/dragon-key.png"
          alt={t('pre_deposits.dragon_key_alt')}
          width="325"
          height="360"
          className="relative m-auto"
        />
      </div>
      <PreDepositModal
        open={isModalOpen}
        onOpenChange={open => !open && setSelectedVault(null)}
        vault={selectedVault ?? defaultVault}
        vaults={activeVaults}
        setActiveVault={setSelectedVault}
        onDepositSuccess={handleDepositSuccess}
      />
    </HubLayout>
  )
}
