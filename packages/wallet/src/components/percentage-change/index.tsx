import { NegativeIcon, PositiveIcon } from '@status-im/icons/16'

import { CurrencyAmount } from '../currency-amount'

type Props = {
  percentage: number
  className?: string
  variant?: 'default' | 'with-value-difference'
  value?: number
}

export const PercentageChange = ({
  percentage,
  className = '',
  variant = 'default',
  value = 0,
}: Props) => {
  const isZero = percentage === 0
  const isPositive = percentage > 0
  const color = isZero
    ? 'text-neutral-50'
    : isPositive
      ? 'text-success-50'
      : 'text-danger-50'

  if (variant === 'with-value-difference') {
    return (
      <div className={`flex items-center ${color} ${className}`}>
        <span>{percentage.toFixed(2)}%</span>
        <span className="mx-1 size-0.5 shrink-0 rounded-full bg-danger-50/40" />

        <CurrencyAmount value={value} format="standard" />

        {isZero === false && (
          <span className="ml-0.5 size-4" aria-hidden="true">
            {isPositive ? (
              <PositiveIcon className="size-4" />
            ) : (
              <NegativeIcon className="size-4" />
            )}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={`flex items-center ${color} ${className}`}>
      {isZero === false && (
        <span className="mr-1 size-4" aria-hidden="true">
          {isPositive ? (
            <PositiveIcon className="size-4" />
          ) : (
            <NegativeIcon className="size-4" />
          )}
        </span>
      )}
      <span>{Math.abs(percentage).toFixed(2)}%</span>
    </div>
  )
}
