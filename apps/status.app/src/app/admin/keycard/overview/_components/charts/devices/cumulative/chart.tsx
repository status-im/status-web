'use client'

import { useMemo } from 'react'

import { config, useSpring } from '@react-spring/web'
import { Group } from '@visx/group'
import { scaleLinear, scaleTime } from '@visx/scale'
import { extent, max } from 'd3-array'

import { XAxis } from '~components/charts/x-axis'

import { useCumulativeChartTooltip } from '../../hooks/use-cumulative-chart-tooltip'
import { Legend } from '../../legend'
import { YAxis } from '../../y-axis'
import { Content } from './content'
import { Markers } from './markers'
import { ChartTooltip } from './tooltip'

import type { CumulativeDeviceType } from '../chart'

type Props = {
  data: CumulativeDeviceType[]
  width?: number
  height?: number
}

const margin = { top: 0, right: 35, bottom: 0, left: 65 }

const CumulativeChart = (props: Props) => {
  const { data, width = 300, height = 156 } = props
  const dates = data.map(d => new Date(d.date))

  const innerWidth = (width || 0) - margin.left - margin.right
  const innerHeight = height - margin.bottom

  const filteredDates = dates.filter(Boolean)
  const totalDevices = data.map(d => d.verified_devices + d.unverified_devices)

  const xDomain = extent(filteredDates) as [Date, Date]
  const xScale = scaleTime({
    domain: xDomain,
    range: [0, innerWidth],
    nice: false,
  })

  const dateRange = xDomain[1].getTime() - xDomain[0].getTime()

  const maxTicksX = 12
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
    useCumulativeChartTooltip({
      data,
      margin,
      dates,
      innerWidth,
    })

  const circleSpringTotal = useSpring({
    x: xScale(new Date(tooltipData?.date || '')),
    y: yScale(
      (tooltipData?.unverifiedDevices || 0) + tooltipData?.verifiedDevices
    ),
    config: config.gentle,
  })

  const circleSpringClosed = useSpring({
    x: xScale(new Date(tooltipData?.date)),
    y: yScale(tooltipData?.verifiedDevices),
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
  const totalDevicesData = useMemo(
    () =>
      data.map(d => ({
        date: new Date(d.date),
        value: d.verified_devices + d.unverified_devices,
      })),
    [data]
  )

  const verifiedDevicesData = useMemo(
    () =>
      data.map(d => ({
        date: new Date(d.date),
        value: d.verified_devices,
      })),
    [data]
  )

  return (
    <>
      <div className="relative mt-8">
        <YAxis tickValuesY={tickValuesY} />
        <svg width="100%" height={height} overflow="visible">
          <Group left={margin.left} top={margin.top}>
            <Content
              verifiedDevicesData={verifiedDevicesData}
              totalDevicesData={totalDevicesData}
              xScale={xScale}
              yScale={yScale}
              innerHeight={innerHeight}
              numTicksX={numTicksX}
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
      <XAxis
        data={data}
        initialDate={xDomain[0]}
        marginLeft={margin.left - 4}
        xScale={xScale}
      />

      <Legend
        data={[
          { label: 'Imported devices', color: '#2A4AF5', dashed: true },
          { label: 'Verified devices', color: '#2A4AF5' },
        ]}
      />
    </>
  )
}

export { CumulativeChart }
