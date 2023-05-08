import { useCallback } from 'react'

import { animated, config, useSpring } from '@react-spring/web'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { curveMonotoneX } from '@visx/curve'
import { localPoint } from '@visx/event'
import { GlyphCircle } from '@visx/glyph'
import { LinearGradient } from '@visx/gradient'
import { GridColumns } from '@visx/grid'
import { Group } from '@visx/group'
import { ParentSize } from '@visx/responsive'
import { scaleLinear, scaleTime } from '@visx/scale'
import { AreaClosed, Line, LinePath } from '@visx/shape'
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip'
import { bisector, extent, max } from 'd3-array'
import { timeFormat } from 'd3-time-format'

import type { EventType } from '@visx/event/lib/types'

const AnimatedCircle = animated(GlyphCircle)

const AnimatedLine = animated(Line)
const AnimatedGroup = animated(Group)
const AnimatedTooltip = animated(TooltipWithBounds)

const colors = {
  total: '#E95460',
  closed: '#23ADA0',
  background: '#F0F2F5',
  marker: '#09101C',
}

// defining tooltip styles
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: colors.background,
  marginLeft: 60,
}

type DayType = {
  date: string
  open_issues: number
  closed_issues: number
}

interface Props {
  data: DayType[]
  width?: number
  height?: number
}

