import { useMemo } from 'react'

import { Skeleton } from '@status-im/components'
import { Button } from '@status-im/status-network/components'
import { useSIWE } from 'connectkit'
import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'

import { LaunchIcon } from '~components/icons'
import { DEFAULT_MP_VALUE, MAX_BOOST, STT_TOKEN } from '~constants/index'
import { useCompoundMultiplierPoints } from '~hooks/useCompoundMultiplierPoints'
import { useMultiplierPointsBalance } from '~hooks/useMultiplierPoints'
import { useStakingVaults } from '~hooks/useStakingVaults'
import { useWeightedBoost } from '~hooks/useWeightedBoost'
import { formatSTT } from '~utils/currency'

import { useEmergencyModeEnabled } from '../../_hooks/useEmergencyModeEnabled'
import { InfoTooltip } from '../info-tooltip'

const WeightedBoostInfoTooltip = () => {
  return (
    <InfoTooltip
      content={`The longer STT is staked or locked in vaults, the higher this multiplier goes. This rewards long term believers. The maximum multiplier is x${MAX_BOOST}.`}
      link="https://docs.status.network/tokenomics/snt-staking"
    />
  )
}

const WeightedBoostCardSkeleton = () => {
  return (
    <div className="rounded-16 border border-neutral-10 bg-white-100 p-4 shadow-2 md:rounded-32 md:p-8">
      <div className="mb-2 flex items-start justify-between">
        <p className="text-13 font-500 text-neutral-60">
          Weighted aggregated boost
        </p>
        <WeightedBoostInfoTooltip />
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

const WeightedBoostCard = () => {
  const { isConnecting, isConnected } = useAccount()
  const { data: vaults, isLoading } = useStakingVaults()
  const { isSignedIn, isLoading: isLoadingSIWE } = useSIWE()
  const weightedBoost = useWeightedBoost(vaults)
  const { data: multiplierPointsData } = useMultiplierPointsBalance()
  const { mutate: compoundMultiplierPoints } = useCompoundMultiplierPoints()
  const { data: emergencyModeEnabled } = useEmergencyModeEnabled()

  const {
    isDisabled: isDisabledMultiplierPoints,
    message: messageMultiplierPoints,
  } = useMemo(() => {
    const totalUncompounded =
      multiplierPointsData?.totalUncompounded ?? DEFAULT_MP_VALUE
    const hasUncompoundedPoints = totalUncompounded > DEFAULT_MP_VALUE
    const formattedAmount = formatSTT(
      formatUnits(totalUncompounded, STT_TOKEN.decimals),
      {
        decimals: STT_TOKEN.decimals,
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
    return <WeightedBoostCardSkeleton />
  }

  return (
    <div className="rounded-16 border border-neutral-10 bg-white-100 p-4 shadow-2 md:rounded-32 md:p-8">
      <div className="mb-2 flex items-start justify-between">
        <p className="text-13 font-500 text-neutral-60">
          Weighted aggregated boost
        </p>
        <WeightedBoostInfoTooltip />
      </div>
      <div className="mb-4 flex items-end gap-3">
        <LaunchIcon className="text-purple" />
        <span className="text-27 font-600">{weightedBoost.formatted}</span>
      </div>
      <div className="flex flex-col items-center justify-between gap-2 md:flex-row md:items-center md:justify-between">
        <span className="text-13 font-500 text-neutral-40">
          {messageMultiplierPoints}
        </span>
        <Button
          disabled={isDisabledMultiplierPoints || Boolean(emergencyModeEnabled)}
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

export { WeightedBoostCard, WeightedBoostCardSkeleton }
