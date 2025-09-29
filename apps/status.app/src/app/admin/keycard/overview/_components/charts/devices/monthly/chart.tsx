import { useMemo } from 'react'

import { config, useSpring } from '@react-spring/web'
import { Group } from '@visx/group'
import { scaleBand, scaleLinear } from '@visx/scale'
import { max } from 'd3-array'

import { XAxis } from '~components/charts/x-axis'

import { useMonthlyChartTooltip } from '../../hooks/use-monthly-chart-tooltip'
import { Legend } from '../../legend'
import { YAxis } from '../../y-axis'
import { type MonthlyDeviceType } from '../chart'
import { AnimatedBar } from './bar'
import { MonthlyTooltip } from './tooltip'

type Props = {
  data: MonthlyDeviceType[]
  width?: number
  height?: number
}

const margin = {
  top: 22,
  left: 53,
}

const MonthlyChart = (props: Props) => {
  const { data, width: defaultWidth, height: defaultHeight } = props

  const width = (defaultWidth || 300) - margin.left
  const height = defaultHeight || 172

  // bounds
  const xMax = width
  const yMax = height - margin.top

  const dates = data.map(d => new Date(d.date))
  const initialDate = new Date(dates[0])
  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: data.map(d => d.date),
      }),
    [data, xMax]
  )

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...data.map(d => d.verified_devices))],
      }),
    [data, yMax]
  )

  const totalDevices = data.map(d => d.verified_devices)
  const maxTotalDevices = max(totalDevices) || 0
  const maxTicks = 6
  const tickInterval = Math.ceil(maxTotalDevices / (maxTicks - 1))
  const tickValuesY = Array.from({ length: maxTicks }, (_, i) =>
    Math.min(i * tickInterval, maxTotalDevices)
  )

  const {
    updateTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft,
    tooltipTop,
  } = useMonthlyChartTooltip()

  const opacityAnimation = useSpring({
    opacity: 1,
    config: config.gentle,
    delay: 200,
  })

  return (
    <div className="relative mt-4">
      <div>
        <div className="relative flex">
          <YAxis tickValuesY={tickValuesY} />
          <svg
            width={width}
            height={height}
            style={{
              transform: `translateX(${margin.left}px)`,
            }}
          >
            <Group
              style={{
                transform: `translateY(${margin.top}px)`,
              }}
            >
              {data.map(d => {
                const barWidth = 8
                const barX = xScale(d.date.toString()) || 0
                // Assuming the gap is dynamically determined by scaleBand's output to control mouse events to improve UX
                const gap = xScale.step() - barWidth // Calculate the actual gap based on scaleBand's step
                const adjustedBarWidth = barWidth + gap // Increase barWidth to cover half gap on each side
                const adjustedX = barX - gap / 2 // Shift to the left to center the rect over the bar + half gap

                return (
                  <AnimatedBar
                    key={d.date}
                    d={d}
                    verifiedDevices={d.verified_devices}
                    barWidth={barWidth}
                    adjustedBarWidth={adjustedBarWidth}
                    x={barX}
                    adjustedX={adjustedX}
                    yMax={yMax}
                    yScale={yScale}
                    hideTooltip={hideTooltip}
                    updateTooltip={updateTooltip}
                  />
                )
              })}
            </Group>
          </svg>
          {tooltipOpen && (
            <MonthlyTooltip
              tooltipData={tooltipData}
              opacityAnimation={opacityAnimation}
              tooltipAnimation={{
                x: tooltipLeft,
                y: tooltipTop,
              }}
            />
          )}
        </div>
        <XAxis
          data={data}
          initialDate={initialDate}
          marginLeft={margin.left}
          xScale={xScale}
        />
      </div>
      <Legend data={[{ label: 'Verified devices', color: '#2A4AF5' }]} />
    </div>
  )
}

export { MonthlyChart }
