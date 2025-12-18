import { Skeleton } from '@status-im/components'
import { useTranslations } from 'next-intl'
import { useAccount, useReadContract } from 'wagmi'

import { SNTIcon } from '~components/icons'
import { STAKE_PAGE_CONSTANTS, STAKING_MANAGER } from '~constants/index'

import { formatSTT } from '../../../utils/currency'
import { useEmergencyModeEnabled } from '../../_hooks/useEmergencyModeEnabled'

const TotalStakedCardSkeleton = () => {
  const t = useTranslations()

  return (
    <div className="rounded-16 border border-neutral-10 bg-white-100 p-4 shadow-2 md:rounded-32 md:p-8">
      <div className="mb-2 flex items-start justify-between">
        <p className="text-13 font-500 text-neutral-60">
          {t('stake.total_staked')}
        </p>
      </div>
      <div className="mb-4 flex items-end gap-2">
        <SNTIcon />
        <Skeleton height={32} width={180} className="rounded-6" />
      </div>
      <Skeleton height={18} width={160} className="rounded-6" />
    </div>
  )
}

const TotalStakedCard = () => {
  const t = useTranslations()
  const { isConnecting } = useAccount()
  const { data: totalStaked, isLoading } = useReadContract({
    address: STAKING_MANAGER.address,
    abi: STAKING_MANAGER.abi,
    functionName: 'totalStaked',
  })
  const { data: emergencyModeEnabled } = useEmergencyModeEnabled()

  if (emergencyModeEnabled) {
    return null
  }

  if (isLoading || isConnecting) {
    return <TotalStakedCardSkeleton />
  }

  return (
    <div className="rounded-16 border border-neutral-10 bg-white-100 p-4 shadow-2 md:rounded-32 md:p-8">
      <div className="mb-2 flex items-start justify-between">
        <p className="text-13 font-500 text-neutral-60">
          {t('stake.total_staked')}
        </p>
      </div>
      <div className="mb-4 flex items-end gap-2">
        <SNTIcon />
        <span className="text-27 font-600">
          {formatSTT((totalStaked as bigint) ?? 0n, { includeSymbol: true })}
        </span>
      </div>
      <p className="text-13 font-500 text-neutral-40">
        {t('stake.next_unlock_in', {
          days: STAKE_PAGE_CONSTANTS.NEXT_UNLOCK_DAYS,
        })}
      </p>
    </div>
  )
}

export { TotalStakedCard, TotalStakedCardSkeleton }
