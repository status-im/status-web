import { Skeleton } from '@status-im/components'

import { LeaderboardRow } from './leaderboard-row'

import type { LeaderboardRowProps } from './leaderboard-row'
import type { KarmaLeaderboardData, LeaderboardType } from '~types/karma'

type LeaderboardCardProps = {
  title: string
  type: LeaderboardType
  data: KarmaLeaderboardData
  currentUserAddress?: string
}

const cardClassName =
  'flex min-w-0 flex-1 flex-col gap-4 rounded-16 border border-neutral-10 bg-white-100 px-4 pb-6 pt-4 shadow-1'

const SKELETON_NAME_WIDTHS = [120, 108, 132, 114, 126, 110, 140, 118, 124, 106]

function toRows(
  data: KarmaLeaderboardData,
  type: LeaderboardType,
  currentUserAddress?: string
): LeaderboardRowProps[] {
  const isCurrentUser = (address: string) =>
    !!currentUserAddress &&
    address.toLowerCase() === currentUserAddress.toLowerCase()

  if (type === 'best') {
    return data.best.map((entry, i) => ({
      rank: i + 1,
      address: entry.address,
      value: entry.karma,
      type,
      isCurrentUser: isCurrentUser(entry.address),
    }))
  }

  if (type === 'gainers') {
    return data.gainers.map((entry, i) => ({
      rank: i + 1,
      address: entry.address,
      value: entry.diff,
      type,
      isCurrentUser: isCurrentUser(entry.address),
    }))
  }

  return data.ranked.map(entry => ({
    rank: entry.globalPosition,
    address: entry.address,
    value: entry.karma,
    type,
    isCurrentUser: isCurrentUser(entry.address),
  }))
}

const LeaderboardCardSkeleton = () => {
  return (
    <div className={cardClassName}>
      <Skeleton height={22} width={140} className="rounded-6" />
      <div className="flex flex-col gap-4">
        {SKELETON_NAME_WIDTHS.map((width, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Skeleton height={16} width={16} className="rounded-[5px]" />
              <Skeleton height={16} width={width} className="rounded-6" />
            </div>
            <Skeleton height={16} width={80} className="rounded-6" />
          </div>
        ))}
      </div>
    </div>
  )
}

const LeaderboardCard = (props: LeaderboardCardProps) => {
  const { title, type, data, currentUserAddress } = props
  const rows = toRows(data, type, currentUserAddress)

  return (
    <div className={cardClassName}>
      <p className="text-15 font-regular text-neutral-50">{title}</p>
      <div className="flex flex-col gap-4">
        {rows.map(row => (
          <LeaderboardRow key={`${type}-${row.rank}`} {...row} />
        ))}
      </div>
    </div>
  )
}

export { LeaderboardCard, LeaderboardCardSkeleton }
export type { LeaderboardCardProps }
