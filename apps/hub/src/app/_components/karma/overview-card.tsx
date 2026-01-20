import {
  KarmaOverviewCardSkeleton,
  KarmaProgressBar,
  // QuotaProgressBar,
} from '@status-im/components'
// import { AchievementBadges } from './achievement-badges'
import { useSIWE } from 'connectkit'
import { formatEther } from 'viem'
import { useAccount } from 'wagmi'

import { useKarmaBalance } from '~hooks/useKarmaBalance'
import { useProcessedKarmaTiers } from '~hooks/useProcessedKarmaTiers'
// import { useQuota } from '~hooks/useQuota'
import { formatSNT } from '~utils/currency'

const OverviewCard = () => {
  const { isConnected } = useAccount()
  const { data: karmaBalance, isLoading: karmaLoading } = useKarmaBalance()
  const { karmaLevels, isLoading: tiersLoading } = useProcessedKarmaTiers()
  const { isLoading: isSIWELoading } = useSIWE()
  // const { data: quotaData, isLoading: quotaLoading } = useQuota({
  //   enabled: isConnected,
  // })

  const isLoading =
    tiersLoading || (isConnected && (karmaLoading || isSIWELoading))

  const currentKarma = karmaBalance?.balance ?? 0n

  if (isLoading) {
    return <KarmaOverviewCardSkeleton />
  }

  return (
    <div className="flex flex-1 flex-col justify-between rounded-20 border border-neutral-20 bg-white-100 shadow-1">
      <div className="flex flex-col gap-6 px-4 pb-3 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-27 font-semibold text-neutral-100">
                {formatSNT(formatEther(currentKarma))}
              </span>
              <span className="text-15 font-medium uppercase text-neutral-50">
                Karma
              </span>
            </div>
          </div>
          {/* TODO: Replace with actual rank from API when available */}
          {/* {currentKarma > 0n && (
            <span className="text-15 font-semibold text-neutral-100">
              <span className="text-neutral-50">#</span>{' '}
              {Math.floor(Math.random() * 5000) + 1}
            </span>
          )} */}
        </div>
        <KarmaProgressBar
          currentKarma={currentKarma}
          karmaLevels={karmaLevels}
        />

        {/* TODO: Enable TX allowance when API is ready */}
        {/* {quotaData && (
          <div className="pt-3">
            <QuotaProgressBar
              remaining={quotaData.remaining}
              total={quotaData.total}
              label={t('karma.free_transactions_left_today')}
            />
          </div>
        )} */}
      </div>
      {/* <div className="size-full rounded-b-20 bg-neutral-2.5 p-4">
        <AchievementBadges />
      </div> */}
      <div className="mt-0 h-12 rounded-b-20 bg-neutral-2.5" />
    </div>
  )
}

export { OverviewCard }
