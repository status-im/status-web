/**
 * Time conversion constants for vault locking calculations
 */
export const TIME_CONSTANTS = {
  SECONDS_PER_MINUTE: 60,
  MINUTES_PER_HOUR: 60,
  HOURS_PER_DAY: 24,
  DAYS_PER_YEAR: 365,
} as const

/**
 * Calculated time conversion values
 */
export const SECONDS_PER_DAY =
  TIME_CONSTANTS.SECONDS_PER_MINUTE *
  TIME_CONSTANTS.MINUTES_PER_HOUR *
  TIME_CONSTANTS.HOURS_PER_DAY

export const MILLISECONDS_PER_DAY = SECONDS_PER_DAY * 1000

/**
 * Date formatting constants
 */
export const DATE_FORMAT = {
  PAD_LENGTH: 2,
  PAD_CHAR: '0',
  SEPARATOR: '/',
} as const

export const DEFAULT_LOCK_PERIOD = {
  INITIAL_YEARS: '0.25',
  INITIAL_DAYS: '90',
} as const
