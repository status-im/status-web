'use client'

import { ParentSize } from '@visx/responsive'

import { ChartLoading, TokenChart } from './components'

import type { DataType, TimeFrame } from './utils'
import type { ApiOutput } from '@status-im/wallet/data'

type ChartProps = {
  price:
    | ApiOutput['assets']['nativeTokenPriceChart']
    | ApiOutput['assets']['tokenPriceChart']
  balance: ApiOutput['assets']['tokenBalanceChart']
  activeTimeFrame: TimeFrame
  activeDataType: DataType
}

const Chart = ({
  price,
  balance,
  activeTimeFrame,
  activeDataType,
}: ChartProps) => {
  const currency = 'USD'

  return (
    <div className="relative">
      <ParentSize className="w-full bg-transparent">
        {({ width }) => (
          <TokenChart
            data={activeDataType === 'price' ? price : balance}
            width={width}
            currency={currency}
            timeFrame={activeTimeFrame}
            dataType={activeDataType}
          />
        )}
      </ParentSize>
    </div>
  )
}

export { Chart, ChartLoading }
export type { DataType as ChartDataType, TimeFrame as ChartTimeFrame }
export { DEFAULT_DATA_TYPE, DEFAULT_TIME_FRAME, TIME_FRAMES } from './utils'
