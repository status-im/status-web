export interface KarmaLevel {
  level: number
  minKarma: number
  maxKarma: number
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
  currentKarma: number
  rank: number
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
