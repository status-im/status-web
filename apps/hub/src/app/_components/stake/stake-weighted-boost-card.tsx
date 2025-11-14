import { useMemo } from 'react'

import { Skeleton, Tooltip } from '@status-im/components'
import { ExternalIcon, InfoIcon } from '@status-im/icons/20'
import { Button, ButtonLink } from '@status-im/status-network/components'
import { useSIWE } from 'connectkit'
import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'

import { LaunchIcon } from '~components/icons'
import {
  DEFAULT_MP_VALUE,
  MAX_BOOST,
  SNT_TOKEN,
  TOOLTIP_CONFIG,
} from '~constants/index'
import { useCompoundMultiplierPoints } from '~hooks/useCompoundMultiplierPoints'
import { useMultiplierPointsBalance } from '~hooks/useMultiplierPoints'
import { useStakingVaults } from '~hooks/useStakingVaults'
import { useWeightedBoost } from '~hooks/useWeightedBoost'
import { formatSNT } from '~utils/currency'

const WeightedBoostCard = () => {
  const { isConnecting, isConnected } = useAccount()
  const { data: vaults, isLoading } = useStakingVaults()
  const { isSignedIn, isLoading: isLoadingSIWE } = useSIWE()
  const weightedBoost = useWeightedBoost(vaults)
  const { data: multiplierPointsData } = useMultiplierPointsBalance()
  const { mutate: compoundMultiplierPoints } = useCompoundMultiplierPoints()

  const {
    isDisabled: isDisabledMultiplierPoints,
    message: messageMultiplierPoints,
  } = useMemo(() => {
    const totalUncompounded =
      multiplierPointsData?.totalUncompounded ?? DEFAULT_MP_VALUE
    const hasUncompoundedPoints = totalUncompounded >= DEFAULT_MP_VALUE
    const formattedAmount = formatSNT(
      formatUnits(totalUncompounded, SNT_TOKEN.decimals),
      {
        decimals: SNT_TOKEN.decimals,
      }
    )

    return {
      isDisabled: !hasUncompoundedPoints || !isConnected || !isSignedIn,
      message: hasUncompoundedPoints
        ? `${Number(formattedAmount) > 0 ? formattedAmount : parseFloat(formattedAmount).toFixed(2)} points are ready to compound`
        : 'No points are ready to compound',
    }
  }, [multiplierPointsData, isConnected, isSignedIn])

  if (isLoading || isConnecting || isLoadingSIWE) {
    return (
      <div className="rounded-32 border border-neutral-10 bg-white-100 p-8 shadow-2">
        <div className="mb-2 flex items-start justify-between">
          <p className="text-13 font-500 text-neutral-60">
            Weighted aggregated boost
          </p>
          <InfoTooltip />
        </div>
        <div className="mb-4 flex items-end gap-3">
          <LaunchIcon className="text-purple" />
          <Skeleton height={32} width={100} className="rounded-6" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton height={18} width={200} className="rounded-6" />

          <Button variant="primary" size="40" disabled>
            Compound
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-32 border border-neutral-10 bg-white-100 p-8 shadow-2">
      <div className="mb-2 flex items-start justify-between">
        <p className="text-13 font-500 text-neutral-60">
          Weighted aggregated boost
        </p>
        <InfoTooltip />
      </div>
      <div className="mb-4 flex items-end gap-3">
        <LaunchIcon className="text-purple" />
        <span className="text-27 font-600">{weightedBoost.formatted}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-13 font-500 text-neutral-40">
          {messageMultiplierPoints}
        </span>
        <Button
          disabled={isDisabledMultiplierPoints}
          variant="primary"
          size="40"
          onClick={() => compoundMultiplierPoints()}
        >
          Compound
        </Button>
      </div>
    </div>
  )
}

const InfoTooltip = () => (
  <Tooltip
    delayDuration={TOOLTIP_CONFIG.DELAY_DURATION}
    side="top"
    className="border-0"
    content={
      <div className="flex w-[286px] flex-col gap-4 rounded-8 bg-white-100 p-4">
        <span className="text-13 text-neutral-100">
          The longer SNT is staked or locked in vaults, the higher this
          multiplier goes. This rewards long term believers. The maximum
          multiplier is x{MAX_BOOST}.
        </span>

        <ButtonLink
          href="https://docs.status.network/tokenomics/snt-staking"
          variant="outline"
          className="rounded-8 px-2 py-1"
          size="32"
          icon={<ExternalIcon className="size-3 text-neutral-50" />}
        >
          Learn more
        </ButtonLink>
      </div>
    }
  >
    <InfoIcon className="text-neutral-40" />
  </Tooltip>
)

export { WeightedBoostCard }
