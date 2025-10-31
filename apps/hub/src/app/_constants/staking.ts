/**
 * Staking Constants
 *
 * This file contains all magic numbers and constants used in the staking feature.
 * Centralizing these values makes the codebase more maintainable and easier to update.
 */

// ============================================================================
// Transaction Configuration
// ============================================================================

/**
 * Number of blocks to wait for transaction confirmation
 */
export const CONFIRMATION_BLOCKS = 1 as const

// ============================================================================
// Time Constants
// ============================================================================

/**
 * Time conversion constants
 */
export const TIME_CONSTANTS = {
  /** Number of milliseconds in one second */
  MILLISECONDS_PER_SECOND: 1000,
  /** Number of seconds in one day (24 * 60 * 60) */
  SECONDS_PER_DAY: 86400,
} as const

// ============================================================================
// Cache & Query Configuration
// ============================================================================

/**
 * Cache configuration for React Query
 */
export const CACHE_CONFIG = {
  /** Default stale time for staking vaults query (10 seconds) */
  DEFAULT_STALE_TIME: 10_000,
  /** Stale time for slider config (5 minutes) */
  SLIDER_STALE_TIME: 5 * 60 * 1000,
  /** Cache time for slider config (10 minutes) */
  SLIDER_CACHE_TIME: 10 * 60 * 1000,
  /** Stale time for multiplier points (30 seconds) */
  MP_STALE_TIME: 30_000,
  /** Refetch interval for multiplier points (60 seconds) */
  MP_REFETCH_INTERVAL: 60_000,
} as const

// ============================================================================
// Boost Multiplier Constants
// ============================================================================

/**
 * Base boost multiplier (1.0 = no boost)
 * This is the minimum multiplier when no MP has accrued
 */
export const BASE_BOOST = 1.0 as const

/**
 * Maximum boost multiplier achievable through staking and locking
 */
export const MAX_BOOST = 9 as const

/**
 * Number of decimal places to display for boost multipliers
 */
export const BOOST_DECIMALS = 2 as const

// ============================================================================
// Multiplier Points (MP) Constants
// ============================================================================

/**
 * Default multiplier points data when no data is available
 */
export const DEFAULT_MP_VALUE = 0n as const

// ============================================================================
// Vault Creation Constants
// ============================================================================

/**
 * Delay in milliseconds before resetting state after vault creation
 * This ensures toast notifications are rendered before state reset
 */
export const VAULT_CREATION_DELAY = 100 as const

/**
 * Event signature for VaultCreated(address indexed vault, address indexed owner)
 * Used to extract vault address from transaction logs
 */
export const VAULT_CREATED_EVENT_SIGNATURE =
  '0x5d9c31ffa0fecffd7cf379989a3c7af252f0335e0d2a1320b55245912c781f53' as const

// ============================================================================
// Lock Period Constants
// ============================================================================

/**
 * Default initial lock period values for the lock vault modal
 */
export const DEFAULT_LOCK_PERIOD = {
  /** Initial lock period in years as a string */
  INITIAL_YEARS: '0.25',
  /** Initial lock period in days as a string */
  INITIAL_DAYS: '90',
} as const

// ============================================================================
// Validation Constants
// ============================================================================

/**
 * Minimum amount that must be staked (in token units)
 */
export const MIN_STAKE_AMOUNT = 0n as const

/**
 * Minimum lock period (in seconds)
 */
export const MIN_LOCK_PERIOD = 0n as const

// ============================================================================
// UI Constants
// ============================================================================

/**
 * Placeholder value displayed in disconnected state
 */
export const PLACEHOLDER_AMOUNT = '0' as const

/**
 * Default decimal places for formatting boost multipliers in the UI
 */
export const DEFAULT_DECIMALS = 2 as const

/**
 * Vault boost when no stake exists (displayed as "1.00")
 */
export const DEFAULT_VAULT_BOOST = '1.00' as const

// ============================================================================
// Stake Page Constants
// ============================================================================

/**
 * Hard-coded values in the stake page that should be reviewed
 * NOTE: These may need to be fetched from contracts or made configurable
 */
export const STAKE_PAGE_CONSTANTS = {
  /** Default lock period when staking without locking (0 seconds) */
  DEFAULT_STAKE_LOCK_PERIOD: 0n,
  /** Placeholder text for next unlock time (should be dynamic) */
  NEXT_UNLOCK_DAYS: 356,
} as const

// ============================================================================
// Tooltip Configuration
// ============================================================================

/**
 * Configuration for info tooltips
 */
export const TOOLTIP_CONFIG = {
  /** Delay before showing tooltip (in milliseconds) */
  DELAY_DURATION: 150,
  /** Width of weighted boost info tooltip (in pixels) */
  WEIGHTED_BOOST_WIDTH: 286,
} as const
