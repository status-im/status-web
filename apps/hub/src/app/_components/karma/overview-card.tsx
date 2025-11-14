import { useMemo } from 'react'

import { Skeleton } from '@status-im/components'
import { useSIWE } from 'connectkit'
import { formatEther } from 'viem'

import { useKarmaBalance } from '~hooks/useKarmaBalance'
import { useProcessedKarmaTiers } from '~hooks/useProcessedKarmaTiers'

import { AchievementBadges } from './achievement-badges'
import { getCurrentLevelData, ProgressBar } from './progress-tracker'

const KarmaOverviewCard = () => {
  const { data: karmaBalance, isLoading: karmaLoading } = useKarmaBalance()
  const { karmaLevels, isLoading: tiersLoading } = useProcessedKarmaTiers()
  const { isLoading: isSIWELoading } = useSIWE()

  const isLoading = karmaLoading || tiersLoading || isSIWELoading

  // Convert karma balance to number for calculations
  const numericKarma = useMemo(
    () => Number(formatEther(karmaBalance?.balance ?? 0n)),
    [karmaBalance?.balance]
  )

  // Ensure we have valid levels array before calculating level data
  const levelData = useMemo(
    () =>
      karmaLevels.length > 0
        ? getCurrentLevelData(numericKarma, karmaLevels)
        : undefined,
    [numericKarma, karmaLevels]
  )

  if (isLoading) {
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

  return (
    <div className="flex flex-1 flex-col rounded-20 border border-neutral-20 bg-white-100 shadow-1">
      <div className="flex flex-col gap-3 p-4 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-27 font-semibold text-neutral-100">
                {formatEther(karmaBalance?.balance ?? 0n)}
              </span>
              <span className="text-15 font-medium uppercase text-neutral-50">
                Karma
              </span>
            </div>
            <span className="text-15 font-regular text-neutral-50">
              Level {levelData?.level ?? 1} Kanji
            </span>
          </div>
        </div>
        <ProgressBar currentKarma={numericKarma} />
        <div className="flex h-14 items-center gap-1 border-t border-dashed border-neutral-20 pt-3">
          {/* <span className="text-15 font-medium text-neutral-50">#</span> */}
          {/* <span className="text-19 font-semibold text-neutral-100">{rank}</span> */}
        </div>
      </div>
      <div className="size-full rounded-b-20 bg-neutral-2.5 p-4">
        <AchievementBadges />
      </div>
    </div>
  )
}

export { KarmaOverviewCard }
