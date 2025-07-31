'use client'

import { ParentSize } from '@visx/responsive'
import { match } from 'ts-pattern'

import { EmptyState } from '../empty-state'
import { ChartLoading, TokenChart } from './components'

import type { DataType, TimeFrame } from './utils'
import type { ApiOutput } from '@status-im/wallet/data'

type ChartProps = {
  price:
    | ApiOutput['assets']['nativeTokenPriceChart']
    | ApiOutput['assets']['tokenPriceChart']
  balance: ApiOutput['assets']['tokenBalanceChart']
  value: { date: string; price: number }[]
  activeTimeFrame: TimeFrame
  activeDataType: DataType
}

const Chart = ({
  price,
  balance,
  value,
  activeTimeFrame,
  activeDataType,
}: ChartProps) => {
  const currency = 'USD'

  return (
    <div className="relative">
      <ParentSize className="w-full bg-transparent">
        {({ width }) => {
          const data = match(activeDataType)
            .with('balance', () => balance)
            .with('value', () => value)
            .with('price', () => price)
            .exhaustive()

          return (
            <TokenChart
              data={data}
              width={width}
              currency={currency}
              timeFrame={activeTimeFrame}
              dataType={activeDataType}
              emptyState={<EmptyState variant={activeDataType} />}
            />
          )
        }}
      </ParentSize>
    </div>
  )
}

export { Chart, ChartLoading }
export type { DataType as ChartDataType, TimeFrame as ChartTimeFrame }
export { DEFAULT_DATA_TYPE, DEFAULT_TIME_FRAME, TIME_FRAMES } from './utils'
