import { useMemo } from 'react'

import { match } from 'ts-pattern'

type Props = {
  value: number
  /**
   * Format options for currency display:
   * - 'compact': Shortened format with K/M/B suffixes, ideal for large amounts (e.g., $1.5K, €2M)
   * - 'standard': Regular currency format with 2 decimal places (e.g., $1,234.56, €789.00)
   * - 'precise': Higher precision format with 4 significant digits, ideal for very small amounts (e.g., $0.0001234, €0.00006789)
   */
  format: 'compact' | 'standard' | 'precise'
  className?: string
}

// TODO: get this from the user's settings
const SYMBOL: 'EUR' | 'USD' = 'USD'
const MIN_VALUE = 0.01

export const CurrencyAmount = (props: Props) => {
  const { value, format = 'standard', className } = props

  const formatter = useMemo(
    () =>
      match(format)
        .with(
          'compact',
          () =>
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: SYMBOL,
              notation: 'compact',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }),
        )
        .with(
          'standard',
          () =>
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: SYMBOL,
              notation: 'standard',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
        )
        .with(
          'precise',
          () =>
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: SYMBOL,
              notation: 'standard',
              minimumSignificantDigits: 4,
              maximumSignificantDigits: 4,
              roundingPriority: 'morePrecision',
            }),
        )
        .exhaustive(),
    [format],
  )

  if (value > 0 && value < MIN_VALUE && format !== 'precise') {
    return <div className={className}>{'< ' + formatter.format(MIN_VALUE)}</div>
  }

  return <div className={className}>{formatter.format(value)}</div>
}
