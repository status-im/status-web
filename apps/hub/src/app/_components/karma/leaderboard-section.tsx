'use client'

import { useTranslations } from 'next-intl'
import { useAccount } from 'wagmi'

import { useKarmaLeaderboard } from '~hooks/useKarmaLeaderboard'

import { LeaderboardCard, LeaderboardCardSkeleton } from './leaderboard-card'

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

const LeaderboardSection = () => {
  const t = useTranslations()
  const { address, isConnected } = useAccount()
  const { data, isLoading } = useKarmaLeaderboard()

  if (!isConnected) {
    return null
  }

  if (isLoading || !data) {
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
          type="best"
          data={data}
          currentUserAddress={address}
        />
        <LeaderboardCard
          title={t('karma.leaderboard_gainers')}
          type="gainers"
          data={data}
          currentUserAddress={address}
        />
        <LeaderboardCard
          title={t('karma.leaderboard_your_place')}
          type="ranked"
          data={data}
          currentUserAddress={address}
        />
      </div>
    </div>
  )
}

export { LeaderboardSection, LeaderboardSectionSkeleton }
