import { Skeleton } from '@status-im/components'
import { formatEther } from 'viem'
import { useAccount, useReadContract } from 'wagmi'

import { SNTIcon } from '~components/icons'
import { STAKE_PAGE_CONSTANTS, STAKING_MANAGER } from '~constants/index'

const TotalStakedCard = () => {
  const { isConnecting } = useAccount()
  const { data: totalStakedData, isLoading } = useReadContract({
    address: STAKING_MANAGER.address,
    abi: STAKING_MANAGER.abi,
    functionName: 'totalStaked',
  })

  if (isLoading || isConnecting) {
    return (
      <div className="rounded-32 border border-neutral-10 bg-white-100 p-8 shadow-2">
        <div className="mb-2 flex items-start justify-between">
          <p className="text-13 font-500 text-neutral-60">Total staked</p>
        </div>
        <div className="mb-4 flex items-end gap-2">
          <SNTIcon />
          <Skeleton height={32} width={180} className="rounded-6" />
        </div>
        <Skeleton height={18} width={160} className="rounded-6" />
      </div>
    )
  }

  return (
    <div className="rounded-32 border border-neutral-10 bg-white-100 p-8 shadow-2">
      <div className="mb-2 flex items-start justify-between">
        <p className="text-13 font-500 text-neutral-60">Total staked</p>
      </div>
      <div className="mb-4 flex items-end gap-2">
        <SNTIcon />
        <span className="text-27 font-600">
          {formatEther((totalStakedData as bigint) ?? 0n)}
        </span>
      </div>
      <p className="text-13 font-500 text-neutral-40">
        Next unlock in {STAKE_PAGE_CONSTANTS.NEXT_UNLOCK_DAYS} days
      </p>
    </div>
  )
}

export { TotalStakedCard }
