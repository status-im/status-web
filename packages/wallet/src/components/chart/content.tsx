import { useState } from 'react'

import {
  animated,
  config,
  useIsomorphicLayoutEffect,
  useSpring,
} from '@react-spring/web'
import { curveNatural } from '@visx/curve'
import { LinearGradient } from '@visx/gradient'
import { AreaClosed, LinePath } from '@visx/shape'

import { colors } from './constants'

import type { ScaleLinear, ScaleTime } from 'd3-scale'

type Datum = {
  date: Date
  value: number
}

type Props = {
  yScale: ScaleLinear<number, number, never>
  xScale: ScaleTime<number, number, never>
  innerHeight: number
  innerWidth: number
  numTicksX: number
  pricesData: Datum[]
}

const AnimatedAreaClosed = animated(AreaClosed)
const AnimatedLinePath = animated(LinePath)

const getValueMetrics = (value: number) => {
  const length = value.toString().length

  let xTextOffset = 40
  let xRectOffset = 16
  let rectWidth = 40

  switch (length) {
    case 4:
    case 5:
      rectWidth = 48
      break
    case 6:
      xTextOffset = 38
      xRectOffset = 12
      rectWidth = 52
      break
    case 7:
      xTextOffset = 36
      xRectOffset = 10
      rectWidth = 54
      break
    case 8:
      xTextOffset = 34
      xRectOffset = 4
      rectWidth = 60
      break
    default:
      break
  }

  return { xTextOffset, xRectOffset, rectWidth }
}

const Content = (props: Props) => {
  const { pricesData, xScale, yScale, innerHeight, innerWidth } = props

  const lastData = pricesData[pricesData.length - 1]

  const [animationStyles, api] = useSpring(() => ({}))
  const [lineStyle, apiLine] = useSpring(() => ({}))
  const [dottedLineStyle, apiDotted] = useSpring(() => ({}))

  const [opacity, setOpacity] = useState(0)

  useIsomorphicLayoutEffect(() => {
    api.start({
      from: { clipPath: 'inset(0 100% 0 0)' },
      to: { clipPath: 'inset(0 0 0 0)' },
      config: { ...config.slow },
      delay: 300,
    })
    apiLine.start({
      from: {
        strokeDasharray: '3000, 0',
      },
      to: {
        strokeDasharray: '0, 3000',
      },
      reverse: true,
      config: { ...config.slow, duration: 3000 },
      delay: 300,
    })
    apiDotted.start({
      from: {
        strokeDasharray: '0 0',
      },
      to: {
        strokeDasharray: '0.2 4',
      },
      config: { ...config.slow },
      delay: 300,
    })

    const timeout = setTimeout(() => setOpacity(1), 500)
    return () => clearTimeout(timeout)
  }, [api, apiLine, apiDotted])

  if (!pricesData.length) return null

  return (
    <g
      className="relative transition-opacity ease-in"
      opacity={opacity}
      overflow="hidden"
    >
      <AnimatedAreaClosed
        data={pricesData}
        x={d => {
          const datum = d as Datum
          return xScale(datum.date)
        }}
        y={d => {
          const datum = d as Datum
          return yScale(datum.value)
        }}
        yScale={yScale}
        fill={colors.fill}
        curve={curveNatural}
        style={animationStyles}
      />
      <LinearGradient
        id="gradient-columns"
        from={'rgba(255, 255, 255, 0)'}
        to={'rgba(255, 255, 255, 1)'}
        fromOpacity={0}
        toOpacity={1}
      />
      <rect
        x={0}
        y={0}
        width={innerWidth}
        height={innerHeight}
        fill="url(#gradient-columns)"
      />

      <g transform="scale(1.04, 1)">
        <AnimatedLinePath
          data={pricesData}
          x={d => {
            const datum = d as Datum
            return xScale(datum.date)
          }}
          y={() => {
            // Get last element of the array
            const lastPrice = pricesData[pricesData.length - 1].value
            return yScale(lastPrice)
          }}
          stroke={colors.marker}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          style={dottedLineStyle}
        />
      </g>
      <AnimatedLinePath
        data={pricesData}
        x={d => {
          const datum = d as Datum
          return xScale(datum.date)
        }}
        y={d => {
          const datum = d as Datum
          return yScale(datum.value)
        }}
        stroke={colors.line}
        strokeWidth={2}
        curve={curveNatural}
        shapeRendering="geometricPrecision"
        style={lineStyle}
      />
      {/* Tag of last price value */}
      <rect
        x={xScale(lastData.date) + getValueMetrics(lastData.value).xRectOffset}
        y={yScale(lastData.value) - 10}
        width={getValueMetrics(lastData.value).rectWidth}
        height={20}
        fill={colors.line}
        rx={6}
        ry={6}
      />
      <text
        x={xScale(lastData.date) + getValueMetrics(lastData.value).xTextOffset}
        y={yScale(lastData.value) + 5}
        fill={colors.white}
        fontSize={12}
        textAnchor="middle"
      >
        {lastData.value}
      </text>
    </g>
  )
}

export { Content }