const ChartComponent = (props: Props): JSX.Element => {
  const { data, width: defaultWidth, height: defaultHeight } = props

  // Extract dates, open issues, and closed issues from data
  const dates = data.map(d => new Date(d.date))

  // Calculate total issues by summing open and closed issues
  const totalIssues = data.map(d => d.open_issues + d.closed_issues)

  // Define dimensions
  const height = defaultHeight || 300
  const width = defaultWidth || 300
  const margin = { top: 20, right: 0, bottom: 30, left: 26 }
  const innerWidth = (width || 0) - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  // Define x and y scales
  const xScale = scaleTime({
    domain: extent(dates) as [Date, Date],
    range: [0, innerWidth],
  })

  const yScale = scaleLinear({
    domain: [0, max(totalIssues) || 0],
    range: [innerHeight, 0],
    nice: true,
  })

  // Defining selector functions
  const getTotalIssues = useCallback(
    (d: DayType) => d?.open_issues + d?.closed_issues,
    []
  )
  const getClosedIssues = useCallback((d: DayType) => d?.closed_issues, [])
  const getDate = useCallback((d: DayType) => new Date(d?.date), [])
  const bisectDate = bisector((d: DayType) => new Date(d?.date)).left
  // Convert data to array of objects with `date` and `value` properties
  const totalIssuesData = data.map(d => ({
    date: new Date(d.date),
    value: getTotalIssues(d),
  }))

  const closedIssuesData = data.map(d => ({
    date: new Date(d.date),
    value: getClosedIssues(d),
  }))

  // tooltip parameters
  const { tooltipData: tooltip, showTooltip, hideTooltip } = useTooltip()

  const tooltipData = tooltip as DayType

  // Define spring for circle position
  const circleSpringTotal = useSpring({
    x: xScale(new Date(tooltipData?.date)),
    y: yScale(getTotalIssues(tooltipData)),
    config: config.gentle,
  })

  const circleSpringClosed = useSpring({
    x: xScale(new Date(tooltipData?.date)),
    y: yScale(getClosedIssues(tooltipData)),
    config: config.gentle,
  })

  const opacityAnimation = useSpring({
    opacity: tooltipData ? 1 : 0,
    config: config.gentle,
    delay: 200,
  })

  const tooltipAnimation = useSpring({
    x: xScale(new Date(tooltipData?.date)),
    y: innerHeight + margin.top + margin.bottom,
    config: config.gentle,
  })

  const handleTooltip = useCallback(
    (event: EventType) => {
      const { x } = localPoint(event) || { x: 0 }
      const x0 = xScale.invert(x - margin.left)

      const index = bisectDate(data, x0, 1)
      const d0 = data[index - 1]
      const d1 = data[index]
      let d = d0

      if (d1 && getDate(d1)) {
        d =
          x0.valueOf() - getDate(d0).valueOf() >
          getDate(d1).valueOf() - x0.valueOf()
            ? d1
            : d0
      }

      showTooltip({
        tooltipData: d,
      })
    },
    [xScale, margin.left, bisectDate, data, getDate, showTooltip]
  )

  return (
    <div>
      <svg width={width} height={height} overflow="visible">
        <Group left={margin.left} top={margin.top}>
          {/* x-axis */}
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            hideTicks
            hideAxisLine
            hideZero
            tickValues={xScale.ticks(8)}
            tickComponent={({ formattedValue, ...tickProps }) => (
              <text
                {...tickProps}
                fill="#A1ABBD"
                fontSize={11}
                textAnchor="middle"
                dy=".33em"
              >
                {formattedValue}
              </text>
            )}
            tickFormat={value => {
              if (typeof value === 'number') {
                return value.toString() // Handle number values
              } else if (value instanceof Date) {
                const format = timeFormat('%d %b') // Specify the desired date format
                return format(value) // Handle date values
              } else {
                return ''
              }
            }}
          />
          {/* y-axis */}
          <AxisLeft
            scale={yScale}
            hideTicks
            hideAxisLine
            tickComponent={({ formattedValue, ...tickProps }) => (
              <text
                {...tickProps}
                fill="#A1ABBD"
                fontSize={11}
                textAnchor="middle"
                dx="-1em"
              >
                {formattedValue}
              </text>
            )}
          />

          <GridColumns
            scale={xScale}
            numTicks={data.length}
            width={innerWidth}
            height={innerHeight}
            stroke="#F0F2F5"
            strokeOpacity={1}
            strokeDasharray="4,2"
          />

          <LinearGradient
            id="gradient"
            from={colors.total}
            to={colors.background}
            fromOpacity={0.8}
            toOpacity={0}
          />

          <LinearGradient
            id="gradient-open"
            from={colors.closed}
            to={colors.background}
            fromOpacity={0.8}
            toOpacity={0}
          />

          {/* Total issues line */}
          <LinePath
            data={totalIssuesData}
            x={d => xScale(d.date)}
            y={d => yScale(d.value)}
            stroke={colors.total}
            strokeWidth={2}
            curve={curveMonotoneX}
          />

          {/* Closed issues line */}
          <LinePath
            data={closedIssuesData}
            x={d => xScale(d.date)}
            y={d => yScale(d.value)}
            stroke={colors.closed}
            strokeWidth={2}
            curve={curveMonotoneX}
          />

          {/* Total issues area */}
          <AreaClosed
            data={totalIssuesData}
            x={d => xScale(d.date)}
            y={d => yScale(d.value)}
            yScale={yScale}
            fill="url(#gradient)"
            curve={curveMonotoneX}
          />

          {/* Closed issues area */}
          <AreaClosed
            data={closedIssuesData}
            x={d => xScale(d.date)}
            y={d => yScale(d.value)}
            yScale={yScale}
            fill="url(#gradient-open)"
            curve={curveMonotoneX}
          />
          {tooltipData && (
            <>
              <AnimatedGroup
                top={0}
                left={circleSpringTotal.x}
                opacity={opacityAnimation.opacity}
              >
                <AnimatedLine
                  from={{ x: 0, y: innerHeight }}
                  to={{ x: 0, y: 0 }}
                  stroke={colors.marker}
                  strokeWidth={1}
                  pointerEvents="none"
                />
              </AnimatedGroup>
              <AnimatedCircle
                size={90}
                top={circleSpringTotal.y}
                left={circleSpringTotal.x}
                strokeWidth={1}
                stroke={colors.background}
                fill={colors.marker}
                opacity={opacityAnimation.opacity}
              />
              <AnimatedCircle
                size={90}
                top={circleSpringClosed.y}
                left={circleSpringClosed.x}
                strokeWidth={1}
                stroke={colors.background}
                fill={colors.marker}
                opacity={opacityAnimation.opacity}
              />
            </>
          )}
          <rect
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            onTouchStart={handleTooltip}
            fill={'transparent'}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
        </Group>
      </svg>
      {/* render a tooltip */}
      {tooltipData ? (
        <AnimatedTooltip
          top={tooltipAnimation.y}
          left={circleSpringClosed.x}
          style={{ ...tooltipStyles, opacity: opacityAnimation.opacity }}
          className="rounded-2xl"
        >
          <p>{`Total Issues: ${getTotalIssues(tooltipData)}`}</p>
          <p>{`Closed Issues: ${getClosedIssues(tooltipData)}`}</p>
          <p>{`${tooltipData.date}`}</p>
        </AnimatedTooltip>
      ) : null}
    </div>
  )
}
const Chart = (props: Props) => {
  const { width, ...rest } = props
  return (
    <ParentSize style={{ maxHeight: 326 }}>
      {({ width: w }) => {
        return <ChartComponent {...rest} width={width || w} />
      }}
    </ParentSize>
  )
}

export { Chart }
export type { Props as ChartProps }
