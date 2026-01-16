import { useMemo } from 'react'

import { Skeleton } from '@status-im/components'
import { useSIWE } from 'connectkit'
import { useTranslations } from 'next-intl'
import { formatEther } from 'viem'
import { useAccount } from 'wagmi'

import { useKarmaBalance } from '~hooks/useKarmaBalance'
import { useProcessedKarmaTiers } from '~hooks/useProcessedKarmaTiers'
import { useQuota } from '~hooks/useQuota'
import { formatSNT } from '~utils/currency'

// import { AchievementBadges } from './achievement-badges'
import { getCurrentLevelData, ProgressBar } from './progress-tracker'

const OverviewCardSkeleton = () => {
  return (
    <div className="flex h-[302px] flex-1 flex-col rounded-20 border border-neutral-20 bg-white-100 shadow-1">
      <div className="flex flex-col gap-3 p-4 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton height={32} width={280} className="rounded-6" />
            <Skeleton height={16} width={120} className="rounded-6" />
          </div>

          <Skeleton height={32} width={80} className="rounded-6" />
        </div>

        <Skeleton height={68} width="100%" className="rounded-6" />

        <div className="flex items-center gap-1 border-t border-dashed border-neutral-20 pt-3">
          <Skeleton height={28} width={120} className="rounded-6" />
        </div>
      </div>
      <div className="size-full rounded-b-20 bg-neutral-2.5 p-4">
        <Skeleton height={24} width={500} className="rounded-6" />
      </div>
    </div>
  )
}

const OverviewCard = () => {
  const { isConnected } = useAccount()
  const { data: karmaBalance, isLoading: karmaLoading } = useKarmaBalance()
  const { karmaLevels, isLoading: tiersLoading } = useProcessedKarmaTiers()
  const { isLoading: isSIWELoading } = useSIWE()
  const t = useTranslations()
  const { data: quotaData, isLoading: quotaLoading } = useQuota({
    enabled: isConnected,
  })

  const isLoading =
    tiersLoading ||
    (isConnected && (karmaLoading || isSIWELoading || quotaLoading))

  const currentKarma = karmaBalance?.balance ?? 0n

  const levelData = useMemo(
    () =>
      karmaLevels.length > 0
        ? getCurrentLevelData(currentKarma, karmaLevels)
        : undefined,
    [currentKarma, karmaLevels]
  )

  const txPercentage =
    quotaData && quotaData.total > 0
      ? (quotaData.remaining / quotaData.total) * 100
      : 0

  const progressBarColor = useMemo(() => {
    if (txPercentage <= 33) {
      return 'bg-[#E95460]'
    }
    if (txPercentage <= 66) {
      return 'bg-yellow'
    }
    return 'bg-[#23ADA0]'
  }, [txPercentage])

  if (isLoading) {
    return <OverviewCardSkeleton />
  }

  return (
    <div className="flex flex-1 flex-col justify-between rounded-20 border border-neutral-20 bg-white-100 shadow-1">
      <div className="flex flex-col gap-3 px-4 pb-3 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-27 font-semibold text-neutral-100">
                {formatSNT(formatEther(currentKarma))}
              </span>
              <span className="text-15 font-medium uppercase text-neutral-50">
                Karma
              </span>
            </div>
            <span className="text-15 font-regular text-neutral-50">
              {t('karma.level', { level: levelData?.level ?? 0 })}
            </span>
          </div>
          {/* TODO: Replace with actual rank from API when available */}
          {/* {currentKarma > 0n && (
            <span className="text-15 font-semibold text-neutral-100">
              <span className="text-neutral-50">#</span>{' '}
              {Math.floor(Math.random() * 5000) + 1}
            </span>
          )} */}
        </div>
        <ProgressBar currentKarma={currentKarma} karmaLevels={karmaLevels} />

        {/* TXAllowance Section */}
        {quotaData && (
          <div className="flex flex-col gap-6 pt-3">
            <div className="flex flex-col items-baseline gap-1.5 sm:flex-row">
              <div className="text-27 font-semibold">
                <span className="text-neutral-100">
                  {quotaData.remaining.toLocaleString()}
                </span>
                <span className="text-neutral-40">
                  /
                  {quotaData.total >= 1000
                    ? `${quotaData.total / 1000}K`
                    : quotaData.total}
                </span>
              </div>
              <span className="text-15 font-regular text-neutral-50">
                free transactions left today
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-neutral-10">
              <div
                className={`h-full rounded-full transition-all duration-300 ${progressBarColor}`}
                style={{
                  width: `${txPercentage}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
      {/* <div className="size-full rounded-b-20 bg-neutral-2.5 p-4">
        <AchievementBadges />
      </div> */}
      <div className="mt-0 h-12 rounded-b-20 bg-neutral-2.5" />
    </div>
  )
}

export { OverviewCard, OverviewCardSkeleton }
