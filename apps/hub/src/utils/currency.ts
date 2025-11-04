import { formatUnits, parseUnits } from 'viem'

// ============================================================================
// Types
// ============================================================================

export interface FormatTokenOptions {
  /**
   * Number of decimal places to display
   * @default 2
   */
  decimals?: number
  /**
   * Minimum number of decimal places
   * @default decimals value
   */
  minimumFractionDigits?: number
  /**
   * Maximum number of decimal places
   * @default decimals value
   */
  maximumFractionDigits?: number
  /**
   * Whether to include the token symbol
   * @default false
   */
  includeSymbol?: boolean
  /**
   * Locale for number formatting
   * @default 'en-US'
   */
  locale?: string
  /**
   * Whether to use compact notation (K, M, B)
   * @default false
   */
  compact?: boolean
  /**
   * Whether to round down instead of rounding to nearest
   * @default false
   */
  roundDown?: boolean
  /**
   * Number of decimals for the token (used for bigint conversion)
   * @default 18
   */
  tokenDecimals?: number
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_LOCALE = 'en-US'
const DEFAULT_DISPLAY_DECIMALS = 2
const DEFAULT_TOKEN_DECIMALS = 18
const COMPACT_THRESHOLD = 1_000_000

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert bigint to number using viem's formatUnits for precision
 *
 * @param value - The bigint value to convert
 * @param decimals - Number of decimals for the token
 * @returns Numeric representation of the token amount
 */
function bigIntToNumber(
  value: bigint,
  decimals: number = DEFAULT_TOKEN_DECIMALS
): number {
  // Use viem's formatUnits for proper decimal handling
  const formatted = formatUnits(value, decimals)
  return Number(formatted)
}

/**
 * Converts various input types to a numeric value
 *
 * @param amount - The amount to convert (bigint, number, or string)
 * @param tokenDecimals - Number of decimals for bigint conversion
 * @returns Numeric representation of the amount
 */
function toNumericAmount(
  amount: number | bigint | string,
  tokenDecimals: number
): number {
  if (typeof amount === 'bigint') {
    return bigIntToNumber(amount, tokenDecimals)
  }

  if (typeof amount === 'string') {
    return Number(amount)
  }

  return amount
}

/**
 * Applies rounding down to a numeric value
 *
 * @param value - The value to round
 * @param decimals - Number of decimal places to preserve
 * @returns Rounded down value
 */
function roundDownToDecimals(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.floor(value * factor) / factor
}

// ============================================================================
// Core Formatting Functions
// ============================================================================

/**
 * Format a token amount with proper decimal handling using viem utilities
 *
 * @param amount - Token amount (supports bigint, number, or string)
 * @param token - Token symbol (e.g., 'SNT', 'ETH')
 * @param options - Formatting options
 * @returns Formatted token amount string
 *
 * @example
 * ```ts
 * formatTokenAmount(1234567890000000000n, 'SNT', { tokenDecimals: 18 })
 * // => "1.23"
 *
 * formatTokenAmount(1500, 'SNT', { includeSymbol: true, compact: true })
 * // => "1.5K SNT"
 * ```
 */
export function formatTokenAmount(
  amount: number | bigint | string,
  token: string,
  options: FormatTokenOptions = {}
): string {
  const {
    decimals = DEFAULT_DISPLAY_DECIMALS,
    minimumFractionDigits = decimals,
    maximumFractionDigits = decimals,
    includeSymbol = false,
    locale = DEFAULT_LOCALE,
    compact = false,
    roundDown = false,
    tokenDecimals = DEFAULT_TOKEN_DECIMALS,
  } = options

  // Convert to numeric value
  let numericAmount = toNumericAmount(amount, tokenDecimals)

  // Apply rounding down if requested
  if (roundDown) {
    numericAmount = roundDownToDecimals(numericAmount, maximumFractionDigits)
  }

  // Format using Intl.NumberFormat
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
    notation: compact ? 'compact' : 'standard',
    compactDisplay: compact ? 'short' : undefined,
  })

  const formatted = formatter.format(numericAmount)

  return includeSymbol ? `${formatted} ${token}` : formatted
}

// ============================================================================
// Token-Specific Formatters
// ============================================================================

/**
 * Format SNT (Status Network Token) amount
 *
 * @param amount - Token amount in wei (bigint) or display units (number/string)
 * @param options - Formatting options
 * @returns Formatted SNT amount
 *
 * @example
 * ```ts
 * formatSNT(1234567890000000000n) // => "1.23"
 * formatSNT(100, { includeSymbol: true }) // => "100.00 SNT"
 * ```
 */
export function formatSNT(
  amount: number | bigint | string,
  options: Omit<FormatTokenOptions, 'tokenDecimals'> = {}
): string {
  return formatTokenAmount(amount, 'SNT', {
    ...options,
    tokenDecimals: DEFAULT_TOKEN_DECIMALS, // SNT has 18 decimals
  })
}

/**
 * Format KARMA token amount
 *
 * @param amount - Token amount
 * @param options - Formatting options
 * @returns Formatted KARMA amount
 */
export function formatKarma(
  amount: number | bigint | string,
  options: Omit<FormatTokenOptions, 'tokenDecimals'> = {}
): string {
  return formatTokenAmount(amount, 'KARMA', {
    ...options,
    tokenDecimals: 0, // KARMA values are already in display units
  })
}

