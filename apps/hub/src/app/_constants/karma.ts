/**
 * Percentage inset for edge dots in progress bar
 * to ensure they appear inside the rounded borders
 */
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
