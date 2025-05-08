import { PercentageChange } from '@status-im/wallet/components'
import { cva } from 'class-variance-authority'

import { CurrencyAmount } from './currency-amount'

import type { ApiOutput } from '@status-im/wallet/data'

type Props = {
  variant?: 'token'
  summary:
    | ApiOutput['assets']['all']['summary']
    | ApiOutput['assets']['token']['summary']
}

const textColor = cva('text-13 font-medium', {
  variants: {
    trend: {
      positive: 'text-success-50',
      negative: 'text-danger-50',
      neutral: 'text-neutral-50',
    },
  },
})

export const Balance = (props: Props) => {
  const { variant, summary } = props

  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <CurrencyAmount
          value={summary.total_eur}
          className="text-27 font-semibold text-neutral-100"
          format="standard"
        />

        {variant === 'token' && (
          <div className="self-end text-15 font-medium text-neutral-50">
            {summary.total_balance}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1">
          <PercentageChange
            percentage={summary.total_percentage_24h_change}
            className={textColor({
              trend:
                (summary.total_percentage_24h_change > 0 && 'positive') ||
                (summary.total_percentage_24h_change < 0 && 'negative') ||
                'neutral',
            })}
          />
          <div className="size-0.5 rounded-full bg-neutral-40" aria-hidden />
          <CurrencyAmount
            value={summary.total_eur_24h_change}
            format="standard"
            className={textColor({
              trend:
                (summary.total_eur_24h_change > 0 && 'positive') ||
                (summary.total_eur_24h_change < 0 && 'negative') ||
                'neutral',
            })}
          />
        </div>

        <div className="text-13 font-medium text-neutral-40">24h</div>
      </div>
    </div>
  )
}