/**
 * Format ETH (Ether) amount
 *
 * @param amount - ETH amount in wei (bigint) or display units (number/string)
 * @param options - Formatting options
 * @returns Formatted ETH amount
 *
 * @example
 * ```ts
 * formatETH(1000000000000000000n) // => "1.0000"
 * formatETH(0.123456789, { decimals: 6 }) // => "0.123457"
 * ```
 */
export function formatETH(
  amount: number | bigint | string,
  options: Omit<FormatTokenOptions, 'tokenDecimals'> = {}
): string {
  return formatTokenAmount(amount, 'ETH', {
    decimals: 4, // Default to 4 decimals for ETH
    ...options,
    tokenDecimals: DEFAULT_TOKEN_DECIMALS, // ETH has 18 decimals
  })
}

/**
 * Format stablecoin amount (USDC, USDT, DAI)
 *
 * @param amount - Stablecoin amount in smallest unit (bigint) or display units (number/string)
 * @param token - Stablecoin symbol
 * @param options - Formatting options
 * @returns Formatted stablecoin amount
 *
 * @example
 * ```ts
 * formatStablecoin(1000000n, 'USDC') // => "1.00" (USDC has 6 decimals)
 * formatStablecoin(1000000000000000000n, 'DAI') // => "1.00" (DAI has 18 decimals)
 * ```
 */
export function formatStablecoin(
  amount: number | bigint | string,
  token: 'USDC' | 'USDT' | 'DAI',
  options: Omit<FormatTokenOptions, 'tokenDecimals'> = {}
): string {
  // USDC and USDT typically have 6 decimals, DAI has 18
  const decimals = token === 'DAI' ? DEFAULT_TOKEN_DECIMALS : 6

  return formatTokenAmount(amount, token, {
    ...options,
    tokenDecimals: decimals,
  })
}

/**
 * Format a currency value for display in UI
 * Uses Intl.NumberFormat with USD currency by default
 * Automatically handles large numbers with compact notation
 *
 * @param amount - Currency amount
 * @param options - Formatting options
 * @returns Formatted currency string
 *
 * @example
 * ```ts
 * formatCurrency(1234567) // => "$1.23M"
 * formatCurrency(999) // => "$999.00"
 * formatCurrency(1500000n, { tokenDecimals: 18 }) // => "$0.00"
 * formatCurrency(100, { currency: 'EUR' }) // => "€100.00"
 * ```
 */
export function formatCurrency(
  amount: number | bigint | string,
  options: FormatTokenOptions & { currency?: string } = {}
): string {
  const {
    currency = 'USD',
    tokenDecimals = 0, // Default to 0 for currency values (already in display units)
    locale = DEFAULT_LOCALE,
    decimals = DEFAULT_DISPLAY_DECIMALS,
    ...rest
  } = options

  const numericAmount = toNumericAmount(amount, tokenDecimals)

  // Auto-enable compact notation for large numbers (>= 1M)
  const shouldCompact =
    rest.compact !== false && Math.abs(numericAmount) >= COMPACT_THRESHOLD

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: rest.minimumFractionDigits ?? decimals,
    maximumFractionDigits: rest.maximumFractionDigits ?? decimals,
    notation: shouldCompact ? 'compact' : 'standard',
    compactDisplay: 'short',
  })

  return formatter.format(numericAmount)
}

// ============================================================================
// Parsing Functions
// ============================================================================

/**
 * Compact notation multipliers
 */
const COMPACT_MULTIPLIERS: Record<string, number> = {
  K: 1_000,
  M: 1_000_000,
  B: 1_000_000_000,
  T: 1_000_000_000_000,
} as const

/**
 * Parse a formatted token string back to a number
 *
 * Handles:
 * - Comma-separated numbers (1,234.56)
 * - Compact notation (1.5K, 2M, 3.5B)
 * - Token symbols (100 SNT)
 *
 * @param formattedAmount - The formatted string to parse
 * @param token - Optional token symbol to remove from the string
 * @returns Numeric value
 *
 * @example
 * ```ts
 * parseTokenAmount('1,234.56') // => 1234.56
 * parseTokenAmount('1.5K') // => 1500
 * parseTokenAmount('100 SNT', 'SNT') // => 100
 * ```
 */
export function parseTokenAmount(
  formattedAmount: string,
  token?: string
): number {
  // Remove token symbol if present
  let cleaned = formattedAmount
  if (token) {
    cleaned = cleaned.replace(token, '').trim()
  }

  // Remove commas and spaces
  cleaned = cleaned.replace(/[,\s]/g, '')

  // Handle compact notation (K, M, B, T)
  const compactMatch = cleaned.match(/^([\d.]+)([KMBT])$/i)
  if (compactMatch) {
    const [, numStr, suffix] = compactMatch
    const multiplier = COMPACT_MULTIPLIERS[suffix.toUpperCase()] ?? 1
    return Number(numStr) * multiplier
  }

  return Number(cleaned)
}

/**
 * Parse a user input amount and convert to wei (bigint) using viem's parseUnits
 *
 * @param amount - User input amount (e.g., "1.5", "100")
 * @param decimals - Number of decimals for the token
 * @returns Amount in wei as bigint
 *
 * @example
 * ```ts
 * parseToWei('1.5', 18) // => 1500000000000000000n
 * parseToWei('100', 6) // => 100000000n (for USDC)
 * ```
 */
export function parseToWei(
  amount: string,
  decimals: number = DEFAULT_TOKEN_DECIMALS
): bigint {
  return parseUnits(amount, decimals)
}
