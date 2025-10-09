/* eslint-disable import/no-unresolved */
import * as Dialog from '@radix-ui/react-dialog'
import { InfoIcon } from '@status-im/icons/16'
import { formatUnits } from 'viem'

import { LaunchIcon } from '~components/icons'
import { useMultiplierPointsBalance } from '~hooks/useMultiplierPoints'
import { useStakingVaults } from '~hooks/useStakingVaults'
import { useWeightedBoost } from '~hooks/useWeightedBoost'
import { formatSNT } from '~utils/currency'

import { SNT_TOKEN } from '../../_constants'

export const CompoundStatusContent = () => {
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
            <h2 className="text-center text-[19px] font-semibold leading-[1.35] tracking-[-0.019rem] text-neutral-100">
              {`Ready to compound ${formatSNT(
                formatUnits(
                  multiplierPointsData?.totalUncompounded ?? 0n,
                  SNT_TOKEN.decimals
                )
              )} points`}
            </h2>
          </Dialog.Title>
          <Dialog.Description asChild>
            <p className="text-center text-[15px] font-regular leading-[1.45] tracking-[-0.0084375rem] text-neutral-100">
              Please sign the message in your wallet.
            </p>
          </Dialog.Description>
        </div>

        <div className="flex flex-col gap-[27px] rounded-16 bg-neutral-5 py-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-[13px] font-medium leading-[1.4] tracking-[-0.024375rem] text-neutral-50">
              Total compounded
            </p>
            <p className="text-[27px] font-semibold leading-8 tracking-[-0.0354375rem] text-neutral-100">
              {`${formatSNT(
                formatUnits(
                  multiplierPointsData?.totalMpRedeemed ?? 0n,
                  SNT_TOKEN.decimals
                )
              )} points`}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-[13px] font-medium leading-[1.4] tracking-[-0.024375rem] text-neutral-50">
              Your earn rate at {weightedBoost.formatted} boost
            </p>
            <p className="text-[27px] font-semibold leading-8 tracking-[-0.0354375rem] text-neutral-100">
              {earnRateWithBoost} Karma / day
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-[13px] font-medium leading-[1.4] tracking-[-0.024375rem] text-neutral-50">
              Equivalent at x0.00 boost
            </p>
            <p className="text-[27px] font-semibold leading-8 tracking-[-0.0354375rem] text-neutral-100">
              {earnRateWithoutBoost} Karma / day
            </p>
          </div>
        </div>

        <div className="flex gap-2 rounded-12 border border-customisation-blue-50/10 bg-customisation-blue-50/5 px-4 py-[11px]">
          <div className="flex shrink-0 items-start justify-center py-px">
            <InfoIcon />
          </div>
          <p className="flex-1 text-[13px] font-regular leading-[1.4] tracking-[-0.024375rem] text-neutral-100">
            Boost the rate at which you receive Karma. More points you compound,
            the higher your rate. The longer you lock your vault, the higher
            your boost, and the faster you accumulate Karma.
          </p>
        </div>
      </div>
    </>
  )
}
