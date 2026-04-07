export interface KarmaLevel {
  level: number
  minKarma: bigint
  maxKarma: bigint
}

export type AchievementBadgeType =
  | 'LIQUIDITY_PROVIDER'
  | 'SERIAL_STAKER'
  | 'APPS_TRAVELER'
  | 'GENEROUS_TIPPER'

/**
 * Data interface for Karma Overview Card
 */
export interface KarmaOverviewData {
  isLoading?: boolean
  currentKarma: bigint
  achievements: AchievementBadgeType[]
}

/**
 * Data interface for Karma Visual Card
 */
export interface KarmaVisualData {
  isLoading?: boolean
  imageSrc: string
  imageAlt?: string
  onRefresh?: () => void
  onDownload?: () => void
}

/**
 * Data interface for Karma Source Card
 */
export interface KarmaSourceData {
  title: string
  amount: number
  onClaim?: (token: string) => void
  isClaimed?: boolean
  capApiEndpoint?: string
}

export type LeaderboardEntry = {
  rank: number
  address: string
  displayName: string | null
  karma: number
  isCurrentUser?: boolean
}

export type LeaderboardResponse = {
  entries: LeaderboardEntry[]
  updatedAt: string
}

export type KarmaLeaderboardData = {
  overall: LeaderboardResponse
  gainers: LeaderboardResponse
  surrounding: LeaderboardResponse
}

export type LeaderboardType = keyof KarmaLeaderboardData
