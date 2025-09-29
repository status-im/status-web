import { format } from 'date-fns'

import { checkDateOutput } from './utils'

import type { ScaleBand, ScaleTime } from 'd3-scale'

type Props = {
  data: { date: string }[]
  initialDate: Date
  marginLeft: number
  xScale: ScaleBand<string> | ScaleTime<number, number>
  activeRange?: 'month' | 'week' | 'year' | '2years'
}

const isScaleBand = (
  scale: ScaleBand<string> | ScaleTime<number, number>
): scale is ScaleBand<string> => {
  return 'bandwidth' in scale
}

const XAxis = (props: Props) => {
  const { data, initialDate, marginLeft, xScale, activeRange = 'month' } = props
  return (
    <div
      className="relative flex h-12 items-center justify-center"
      style={{
        transform: `translateX(${marginLeft}px)`,
      }}
    >
      {data.map((d, index) => {
        const day = d.date
        // Check if the xScale is a time scale or a band scale
        const xPosition = isScaleBand(xScale)
          ? xScale(day) || 0
          : xScale(new Date(day)) || 0

        const type = checkDateOutput({
          date: new Date(d.date),
          firstDate: initialDate,
          index,
          variant: activeRange,
        })

        if (type === 'month') {
          return (
            <div key={day} className="absolute" style={{ left: xPosition - 8 }}>
              <p className="text-11 font-medium uppercase text-neutral-40">
                {format(new Date(d.date), 'MMM')}
              </p>
            </div>
          )
        } else if (type === 'day') {
          return (
            <div
              key={day}
              className="absolute w-5 text-center"
              style={{ left: xPosition - 6 }}
            >
              <p className="text-11 font-medium text-neutral-40">
                {format(new Date(d.date), 'd')}
              </p>
            </div>
          )
        }

        return (
          <div key={day} className="absolute" style={{ left: xPosition }}>
            <p className="text-13 font-medium text-neutral-10">•</p>
          </div>
        )
      })}
    </div>
  )
}

export { XAxis }
