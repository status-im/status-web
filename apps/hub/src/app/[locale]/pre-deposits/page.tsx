'use client'

import { useState } from 'react'

import { Skeleton } from '@status-im/components'
import { ExternalIcon } from '@status-im/icons/16'
import { Button, ButtonLink } from '@status-im/status-network/components'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { formatCurrency } from '~/utils/currency'
import { DEMO_MODE, resetAllDemoState } from '~/utils/demo'

import { HubLayout } from '../../_components/hub-layout'
import { InfoTooltip } from '../../_components/info-tooltip'
import { PreDepositClaimModal } from '../../_components/pre-deposit-claim-modal'
import { getFaqItems, PreDepositFaq } from '../../_components/pre-deposit-faq'
import { PreDepositUnlockModal } from '../../_components/pre-deposit-unlock-modal'
import { RewardsSection } from '../../_components/rewards-section'
import { VaultCard } from '../../_components/vault-card'
import { type Vault, VAULTS } from '../../_constants/address'
import { useTotalTVL } from '../../_hooks/useTotalTVL'
import { useVaultRefetch } from '../../_hooks/useVaultRefetch'
import { jsonLD, JSONLDScript } from '../../_utils/json-ld'

const breadcrumbListSchema = jsonLD.breadcrumbList([
  {
    name: 'Hub',
    url: 'https://hub.status.network/',
  },
  {
    name: 'Pre-Deposits',
    url: 'https://hub.status.network/pre-deposits',
  },
])

const softwareApplicationSchema = jsonLD.softwareApplication({
  name: 'Status Network Pre-Deposits',
  applicationCategory: 'DeFi',
  operatingSystem: 'Web',
  url: 'https://hub.status.network/pre-deposits',
  description:
    'Withdraw assets from Status Network pre-deposit vaults on Linea.',
})

type WithdrawAction = { kind: 'unlock' | 'claim'; vault: Vault } | null

export default function PreDepositPage() {
  const t = useTranslations()
  const { data: totalTVL, isLoading: isLoadingTVL } = useTotalTVL()
  const { registerRefetch, refetchVault } = useVaultRefetch()
  const [withdrawAction, setWithdrawAction] = useState<WithdrawAction>(null)

  const formattedTVL = totalTVL ? formatCurrency(totalTVL) : '$0'

  const faqItems = getFaqItems(t)
  const faqSchema = jsonLD.faqPage({
    questions: faqItems.map((item: { title: string; content: string }) => ({
      question: item.title,
      answer: item.content,
    })),
  })

  return (
    <HubLayout>
      <JSONLDScript
        schema={[faqSchema, breadcrumbListSchema, softwareApplicationSchema]}
      />
      <div className="mx-auto mb-8 flex flex-col gap-4 rounded-32 p-4 lg:mt-14 lg:gap-8 lg:bg-neutral-2.5 lg:p-8">
        <div className="flex flex-col justify-between gap-4 lg:flex-row">
          <div className="flex flex-col gap-4">
            <h1 className="text-27 font-bold text-neutral-100">
              {t('pre_deposits.title')}
            </h1>
            <RewardsSection />
          </div>
          <div className="flex flex-col items-end gap-2 self-start">
            <ButtonLink
              variant="outline"
              href="https://status.app/blog/status-network-pre-deposit-vaults-be-early-to-the-gasless-l2"
              className="self-start bg-white-100"
              size="32"
              icon={<ExternalIcon className="text-neutral-50" />}
            >
              {t('common.learn_more')}
            </ButtonLink>
            {DEMO_MODE && (
              <Button
                variant="grey"
                size="32"
                onClick={() => {
                  resetAllDemoState()
                  window.location.reload()
                }}
              >
                Reset demo
              </Button>
            )}
          </div>
        </div>
        <div className="relative flex w-full flex-col gap-2 rounded-32 bg-white-100 px-8 py-4 shadow-1">
          <div className="flex items-start justify-between">
            <p className="text-13 font-500 text-neutral-50">
              {t('pre_deposits.total_value_locked')}
            </p>
            <InfoTooltip content={t('pre_deposits.tvl_tooltip')} />
          </div>
          <div className="text-27 font-600 text-neutral-100">
            {isLoadingTVL ? (
              <Skeleton width={120} height={27} className="rounded-6" />
            ) : (
              formattedTVL
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2">
          {VAULTS.map(vault => (
            <VaultCard
              key={vault.id}
              vault={vault}
              onUnlock={vault => setWithdrawAction({ kind: 'unlock', vault })}
              onClaim={vault => setWithdrawAction({ kind: 'claim', vault })}
              registerRefetch={registerRefetch}
            />
          ))}
        </div>
      </div>
      <div className="mx-auto flex flex-col gap-4 rounded-32 p-4 lg:mb-14 lg:gap-8 lg:bg-neutral-2.5 lg:p-8">
        <h2 className="text-19 font-600 text-neutral-100 lg:text-27">
          {t('pre_deposits.faq')}
        </h2>
        <PreDepositFaq />

        <Image
          src="/dragon-key.png"
          alt={t('pre_deposits.dragon_key_alt')}
          width="325"
          height="360"
          className="relative m-auto"
        />
      </div>
      {withdrawAction?.kind === 'unlock' && (
        <PreDepositUnlockModal
          open
          onOpenChange={open => !open && setWithdrawAction(null)}
          vault={withdrawAction.vault}
          onUnlockSuccess={() => refetchVault(withdrawAction.vault)}
        />
      )}
      {withdrawAction?.kind === 'claim' && (
        <PreDepositClaimModal
          open
          onOpenChange={open => !open && setWithdrawAction(null)}
          vault={withdrawAction.vault}
          onClaimSuccess={() => refetchVault(withdrawAction.vault)}
        />
      )}
    </HubLayout>
  )
}
