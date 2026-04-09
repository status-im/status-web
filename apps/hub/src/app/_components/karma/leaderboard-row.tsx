import { CrownIcon } from '@status-im/icons/20'

import { shortenAddress } from '~utils/address'
import { formatKarma } from '~utils/currency'

import type { LeaderboardType } from '~types/karma'

const CROWN_COLORS: Record<number, string> = {
  1: 'text-yellow',
  2: 'text-neutral-40',
  3: 'text-orange',
}

type RankBadgeProps = {
  rank: number
  isCurrentUser: boolean
  type: LeaderboardType
}

const RankBadge = (props: RankBadgeProps) => {
  const { rank, isCurrentUser, type } = props
  const crownColor = CROWN_COLORS[rank]

  if (type === 'best' && crownColor && rank <= 3) {
    return <CrownIcon className={`size-5 shrink-0 ${crownColor}`} />
  }

  const borderColor = isCurrentUser
    ? 'border-purple text-purple'
    : 'border-neutral-50 text-neutral-50'

  return (
    <div
      className={`flex min-w-[16px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] px-[3px] ${borderColor}`}
    >
      <span className="text-11 font-semibold leading-tight">{rank}</span>
    </div>
  )
}

export type LeaderboardRowProps = {
  rank: number
  address: string
  value: number
  type: LeaderboardType
  isCurrentUser: boolean
}

const LeaderboardRow = (props: LeaderboardRowProps) => {
  const { rank, address, value, type, isCurrentUser } = props
  const name = shortenAddress(address)
  const isGainer = type === 'gainers'

  const textColor = isCurrentUser
    ? 'text-purple'
    : isGainer
      ? 'text-sea'
      : 'text-neutral-100'

  const nameColor = isCurrentUser ? 'text-purple' : 'text-neutral-70'
  const suffixColor = isCurrentUser ? 'text-purple' : 'text-neutral-50'
  const prefix = isGainer && !isCurrentUser ? '+' : ''

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-1">
        <div className="flex h-5 shrink-0 items-center justify-center px-0.5">
          <RankBadge rank={rank} isCurrentUser={isCurrentUser} type={type} />
        </div>
        <p className={`truncate text-15 font-medium ${nameColor}`}>{name}</p>
      </div>
      <p className="shrink-0 whitespace-nowrap text-right text-15 font-medium">
        <span className={textColor}>
          {prefix}
          {formatKarma(value)}
        </span>
        <span className={suffixColor}> TKARMA</span>
      </p>
    </div>
  )
}

export { LeaderboardRow }
