import { formatUnits } from 'viem'

const DEFAULT_LOCALE = 'en-US'
const DEFAULT_DISPLAY_DECIMALS = 2
const DEFAULT_TOKEN_DECIMALS = 18

function bigIntToNumber(
  value: bigint,
  decimals: number = DEFAULT_TOKEN_DECIMALS,
): number {
  const formatted = formatUnits(value, decimals)
  return Number(formatted)
}

function toNumericAmount(
  amount: number | bigint | string,
  tokenDecimals: number,
): number {
  if (typeof amount === 'bigint') {
    return bigIntToNumber(amount, tokenDecimals)
  }

  if (typeof amount === 'string') {
    return Number(amount)
  }

  return amount
}

export function formatSNT(
  amount: number | bigint | string,
  options: {
    decimals?: number
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    includeSymbol?: boolean
    locale?: string
    compact?: boolean
    roundDown?: boolean
  } = {},
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

  let numericAmount = toNumericAmount(amount, tokenDecimals)

  if (roundDown) {
    const factor = 10 ** maximumFractionDigits
    numericAmount = Math.floor(numericAmount * factor) / factor
  }

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
    notation: compact ? 'compact' : 'standard',
    compactDisplay: compact ? 'short' : undefined,
  })

  const formatted = formatter.format(numericAmount)

  return includeSymbol ? `${formatted} SNT` : formatted
}
