/**
 * Percentage inset for edge dots in progress bar
 * to ensure they appear inside the rounded borders
 */
import type { KarmaLevel } from '~types/karma'

export const PROGRESS_BAR_DOT_INSET = {
  START: 0.1, // percentage from left edge
  END: 99, // percentage from left edge
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

export const KARMA_LEVELS: KarmaLevel[] = [
  { level: 0, minKarma: 0, maxKarma: 0 },
  { level: 1, minKarma: 1, maxKarma: 49 },
  { level: 2, minKarma: 50, maxKarma: 499 },
  { level: 4, minKarma: 500, maxKarma: 4999 },
  { level: 5, minKarma: 5000, maxKarma: 19999 },
  { level: 6, minKarma: 20000, maxKarma: Infinity },
  // { level: 7, minKarma: 100000, maxKarma: Infinity },
  // { level: 8, minKarma: 500000 },
  // { level: 9, minKarma: 5000000 },
  // { level: 10, minKarma: 10000000 },
]
