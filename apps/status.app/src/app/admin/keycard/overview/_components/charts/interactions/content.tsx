import { useMemo } from 'react'

import { config, useSpring } from '@react-spring/web'
import { Group } from '@visx/group'
import { scaleLinear, scaleTime } from '@visx/scale'
import { extent, max } from 'd3-array'

import { XAxis } from '~components/charts/x-axis'

import { useInteractionsChartTooltip } from '../hooks/use-interactions-chart-tooltip'
import { YAxis } from '../y-axis'
import { Lines } from './lines'
import { Markers } from './markers'
import { ChartTooltip } from './tooltip'

import type {
  InteractionsTimeFrame,
  InteractionsType,
  VisibleInteractionsType,
} from './chart'

type Props = {
  data: InteractionsType[]
  width?: number
  visibleInteractions: VisibleInteractionsType[]
  activeRange: InteractionsTimeFrame
}
type Ticks = Record<InteractionsTimeFrame, number>

const margin = { top: 0, right: 35, bottom: 0, left: 65 }
const ticks: Ticks = {
  '1M': 31,
  '7D': 7,
  '1Y': 12,
  '2Y': 24,
}

const Chart = (props: Props) => {
  const { width = 300, data, visibleInteractions, activeRange } = props

  const dates = data.map(d => new Date(d.date))
  const initialDate = new Date(dates[0])

  // Dimensions
  const height = 156
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.bottom

  const filteredDates = dates.filter(Boolean)
  const totalDevices = data.map(d => d.databases + d.firmware + d.verifications)

  const xDomain = extent(filteredDates) as [Date, Date]
  const xScale = scaleTime({
    domain: xDomain,
    range: [0, innerWidth],
    nice: false,
  })

  const dateRange = xDomain[1].getTime() - xDomain[0].getTime()

  const maxTicksX = ticks[activeRange]
  const numTicksX = Math.min(
    data.length,
    Math.ceil(dateRange / (24 * 60 * 60 * 1000)),
    maxTicksX
  )

  const yScale = scaleLinear({
    domain: [0, max(totalDevices) || 0],
    range: [
      innerHeight,
      totalDevices.every(device => device === 0) ? innerHeight : 0,
    ],
    nice: true,
  })

  const maxTotalDevices = max(totalDevices) || 0
  const maxTicks = 6

  const tickInterval = Math.ceil(maxTotalDevices / (maxTicks - 1))

  const tickValuesY = Array.from({ length: maxTicks }, (_, i) =>
    Math.min(i * tickInterval, maxTotalDevices)
  )

  const { tooltipData, updateTooltip, hideTooltip, tooltipOpen } =
    useInteractionsChartTooltip({
      data,
      margin,
      dates,
      innerWidth,
      activeRange,
    })

  const circleSpringTotal = useSpring({
    x: xScale(new Date(tooltipData?.date)),
    y: yScale(tooltipData?.totalInteractions),
    config: config.gentle,
  })

  const opacityAnimation = useSpring({
    opacity: data ? 1 : 0,
    config: config.gentle,
    delay: 200,
  })

  const tooltipAnimation = useSpring({
    x: xScale(new Date(tooltipData?.date)),
    y: innerHeight + margin.top + margin.bottom,
    config: config.gentle,
  })

  // Convert data to array of objects with `date` and `value` properties
  const totalInteractions = useMemo(
    () =>
      data.map(d => ({
        date: new Date(d.date),
        value: d.databases + d.firmware + d.verifications,
      })),
    [data]
  )

  const databases = useMemo(
    () =>
      data.map(d => ({
        date: new Date(d.date),
        value: d.databases,
      })),
    [data]
  )

  const firmware = useMemo(
    () =>
      data.map(d => ({
        date: new Date(d.date),
        value: d.firmware,
      })),
    [data]
  )

  const verifications = useMemo(
    () =>
      data.map(d => ({
        date: new Date(d.date),
        value: d.verifications,
      })),
    [data]
  )

  return (
    <>
      <div className="relative mt-8">
        <YAxis tickValuesY={tickValuesY} />
        <svg width={width} height={height} overflow="visible">
          <Group left={margin.left} top={margin.top}>
            <Lines
              visibleInteractions={visibleInteractions}
              total={totalInteractions}
              databases={databases}
              firmware={firmware}
              verifications={verifications}
              xScale={xScale}
              yScale={yScale}
              innerHeight={innerHeight}
              numTicksX={numTicksX}
            />

            {tooltipOpen && (
              <Markers
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
      <XAxis
        data={data}
        initialDate={initialDate}
        marginLeft={margin.left - 4}
        xScale={xScale}
        activeRange={activeRange}
      />
    </>
  )
}

export { Chart }
