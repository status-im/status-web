import { animated, config, useSpring } from '@react-spring/web'
import { curveCatmullRom } from '@visx/curve'
import { AreaClosed, LinePath } from '@visx/shape'

import { negativeColors, positiveColors } from '../constants'
import { formatSmallNumber } from '../utils'

import type { BaseChartProps, ChartDatum } from '../utils'
import type { ScaleLinear, ScaleTime } from 'd3-scale'

type Props = BaseChartProps & {
  yScale: ScaleLinear<number, number, never>
  xScale: ScaleTime<number, number, never>
  pricesData: ChartDatum[]
}

const AnimatedAreaClosed = animated(AreaClosed)
const AnimatedLinePath = animated(LinePath)

const Content = (props: Props) => {
  const { pricesData, xScale, yScale, isPositive = true } = props

  const colors = isPositive ? positiveColors : negativeColors
  const lastData = pricesData[pricesData.length - 1]

  const animation = useSpring({
    from: { opacity: 0, progress: 0 },
    to: { opacity: 1, progress: 1 },
    config: config.gentle,
  })

  if (!pricesData.length) return null

  const tagX = xScale(lastData.date)
  const tagY = yScale(lastData.value)
  const formattedValue = formatSmallNumber(lastData.value)
  const tagWidth = Math.min(40 + formattedValue.length * 4, 80)

  return (
    <g>
      <AnimatedAreaClosed
        data={pricesData}
        x={d => xScale((d as ChartDatum).date)}
        y={d => yScale((d as ChartDatum).value)}
        yScale={yScale}
        fill={colors.fill}
        curve={curveCatmullRom}
        style={{
          opacity: animation.opacity,
          clipPath: animation.progress.to(
            p => `inset(0 ${100 - p * 100}% 0 0)`,
          ),
        }}
      />

      <AnimatedLinePath
        data={pricesData}
        x={d => xScale((d as ChartDatum).date)}
        y={() => yScale(lastData.value)}
        stroke={colors.marker}
        strokeWidth={2}
        strokeDasharray="0.2 4"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ opacity: animation.opacity }}
      />

      <AnimatedLinePath
        data={pricesData}
        x={d => xScale((d as ChartDatum).date)}
        y={d => yScale((d as ChartDatum).value)}
        stroke={colors.line}
        strokeWidth={2}
        curve={curveCatmullRom}
        shapeRendering="geometricPrecision"
        style={{
          strokeDasharray: animation.progress.to(
            p => `${p * 3000}, ${3000 - p * 3000}`,
          ),
        }}
      />

      <g transform={`translate(${tagX}, ${tagY})`}>
        <rect
          x={20 - tagWidth / 2}
          y={-10}
          width={tagWidth}
          height={20}
          fill={colors.line}
          rx={6}
        />
        <text
          x={20}
          y={5}
          fill={colors.white}
          fontSize={12}
          textAnchor="middle"
        >
          {formattedValue}
        </text>
      </g>
    </g>
  )
}

export { Content }
