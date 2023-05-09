import { useCallback, useMemo } from 'react'

import { animated, config, useSpring } from '@react-spring/web'
import { Text } from '@status-im/components'
import { DoneIcon, OpenIcon } from '@status-im/icons'
import { Stack } from '@tamagui/core'
import { curveMonotoneX } from '@visx/curve'
import { localPoint } from '@visx/event'
import { GlyphCircle } from '@visx/glyph'
import { LinearGradient } from '@visx/gradient'
import { Group } from '@visx/group'
import { AnimatedAxis, AnimatedGridColumns } from '@visx/react-spring'
import { ParentSize } from '@visx/responsive'
import { scaleLinear, scaleTime } from '@visx/scale'
import { AreaClosed, Line, LinePath } from '@visx/shape'
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip'
import { bisector, extent, max } from 'd3-array'
import { timeFormat } from 'd3-time-format'

import type { EventType } from '@visx/event/lib/types'

const AnimatedLinePath = animated(LinePath)
const AnimatedCircle = animated(GlyphCircle)
const AnimatedLine = animated(Line)
const AnimatedGroup = animated(Group)
const AnimatedTooltip = animated(TooltipWithBounds)
const AnimatedAreaClosed = animated(AreaClosed)

// defining colors
const colors = {
  total: '#E95460',
  closed: '#23ADA0',
  background: '#F0F2F5',
  marker: '#09101C',
  totalGradient: 'rgba(233, 84, 96, 0.3)',
  closedGradient: 'rgba(35, 173, 160, 0.3)',
  white: '#FFF',
}

// defining tooltip styles
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 272,
  padding: 12,
  backgroundColor: '#FFF',
  border: '1px solid #F0F2F5',
  boxShadow: '0px 2px 20px rgba(9, 16, 28, 0.04)',
  borderRadius: 20,
  marginLeft: 40,
}

