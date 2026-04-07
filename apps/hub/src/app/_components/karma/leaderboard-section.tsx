'use client'

import { useTranslations } from 'next-intl'

import { LEADERBOARD_MOCK } from '~constants/leaderboard-mock'

import { LeaderboardCard, LeaderboardCardSkeleton } from './leaderboard-card'

type LeaderboardSectionProps = {
  isLoading?: boolean
}

const LeaderboardSectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-19 font-semibold text-neutral-100">Leaderboard</h2>
      <div className="flex flex-col gap-8 xl:flex-row xl:gap-8">
        <LeaderboardCardSkeleton />
        <LeaderboardCardSkeleton />
        <LeaderboardCardSkeleton />
      </div>
    </div>
  )
}

const LeaderboardSection = (props: LeaderboardSectionProps) => {
  const { isLoading = false } = props
  const t = useTranslations()

  const data = LEADERBOARD_MOCK

  if (isLoading) {
    return <LeaderboardSectionSkeleton />
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-19 font-semibold text-neutral-100">
        {t('karma.leaderboard')}
      </h2>
      <div className="flex flex-col gap-8 xl:flex-row xl:gap-8">
        <LeaderboardCard
          title={t('karma.leaderboard_overall')}
          entries={data.overall.entries}
          type="overall"
        />
        <LeaderboardCard
          title={t('karma.leaderboard_gainers')}
          entries={data.gainers.entries}
          type="gainers"
        />
        <LeaderboardCard
          title={t('karma.leaderboard_your_place')}
          entries={data.surrounding.entries}
          type="surrounding"
        />
      </div>
    </div>
  )
}

export { LeaderboardSection, LeaderboardSectionSkeleton }
export type { LeaderboardSectionProps }
