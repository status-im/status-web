import { cx } from 'class-variance-authority'
import { format } from 'date-fns'
import { match } from 'ts-pattern'

import { checkDateOutput } from '../utils'

import type { TimeFrame } from '../utils'
import type { ScaleBand, ScaleTime } from 'd3-scale'

type Props = {
  data: { date: string }[]
  initialDate: Date
  marginLeft: number
  xScale: ScaleBand<string> | ScaleTime<number, number>
  activeRange?: TimeFrame
  className?: string
  availableWidth?: number
}

const isScaleBand = (
  scale: ScaleBand<string> | ScaleTime<number, number>,
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
    availableWidth = 300,
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
        const xPosition = isScaleBand(xScale)
          ? xScale(day) || 0
          : xScale(new Date(day)) || 0

        const previousDate = index > 0 ? new Date(data[index - 1].date) : null

        const type = checkDateOutput({
          date: new Date(d.date),
          previousDate,
          firstDate: initialDate,
          index,
          variant: activeRange,
          totalDataPoints: data.length,
          availableWidth,
        })

        return match(type)
          .with('month', () => (
            <div
              key={day}
              className="absolute text-center"
              style={{
                left: Math.max(
                  0,
                  Math.min(xPosition - 25, availableWidth - 50),
                ),
                width: 50,
              }}
            >
              <p className="text-11 font-medium uppercase text-neutral-40">
                {activeRange === '7D'
                  ? format(new Date(d.date), 'MMM d')
                  : // : activeRange === 'All' &&
                    previousDate &&
                      new Date(d.date).getFullYear() !==
                        previousDate.getFullYear()
                    ? format(new Date(d.date), 'yyyy')
                    : format(new Date(d.date), 'MMM')}
              </p>
            </div>
          ))
          .with('day', () => (
            <div
              key={day}
              className="absolute text-center"
              style={{
                left: Math.max(
                  0,
                  Math.min(xPosition - 12, availableWidth - 24),
                ),
                width: 24,
              }}
            >
              <p className="text-11 font-medium text-neutral-40">
                {format(new Date(d.date), 'd')}
              </p>
            </div>
          ))
          .with('hour', () => (
            <div
              key={day}
              className="absolute text-center"
              style={{
                left: Math.max(
                  0,
                  Math.min(xPosition - 25, availableWidth - 50),
                ),
                width: 50,
              }}
            >
              <p className="whitespace-nowrap text-11 font-medium text-neutral-40">
                {format(new Date(d.date), 'HH:mm')}
              </p>
            </div>
          ))
          .with('bullet', () => (
            <div
              key={day}
              className="absolute"
              style={{
                left: Math.max(0, Math.min(xPosition - 2, availableWidth - 4)),
              }}
            >
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
