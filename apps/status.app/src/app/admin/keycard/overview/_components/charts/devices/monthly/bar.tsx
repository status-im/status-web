import {
  animated,
  config,
  useIsomorphicLayoutEffect,
  useSpring,
} from '@react-spring/web'

import { colors } from '../chart'

import type { MonthlyDeviceType } from '../chart'
import type { ScaleLinear } from 'd3-scale'

type BarProps = {
  d: MonthlyDeviceType
  verifiedDevices: number
  barWidth: number
  adjustedBarWidth: number
  adjustedX: number
  x: number
  yMax: number
  yScale: ScaleLinear<number, number, never>
  updateTooltip: (
    event: React.MouseEvent<SVGRectElement, MouseEvent>,
    {
      x,
      barWidth,
      d,
    }: {
      x: number
      barWidth: number
      d: MonthlyDeviceType
    }
  ) => void
  hideTooltip: () => void
}

const AnimatedBar = ({
  verifiedDevices,
  barWidth,
  x,
  yMax,
  yScale,
  d,
  hideTooltip,
  updateTooltip,
  adjustedBarWidth,
  adjustedX,
}: BarProps) => {
  const barHeight = yMax - (yScale(verifiedDevices) ?? 0)
  const offset = 20
  const y = yMax - barHeight - offset

  const [springs, api] = useSpring(
    () => ({
      y: 0,
      opacity: 0,
    }),
    []
  )

  useIsomorphicLayoutEffect(() => {
    api.start({
      from: {
        y: yMax,
        opacity: 0,
      },
      to: {
        y: yMax - barHeight - y - offset,
        opacity: 1,
      },
      config: { ...config.slow },
    })
  }, [y])

  return (
    <>
      <animated.rect
        key={`bar-${d.date}`}
        x={x}
        y={y}
        width={barWidth}
        height={barHeight + offset}
        fill={colors.line}
        rx={4}
        style={springs}
      />
      {/* This will take care of mouse events only */}
      <rect
        x={adjustedX}
        y={y}
        width={adjustedBarWidth}
        height={barHeight + offset}
        fill="transparent"
        onMouseMove={event => {
          updateTooltip(event, {
            x,
            barWidth,
            d,
          })
        }}
        onMouseLeave={hideTooltip}
        className="cursor-pointer"
      />
    </>
  )
}

export { AnimatedBar }
