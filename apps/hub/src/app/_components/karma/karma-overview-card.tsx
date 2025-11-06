import { Skeleton } from '@status-im/components'
import { TwitterIcon } from '@status-im/icons/social'
import { Button } from '@status-im/status-network/components'

import { AchievementBadges } from './karma-achievement-badges'
import { getCurrentLevelData, ProgressBar } from './karma-progress-tracker'

import type { KarmaOverviewData } from '~types/karma'

type KarmaOverviewCardProps = KarmaOverviewData

const KarmaOverviewCard = ({
  currentKarma,
  rank,
  achievements,
  isLoading = false,
}: KarmaOverviewCardProps) => {
  const levelData = getCurrentLevelData(currentKarma)

  const formatKarma = (karma: number) => {
    return karma.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-[302px] flex-1 flex-col rounded-20 border border-neutral-20 bg-white-100 shadow-1">
        <div className="flex flex-col gap-3 p-4 pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton height={32} width={280} className="rounded-6" />
              <Skeleton height={16} width={120} className="rounded-6" />
            </div>

            <Button variant="black" size="32">
              Share
              <TwitterIcon />
            </Button>
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
                {formatKarma(currentKarma)}
              </span>
              <span className="text-15 font-medium uppercase text-neutral-50">
                Karma
              </span>
            </div>
            <span className="text-15 font-regular text-neutral-50">
              Level {levelData.level} Kanji
            </span>
          </div>

          <Button variant="black" size="32">
            Share
            <TwitterIcon />
          </Button>
        </div>
        <ProgressBar currentKarma={currentKarma} />
        <div className="flex items-center gap-1 border-t border-dashed border-neutral-20 pt-3">
          <span className="text-15 font-medium text-neutral-50">#</span>
          <span className="text-19 font-semibold text-neutral-100">{rank}</span>
        </div>
      </div>
      <div className="size-full rounded-b-20 bg-neutral-2.5 p-4">
        <AchievementBadges badges={achievements} />
      </div>
    </div>
  )
}

export { KarmaOverviewCard }
