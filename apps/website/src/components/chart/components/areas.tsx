import { animated } from '@react-spring/web'
import { curveBasis } from '@visx/curve'
import { LinearGradient } from '@visx/gradient'
import { AreaClosed } from '@visx/shape'

import { colors } from './chart-component'

import type { SpringValue } from '@react-spring/web'
import type { ScaleLinear, ScaleTime } from 'd3-scale'

type Datum = {
  date: Date
  value: number
}

type Props = {
  yScale: ScaleLinear<number, number, never>
  xScale: ScaleTime<number, number, never>
  totalIssuesData: Datum[]
  closedIssuesData: Datum[]
  clipPathAnimation: {
    clipPath: SpringValue<string>
  }
}

const AnimatedAreaClosed = animated(AreaClosed)

const Areas = (props: Props) => {
  const {
    clipPathAnimation,
    closedIssuesData,
    totalIssuesData,
    xScale,
    yScale,
  } = props
  return (
    <>
      <LinearGradient
        id="gradient-columns"
        from={'rgba(255, 255, 255, 1)'}
        to={'rgba(255, 255, 255, 0)'}
        fromOpacity={1}
        toOpacity={0}
      />
      <LinearGradient
        id="gradient"
        from={colors.total}
        to={colors.background}
        fromOpacity={0.1}
        toOpacity={0}
      />

      <LinearGradient
        id="gradient-open"
        from={colors.closed}
        to={colors.background}
        fromOpacity={0.1}
        toOpacity={0}
      />

      {/* Total issues area */}
      <AnimatedAreaClosed
        data={totalIssuesData}
        x={d => {
          const datum = d as Datum
          return xScale(datum.date)
        }}
        y={d => {
          const datum = d as Datum
          return yScale(datum.value)
        }}
        yScale={yScale}
        fill="url(#gradient)"
        curve={curveBasis}
        style={{ ...clipPathAnimation, zIndex: 10 }}
      />

      {/* Closed issues area */}
      <AnimatedAreaClosed
        data={closedIssuesData}
        x={d => {
          const datum = d as Datum
          return xScale(datum.date)
        }}
        y={d => {
          const datum = d as Datum
          return yScale(datum.value)
        }}
        yScale={yScale}
        fill="url(#gradient-open)"
        curve={curveBasis}
        style={{ ...clipPathAnimation, zIndex: 10 }}
      />
    </>
  )
}

export { Areas }
