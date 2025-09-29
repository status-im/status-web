import { useMemo } from 'react'

import { animated } from '@react-spring/web'
import { Axis } from '@visx/axis'
import { GridColumns } from '@visx/grid'
import { Group } from '@visx/group'
import { scaleLinear, scaleTime } from '@visx/scale'
import { extent, max } from 'd3-array'

import { getClosedIssues, getTotalIssues } from '../helpers/get-data'
import { useAnimations, useChartTooltip } from '../hooks'
import { format } from '../utils/format-time'
import { Areas } from './areas'
import { ChartTooltip } from './chart-tooltip'
import { Lines } from './lines'
import { Markers } from './markers'

import type { DayType } from '..'

// defining colors
export const colors = {
  total: '#E95460',
  closed: '#23ADA0',
  background: '#F0F2F5',
  marker: '#09101C',
  totalGradient: 'rgba(233, 84, 96, 0.3)',
  closedGradient: 'rgba(35, 173, 160, 0.3)',
  white: '#FFF',
} as const

interface Props {
  data: DayType[]
  height?: number
  width?: number
}

const AnimatedGridColumns = animated(GridColumns)

const ChartComponent = (props: Props) => {
  const { data, width: defaultWidth, height: defaultHeight } = props

  // Extract dates, open issues, and closed issues from data
  const dates = data.map(d => new Date(d.date))

  // Define dimensions
  const height = defaultHeight || 300
  const width = defaultWidth || 300
  const margin = { top: 20, right: 0, bottom: 30, left: 26 }
  const innerWidth = (width || 0) - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const filteredDates = dates.filter(Boolean) // filters out undefined values
  // Calculate total issues by summing open and closed issues
  const totalIssues = data.map(d => d.open_issues + d.closed_issues)

  const xDomain = extent(filteredDates) as [Date, Date]
  const xScale = scaleTime({
    domain: xDomain,
    range: [0, innerWidth],
    nice: false,
  })

  // Calculate the date range based on the available data
  const dateRange = xDomain[1].getTime() - xDomain[0].getTime()

  // Calculate the number of desired ticks based on the date range and a maximum value (e.g., 6)
  const maxTicksX = 6
  const numTicksX = Math.min(
    data.length,
    Math.ceil(dateRange / (24 * 60 * 60 * 1000)),
    maxTicksX
  )

  const yScale = scaleLinear({
    domain: [0, max(totalIssues) || 0],
    range: [
      innerHeight,
      totalIssues.every(issue => issue === 0) ? innerHeight : 0,
    ], // Adjusted the range to start from innerHeight instead of 0
    nice: true,
  })

  const maxTotalIssues = max(totalIssues) || 0
  const maxTicks = 6

  // Calculate the interval between ticks, rounding up to the nearest integer
  const tickInterval = Math.ceil(maxTotalIssues / (maxTicks - 1))

  // Generate the tick values array, ensuring that the last tick is the maximum value
  const tickValuesY = Array.from({ length: maxTicks }, (_, i) =>
    Math.min(i * tickInterval, maxTotalIssues)
  )

  const { tooltipData, updateTooltip, hideTooltip, tooltipOpen } =
    useChartTooltip({
      data,
      margin,
      dates,
      innerWidth,
    })

  const {
    circleSpringClosed,
    circleSpringTotal,
    clipPathAnimation,
    drawingGridColumns,
    drawingLineStyle,
    opacityAnimation,
    tooltipAnimation,
  } = useAnimations({
    data,
    margin,
    innerHeight,
    tooltipData,
    yScale,
    xScale,
  })

  // Convert data to array of objects with `date` and `value` properties
  const totalIssuesData = useMemo(
    () =>
      data.map(d => ({
        date: new Date(d.date),
        value: getTotalIssues(d),
      })),
    [data]
  )

  const closedIssuesData = useMemo(
    () =>
      data.map(d => ({
        date: new Date(d.date),
        value: getClosedIssues(d),
      })),
    [data]
  )

  return (
    <div>
      <svg width={width} height={height} overflow="visible">
        <Group left={margin.left} top={margin.top}>
          {/* x-axis */}
          <Axis
            top={innerHeight}
            scale={xScale}
            hideTicks
            hideAxisLine
            hideZero
            numTicks={numTicksX}
            tickLabelProps={(_, index) => {
              const textAnchor =
                index === 0
                  ? 'start'
                  : index === data.length - 1
                    ? 'end'
                    : 'middle'
              return {
                dy: '.33em',
                fill: '#A1ABBD',
                fontSize: 11,
                textAnchor,
              }
            }}
            tickFormat={value => {
              if (typeof value === 'number') {
                return value.toString() // Handle number values
              } else if (value instanceof Date) {
                // Specify the desired date format
                return format(value) // Handle date values
              } else {
                return ''
              }
            }}
          />
          {/* y-axis */}
          <Axis
            orientation="left"
            scale={yScale}
            hideTicks
            hideAxisLine
            tickValues={tickValuesY}
            tickFormat={value => Math.round(value as number).toString()}
            tickComponent={({ formattedValue, ...tickProps }) => (
              <text
                {...tickProps}
                fill="#A1ABBD"
                fontSize={11}
                textAnchor="middle"
                dx="-1em"
                dy="-1em"
              >
                {formattedValue}
              </text>
            )}
          />

          <AnimatedGridColumns
            scale={xScale}
            height={innerHeight}
            style={drawingGridColumns}
            numTicks={numTicksX}
          />
          <rect
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            fill="url(#gradient-columns)"
          />

          <Lines
            closedIssuesData={closedIssuesData}
            drawingLineStyle={drawingLineStyle}
            totalIssuesData={totalIssuesData}
            xScale={xScale}
            yScale={yScale}
          />

          <Areas
            clipPathAnimation={clipPathAnimation}
            closedIssuesData={closedIssuesData}
            totalIssuesData={totalIssuesData}
            xScale={xScale}
            yScale={yScale}
          />
          {tooltipOpen && (
            <Markers
              circleSpringClosed={circleSpringClosed}
              circleSpringTotal={circleSpringTotal}
              innerHeight={innerHeight}
              opacityAnimation={opacityAnimation}
            />
          )}
          <rect
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            onTouchStart={updateTooltip}
            fill="transparent"
            onTouchMove={updateTooltip}
            onMouseMove={updateTooltip}
            onMouseLeave={() => hideTooltip()}
          />
        </Group>
      </svg>
      {/* render a tooltip */}
      {tooltipOpen && (
        <ChartTooltip
          tooltipAnimation={tooltipAnimation}
          opacityAnimation={opacityAnimation}
          tooltipData={tooltipData}
        />
      )}
    </div>
  )
}

export { ChartComponent }
