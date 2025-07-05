import { useMemo } from 'react'

import { match } from 'ts-pattern'

type TokenAmountFormat = 'compact' | 'standard' | 'precise'

const createTokenAmountFormatter = (format: TokenAmountFormat) => {
  return match(format)
    .with(
      'compact',
      () =>
        new Intl.NumberFormat('en-US', {
          style: 'decimal',
          notation: 'compact',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }),
    )
    .with(
      'standard',
      () =>
        new Intl.NumberFormat('en-US', {
          style: 'decimal',
          notation: 'standard',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }),
    )
    .with(
      'precise',
      () =>
        new Intl.NumberFormat('en-US', {
          style: 'decimal',
          notation: 'standard',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
          minimumSignificantDigits: 1,
          maximumSignificantDigits: 4,
          roundingPriority: 'morePrecision',
        }),
    )
    .exhaustive()
}

const formatTokenAmount = (value: number, format: TokenAmountFormat) => {
  return createTokenAmountFormatter(format).format(value)
}

type Props = {
  value: number
  /**
   * Format options for token amount display:
   * - 'compact': Shortened format with K/M/B suffixes, ideal for large amounts (e.g., 1.5K, 2M)
   * - 'standard': Regular format with 2 decimal places (e.g., 1,234.56, 789.00)
   * - 'precise': Higher precision format with 4 significant digits, ideal for very small amounts (e.g., 0.0001234, 0.00006789)
   */
  format: TokenAmountFormat
  className?: string
}

const TokenAmount = (props: Props) => {
  const { value, format, className } = props

  const formatter = useMemo(() => createTokenAmountFormatter(format), [format])

  return <div className={className}>{formatter.format(value)}</div>
}

export { formatTokenAmount, TokenAmount }