type Datum = {
  date: Date
  value: number
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

const formatDate = timeFormat('%b %d %Y')
const calculatePercentage = (value: number, total: number): number =>
  Math.round((value / total) * 100)

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
  const totalIssuesData = useMemo(
    () =>
      data.map(d => ({
        date: new Date(d.date),
        value: getTotalIssues(d),
      })),
    [data, getTotalIssues]
  )

  const closedIssuesData = useMemo(
    () =>
      data.map(d => ({
        date: new Date(d.date),
        value: getClosedIssues(d),
      })),
    [data, getClosedIssues]
  )

  // tooltip parameters
  const { tooltipData: tooltip, showTooltip, hideTooltip } = useTooltip()

  const tooltipData = tooltip as DayType & {
    completedIssuesPercentage: number
    openIssuesPercentage: number
    totalIssues: number
    openIssues: number
    closedIssues: number
    formattedDate: string
  }

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

  const [springProps, setSpringProps] = useSpring(() => ({
    totalIssues: 0,
  }))

  const [drawingLineStyle] = useSpring(() => ({
    from: { strokeDasharray: `${3000}, ${0}` },
    to: { strokeDasharray: `${0}, ${3000}` },
    reverse: true,
    config: { duration: 2000, delay: 1000 },
  }))

  const [clipPathAnimation] = useSpring(() => ({
    from: { clipPath: 'inset(0 100% 0 0)' },
    to: { clipPath: 'inset(0 0 0 0)' },
    config: { duration: 600 },
  }))

  // Define tooltip handler
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

      const closedIssues = getClosedIssues(d)
      const totalIssues = getTotalIssues(d)
      const openIssues = totalIssues - closedIssues

      const completedIssuesPercentage = calculatePercentage(
        closedIssues,
        totalIssues
      )

      const openIssuesPercentage = calculatePercentage(openIssues, totalIssues)

      setSpringProps({
        totalIssues,
        from: { totalIssues: springProps.totalIssues },
        config: { tension: 500, friction: 10 },
      })
      // setNum(totalIssues)
      showTooltip({
        tooltipData: {
          ...d,
          formattedDate: formatDate(getDate(d)),
          completedIssuesPercentage,
          openIssuesPercentage,
          closedIssues,
          totalIssues,
          openIssues,
        },
      })
    },
    [
      xScale,
      margin.left,
      bisectDate,
      data,
      getDate,
      getClosedIssues,
      getTotalIssues,
      setSpringProps,
      springProps.totalIssues,
      showTooltip,
    ]
  )

  return (
    <div>
      <svg width={width} height={height} overflow="visible">
        <Group left={margin.left} top={margin.top}>
          {/* x-axis */}
          <AnimatedAxis
            animationTrajectory="outside"
            orientation="bottom"
            top={innerHeight}
            scale={xScale}
            hideTicks
            hideAxisLine
            hideZero
            tickLabelProps={(_, index) => {
              const textAnchor =
                index === 0
                  ? 'start'
                  : index === data.length - 1
                  ? 'end'
                  : 'middle'
              return {
                dx: index === 0 ? '0.5em' : '0',
                dy: '.33em',
                fill: '#A1ABBD',
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                textAnchor,
              }
            }}
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
          <AnimatedAxis
            animationTrajectory="outside"
            orientation="left"
            scale={yScale}
            hideTicks
            hideAxisLine
            numTicks={data.length > 8 ? 8 : data.length}
            tickComponent={({ formattedValue }) => (
              <text
                fill="#A1ABBD"
                fontSize={11}
                textAnchor="middle"
                dx="-1em"
                fontFamily="Inter, sans-serif"
              >
                {formattedValue}
              </text>
            )}
          />

          <AnimatedGridColumns
            scale={xScale}
            height={innerHeight}
            stroke="#F0F2F5"
            strokeDasharray="4,2"
            animationTrajectory="center"
          />

          <LinearGradient
            id="gradient"
            from={colors.total}
            to={colors.background}
            fromOpacity={0.05}
            toOpacity={0}
          />

          <LinearGradient
            id="gradient-open"
            from={colors.closed}
            to={colors.background}
            fromOpacity={0.05}
            toOpacity={0}
          />

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
            curve={curveMonotoneX}
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
            curve={curveMonotoneX}
            style={drawingLineStyle}
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
            curve={curveMonotoneX}
            style={clipPathAnimation}
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
            curve={curveMonotoneX}
            style={clipPathAnimation}
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
          <Stack flexDirection="row" alignItems="center">
            <Text size={19} weight="semibold">
              {springProps.totalIssues.to(val => Math.floor(val)).get()}
            </Text>
            <Stack ml={3} alignItems="center">
              <Text size={15} weight="medium">
                issues
              </Text>
            </Stack>
          </Stack>
          <Stack pb={12}>
            <Text size={13} weight="medium" color="$neutral-50">
              {tooltipData.formattedDate}
            </Text>
          </Stack>

          <Stack
            borderWidth={1}
            borderRadius="$8"
            borderColor="$danger-50-opa-30"
            backgroundColor="$danger-50-opa-10"
          >
            <Stack
              animation="slow"
              height={8}
              backgroundColor="$success-50"
              width={`${tooltipData.completedIssuesPercentage}%`}
              borderRadius="$8"
            />
          </Stack>
          <Stack flexDirection="row" alignItems="center" pt={18}>
            <OpenIcon size={16} color="$neutral-40" />
            <Stack px={4}>
              <Text size={13} weight="medium">
                {tooltipData.openIssues} open
              </Text>
            </Stack>
            <Stack
              backgroundColor="$danger-50-opa-30"
              borderRadius="$20"
              px={6}
              py={2}
              minWidth={36}
              justifyContent="center"
              alignItems="center"
            >
              <Text size={11} weight="medium" color="$danger-50">
                {`${tooltipData.openIssuesPercentage}%`}
              </Text>
            </Stack>
          </Stack>
          <Stack flexDirection="row" alignItems="center" pt={8}>
            <DoneIcon size={16} color="$neutral-40" />
            <Stack px={4}>
              <Text size={13} weight="medium">
                {tooltipData.closedIssues} closes
              </Text>
            </Stack>
            <Stack
              minWidth={36}
              backgroundColor="$success-50-opa-30"
              borderRadius="$20"
              px={6}
              py={2}
              justifyContent="center"
              alignItems="center"
            >
              <Text size={11} weight="medium" color="$success-50">
                {`${tooltipData.completedIssuesPercentage}%`}
              </Text>
            </Stack>
          </Stack>
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
