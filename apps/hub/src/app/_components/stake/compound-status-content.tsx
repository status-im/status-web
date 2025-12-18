import * as Dialog from '@radix-ui/react-dialog'
import { InfoIcon } from '@status-im/icons/16'
import { useTranslations } from 'next-intl'
import { formatUnits } from 'viem'

import { LaunchIcon } from '~components/icons'
import { STT_TOKEN } from '~constants/index'
import { useMultiplierPointsBalance } from '~hooks/useMultiplierPoints'
import { useStakingVaults } from '~hooks/useStakingVaults'
import { useWeightedBoost } from '~hooks/useWeightedBoost'
import { formatSNT } from '~utils/currency'

export const CompoundStatusContent = () => {
  const t = useTranslations()
  const { data: vaults } = useStakingVaults()
  const weightedBoost = useWeightedBoost(vaults)
  const { data: multiplierPointsData } = useMultiplierPointsBalance()

  const earnRateWithBoost = Math.floor(weightedBoost.totalStaked * 0.05)
  const earnRateWithoutBoost = Math.floor(weightedBoost.totalStaked * 0.05)

  return (
    <>
      <div className="flex items-center justify-center px-4 py-8">
        <LaunchIcon />
      </div>

      <div className="flex flex-col gap-8 px-8 pb-8">
        <div className="flex flex-col gap-1">
          <Dialog.Title asChild>
            <h2 className="text-center text-19 font-semibold text-neutral-100">
              {t('stake.ready_to_compound', {
                points: formatSNT(
                  formatUnits(
                    multiplierPointsData?.totalUncompounded ?? 0n,
                    STT_TOKEN.decimals
                  )
                ),
              })}
            </h2>
          </Dialog.Title>
          <Dialog.Description asChild>
            <p className="text-center text-15 font-regular text-neutral-100">
              {t('stake.sign_message')}
            </p>
          </Dialog.Description>
        </div>

        <div className="flex flex-col gap-[27px] rounded-16 bg-neutral-5 py-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-13 font-medium text-neutral-50">
              {t('stake.total_compounded')}
            </p>
            <p className="text-27 font-semibold text-neutral-100">
              {`${formatSNT(
                formatUnits(
                  multiplierPointsData?.totalMpRedeemed ?? 0n,
                  STT_TOKEN.decimals
                )
              )} ${t('stake.points')}`}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-13 font-medium text-neutral-50">
              {t('stake.your_earn_rate', { boost: weightedBoost.formatted })}
            </p>
            <p className="text-27 font-semibold text-neutral-100">
              {earnRateWithBoost} {t('stake.karma_per_day')}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-13 font-medium text-neutral-50">
              {t('stake.equivalent_at_boost')}
            </p>
            <p className="text-27 font-semibold text-neutral-100">
              {earnRateWithoutBoost} {t('stake.karma_per_day')}
            </p>
          </div>
        </div>

        <div className="flex gap-2 rounded-12 border border-customisation-blue-50/10 bg-customisation-blue-50/5 px-4 py-[11px]">
          <div className="flex shrink-0 items-start justify-center py-px">
            <InfoIcon />
          </div>
          <p className="flex-1 text-13 font-regular text-neutral-100">
            {t('stake.compound_info')}
          </p>
        </div>
      </div>
    </>
  )
}
