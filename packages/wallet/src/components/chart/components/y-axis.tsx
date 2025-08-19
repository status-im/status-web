import { getSubscriptData, SubscriptNumber } from '../../subscript-notation'
import { currencyFormatter, numberFormatter } from '../utils'

import type { DataType } from '../utils'

type TickData = {
  value: number
  dataType: DataType
}

type Props = {
  ticks: TickData[]
  width: number
}

const YAxis = ({ ticks, width }: Props) => (
  <div className="absolute -bottom-2 left-0 z-10 flex size-full flex-col-reverse items-start justify-between">
    {ticks.map((tick, index) => {
      const subscriptData = getSubscriptData(Math.abs(tick.value))
      const formatter =
        tick.dataType === 'balance' ? numberFormatter : currencyFormatter

      return (
        <div key={index} className="flex w-full items-center justify-start">
          <div
            className="h-px w-full border-t border-dashed border-neutral-10"
            style={{ width }}
          />
          <div className="flex-1 items-end">
            <p className="text-right text-11 font-medium text-neutral-40">
              {subscriptData ? (
                <SubscriptNumber value={tick.value} dataType={tick.dataType} />
              ) : (
                formatter.format(tick.value)
              )}
            </p>
          </div>
        </div>
      )
    })}
  </div>
)

export { YAxis }
