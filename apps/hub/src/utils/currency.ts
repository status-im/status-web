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

/**
 * Convert bigint to number with proper decimal handling
 */
function bigIntToNumber(value: bigint, decimals: number = 18): number {
  const divisor = BigInt(10 ** decimals)
  const whole = value / divisor
  const remainder = value % divisor

  // Convert remainder to decimal
  const decimalStr = remainder.toString().padStart(decimals, '0')
  const decimal = Number(`0.${decimalStr}`)

  return Number(whole) + decimal
}

/**
 * Format a token amount with proper decimal handling
 */
export function formatTokenAmount(
  amount: number | bigint | string,
  token: string,
  options: FormatTokenOptions = {}
): string {
  const {
    decimals = 2,
    minimumFractionDigits = decimals,
    maximumFractionDigits = decimals,
    includeSymbol = false,
    locale = 'en-US',
    compact = false,
    roundDown = false,
    tokenDecimals = 18,
  } = options

  // Convert to number
  let numericAmount: number
  if (typeof amount === 'bigint') {
    numericAmount = bigIntToNumber(amount, tokenDecimals)
  } else if (typeof amount === 'string') {
    numericAmount = Number(amount)
  } else {
    numericAmount = amount
  }

  // Round down if requested
  if (roundDown) {
    const factor = Math.pow(10, maximumFractionDigits)
    numericAmount = Math.floor(numericAmount * factor) / factor
  }

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
    notation: compact ? 'compact' : 'standard',
    compactDisplay: compact ? 'short' : undefined,
  })

  const formatted = formatter.format(numericAmount)

  return includeSymbol ? `${formatted} ${token}` : formatted
}

/**
 * Format SNT token amount
 */
export function formatSNT(
  amount: number | bigint | string,
  options: Omit<FormatTokenOptions, 'includeSymbol'> & {
    includeSymbol?: boolean
  } = {}
): string {
  return formatTokenAmount(amount, 'SNT', {
    ...options,
    // Don't apply decimal conversion for SNT - values are already in display units
    tokenDecimals: 0,
  })
}

/**
 * Format KARMA token amount
 */
export function formatKarma(
  amount: number | bigint | string,
  options: Omit<FormatTokenOptions, 'includeSymbol'> & {
    includeSymbol?: boolean
  } = {}
): string {
  return formatTokenAmount(amount, 'KARMA', {
    ...options,
    // Don't apply decimal conversion for KARMA - values are already in display units
    tokenDecimals: 0,
  })
}

/**
 * Format ETH amount
 */
export function formatETH(
  amount: number | bigint | string,
  options: Omit<FormatTokenOptions, 'includeSymbol'> & {
    includeSymbol?: boolean
  } = {}
): string {
  return formatTokenAmount(amount, 'ETH', {
    ...options,
    decimals: options.decimals ?? 4,
  })
}

/**
 * Format stablecoin amount (USDC, USDT, DAI)
 */
export function formatStablecoin(
  amount: number | bigint | string,
  token: 'USDC' | 'USDT' | 'DAI',
  options: Omit<FormatTokenOptions, 'includeSymbol'> & {
    includeSymbol?: boolean
  } = {}
): string {
  return formatTokenAmount(amount, token, options)
}

/**
 * Format a currency value for display in UI
 * Automatically handles large numbers with compact notation
 */
export function formatCurrency(
  amount: number | bigint | string,
  options: FormatTokenOptions & { symbol?: string } = {}
): string {
  const { symbol = '', tokenDecimals = 18, ...rest } = options

  let numericAmount: number
  if (typeof amount === 'bigint') {
    numericAmount = bigIntToNumber(amount, tokenDecimals)
  } else if (typeof amount === 'string') {
    numericAmount = Number(amount)
  } else {
    numericAmount = amount
  }

  // Auto-enable compact for large numbers
  const shouldCompact =
    rest.compact !== false && Math.abs(numericAmount) >= 1000000

  const formatter = new Intl.NumberFormat(rest.locale ?? 'en-US', {
    minimumFractionDigits: rest.minimumFractionDigits ?? rest.decimals ?? 2,
    maximumFractionDigits: rest.maximumFractionDigits ?? rest.decimals ?? 2,
    notation: shouldCompact ? 'compact' : 'standard',
    compactDisplay: 'short',
  })

  const formatted = formatter.format(numericAmount)
  return symbol ? `${symbol}${formatted}` : formatted
}

/**
 * Parse a formatted token string back to a number
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

  // Remove commas and other formatting
  cleaned = cleaned.replace(/[,\s]/g, '')

  // Handle compact notation (K, M, B)
  const multipliers: Record<string, number> = {
    K: 1000,
    M: 1000000,
    B: 1000000000,
    T: 1000000000000,
  }

  const match = cleaned.match(/^([\d.]+)([KMBT])$/i)
  if (match) {
    const [, num, suffix] = match
    const multiplier = multipliers[suffix.toUpperCase()] || 1
    return Number(num) * multiplier
  }

  return Number(cleaned)
}
