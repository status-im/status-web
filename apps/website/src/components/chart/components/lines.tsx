import { animated } from '@react-spring/web'
import { curveBasis } from '@visx/curve'
import { LinePath } from '@visx/shape'

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
  drawingLineStyle: {
    strokeDasharray: SpringValue<string>
  }
}

const AnimatedLinePath = animated(LinePath)

const Lines = (props: Props) => {
  const {
    closedIssuesData,
    drawingLineStyle,
    xScale,
    yScale,
    totalIssuesData,
  } = props
  return (
    <>
      {/* Total issues line */}
      <AnimatedLinePath
        data={totalIssuesData}
        x={d => {
          const datum = d as Datum
          return xScale(datum.date)
        }}
        y={d => {
          const datum = d as Datum
          return yScale(datum.value)
        }}
        stroke={colors.total}
        strokeWidth={2}
        curve={curveBasis}
        style={drawingLineStyle}
      />

      {/* Closed issues line */}
      <AnimatedLinePath
        data={closedIssuesData}
        x={d => {
          const datum = d as Datum
          return xScale(datum.date)
        }}
        y={d => {
          const datum = d as Datum
          return yScale(datum.value)
        }}
        stroke={colors.closed}
        strokeWidth={2}
        curve={curveBasis}
        style={drawingLineStyle}
      />
    </>
  )
}
export { Lines }
