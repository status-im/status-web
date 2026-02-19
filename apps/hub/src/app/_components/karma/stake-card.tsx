'use client'

import { useMemo } from 'react'

import { useTranslations } from 'next-intl'

import { Link } from '~/i18n/navigation'
import { useStakingVaults } from '~hooks/useStakingVaults'
import { formatSNT } from '~utils/currency'

export function KarmaStakeCard() {
  const t = useTranslations()
  const { data: vaults, isLoading: vaultsLoading } = useStakingVaults()

  const totalVaultKarma = useMemo(
    () =>
      (vaults ?? []).reduce(
        (acc, vault) => acc + (vault.data?.rewardsAccrued ?? 0n),
        0n
      ),
    [vaults]
  )

  const formattedKarma = vaultsLoading ? '0' : formatSNT(totalVaultKarma)

  return (
    <div className="flex size-full flex-col overflow-hidden rounded-20 border border-neutral-20 bg-white-100">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-col gap-6 p-4">
          <div className="flex w-full flex-col gap-0.5">
            <p className="text-15 font-regular text-neutral-50">
              {t('karma.stake_card_title')}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-27 font-semibold text-neutral-100">
                {formattedKarma}
              </p>
              <p className="text-15 font-medium uppercase text-neutral-50">
                TKARMA
              </p>
            </div>
          </div>

          <Link
            href="/stake"
            className="flex w-full items-center justify-center rounded-12 border border-transparent bg-purple py-[9px] text-15 font-500 text-white-100 transition-colors hover:bg-purple-dark"
          >
            {t('karma.stake_card_button')}
          </Link>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 border-t border-neutral-20 bg-neutral-2.5 px-4 py-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-customisation-orange-50/20">
          <div className="size-4 rounded-full bg-customisation-orange-50/30" />
        </div>
        <div className="flex flex-1 flex-col">
          <p className="text-13 font-semibold text-neutral-100">
            {t('karma.stake_card_badge_title')}
          </p>
          <p className="text-13 font-regular text-neutral-100">
            {t('karma.stake_card_badge_description')}
          </p>
        </div>
      </div>
    </div>
  )
}
