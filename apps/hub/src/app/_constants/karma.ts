import type { KarmaLevel } from '~types/karma'

export const KARMA_LEVELS: KarmaLevel[] = [
  { level: 1, minKarma: 0, maxKarma: 25000 },
  { level: 2, minKarma: 25000, maxKarma: 50000 },
  { level: 3, minKarma: 50000, maxKarma: 75000 },
  { level: 4, minKarma: 75000, maxKarma: 100000 },
  { level: 5, minKarma: 100000, maxKarma: Infinity },
]

/**
 * Percentage inset for edge dots in progress bar
 * to ensure they appear inside the rounded borders
 */
export const PROGRESS_BAR_DOT_INSET = {
  START: 0.1, // percentage from left edge
  END: 99, // percentage from left edge
} as const

/**
 * Minimum and maximum level numbers
 */
export const KARMA_LEVEL_BOUNDS = {
  MIN: 1,
  MAX: KARMA_LEVELS.length,
} as const

/**
 * Progress bar dot colors
 */
export const PROGRESS_BAR_DOT_COLORS = {
  REACHED: 'bg-purple', // Purple - when milestone is reached
  UNREACHED: 'bg-neutral-80/20', // Gray - when milestone is not reached
} as const

/**
 * Achievement badge types and their colors
 */
export const ACHIEVEMENT_BADGE_TYPES = {
  LIQUIDITY_PROVIDER: {
    label: 'Liquidity Provider',
    color: 'yellow',
  },
  SERIAL_STAKER: {
    label: 'Serial Staker',
    color: 'purple',
  },
  APPS_TRAVELER: {
    label: 'Apps Traveler',
    color: 'turquoise',
  },
  GENEROUS_TIPPER: {
    label: 'Generous Tipper',
    color: 'copper',
  },
} as const
