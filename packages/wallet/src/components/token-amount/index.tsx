import { useMemo } from 'react'

import { match } from 'ts-pattern'

import {
  formatSubscriptString,
  getSubscriptData,
  SubscriptNumber,
} from '../subscript-notation'

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

const formatTokenAmount = (
  value: number,
  format: TokenAmountFormat,
  subscriptNotation = false,
) => {
  if (
    format === 'precise' &&
    Math.abs(value) < 0.0001 &&
    value !== 0 &&
    subscriptNotation
  ) {
    const formattedString = formatSubscriptString(value, 'balance')
    if (formattedString) {
      return formattedString
    }
  }

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
  subscriptNotation?: boolean
}

const TokenAmount = (props: Props) => {
  const { value, format, className, subscriptNotation = false } = props

  const formatter = useMemo(() => createTokenAmountFormatter(format), [format])

  if (
    format === 'precise' &&
    Math.abs(value) < 0.0001 &&
    value !== 0 &&
    subscriptNotation
  ) {
    const subscriptData = getSubscriptData(Math.abs(value))
    if (subscriptData) {
      return (
        <div className={className}>
          <SubscriptNumber value={value} dataType="balance" />
        </div>
      )
    }
  }

  return <div className={className}>{formatter.format(value)}</div>
}

export { formatTokenAmount, TokenAmount }
