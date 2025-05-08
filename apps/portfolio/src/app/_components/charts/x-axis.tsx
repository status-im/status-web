import { cx } from 'class-variance-authority'
import { format } from 'date-fns'
import { match } from 'ts-pattern'

import { checkDateOutput } from './utils'

import type { TimeFrame } from './utils'
import type { ScaleBand, ScaleTime } from 'd3-scale'

type Props = {
  data: { date: string }[]
  initialDate: Date
  marginLeft: number
  xScale: ScaleBand<string> | ScaleTime<number, number>
  activeRange?: TimeFrame
  className?: string
}

const isScaleBand = (
  scale: ScaleBand<string> | ScaleTime<number, number>
): scale is ScaleBand<string> => {
  return 'bandwidth' in scale
}

const XAxis = (props: Props) => {
  const {
    data,
    initialDate,
    marginLeft,
    xScale,
    activeRange = '1M',
    className,
  } = props
  return (
    <div
      className={cx([
        'relative flex h-12 items-center justify-center',
        className,
      ])}
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

        return match(type)
          .with('month', () => (
            <div key={day} className="absolute" style={{ left: xPosition - 8 }}>
              <p className="text-11 font-medium uppercase text-neutral-40">
                {format(new Date(d.date), 'MMM')}
              </p>
            </div>
          ))
          .with('day', () => (
            <div
              key={day}
              className="absolute w-5 text-center"
              style={{ left: xPosition - 6 }}
            >
              <p className="text-11 font-medium text-neutral-40">
                {format(new Date(d.date), 'd')}
              </p>
            </div>
          ))
          .with('hour', () => (
            <div
              key={day}
              className="absolute w-5 text-center"
              style={{ left: xPosition - 6 }}
            >
              <p className="whitespace-nowrap text-11 font-medium text-neutral-40">
                {format(new Date(d.date), 'HH:mm')}
              </p>
            </div>
          ))
          .with('bullet', () => (
            <div key={day} className="absolute" style={{ left: xPosition }}>
              <p className="text-13 font-medium text-neutral-10">•</p>
            </div>
          ))
          .with('empty', () => null)
          .exhaustive()
      })}
    </div>
  )
}

export { XAxis }
