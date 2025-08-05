import { useMemo } from 'react'

import { config, useSpring } from '@react-spring/web'
import { Group } from '@visx/group'
import { scaleLinear, scaleTime } from '@visx/scale'
import { extent } from 'd3-array'

import { useTokenChartTooltip } from '../hooks/use-token-chart-tooltip'
import { calculateChartRange } from '../utils'
import { Content } from './content'
import { Marker } from './marker'
import { ChartTooltip } from './tooltip'
import { XAxis } from './x-axis'
import { YAxis } from './y-axis'

import type { BaseChartProps, ChartDataPoint, TimeFrame } from '../utils'
import type React from 'react'

type TokenChartProps = BaseChartProps & {
  data: ChartDataPoint[]
  width: number
  timeFrame?: TimeFrame
  emptyState: React.ReactNode
}

const TokenChart = ({
  data,
  currency,
  width,
  dataType,
  timeFrame,
  emptyState,
}: TokenChartProps) => {
  const innerWidth = Math.max(100, width - 60)
  const innerHeight = 256

  const sortedData = useMemo(
    () =>
      [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [data],
  )

  const dates = useMemo(
    () => sortedData.map(d => new Date(d.date)),
    [sortedData],
  )
  const xDomain = extent(dates) as [Date, Date]
  const xScale = scaleTime({
    domain: xDomain,
    range: [0, innerWidth],
    nice: false,
  })

  const { min, max, ticks } = calculateChartRange(sortedData, 0.1, dataType)
  const yScale = scaleLinear({
    domain: [min, max],
    range: [innerHeight, 0],
    nice: true,
  })

  const priceData = useMemo(
    () => sortedData.map(d => ({ date: new Date(d.date), value: d.price })),
    [sortedData],
  )

  const isPositive = useMemo(() => {
    if (dataType === 'balance') return true
    if (sortedData.length === 0) return true
    return sortedData[sortedData.length - 1].price >= sortedData[0].price
  }, [sortedData, dataType])

  const { tooltipData, updateTooltip, hideTooltip, tooltipOpen } =
    useTokenChartTooltip({
      data: sortedData,
      margin: { top: 0, right: 60, bottom: 0, left: 0 },
      dates,
      innerWidth,
    })

  const circleSpring = useSpring({
    x: xScale(new Date(tooltipData?.date)),
    y: yScale(tooltipData?.price),
    config: config.gentle,
  })

  const opacityAnimation = useSpring({
    opacity: data ? 1 : 0,
    config: config.gentle,
    delay: 200,
  })

  const tooltipAnimation = useSpring({
    x: xScale(new Date(tooltipData?.date)),
    y: yScale(tooltipData?.price),
    config: config.gentle,
  })

  if (!data.length) {
    return <div className="mt-[72px]">{emptyState}</div>
  }

  return (
    <>
      <div className="relative mt-4">
        <YAxis ticks={ticks} width={innerWidth} />

        <svg
          width="100%"
          height={innerHeight}
          overflow="visible"
          className="relative z-20"
        >
          <Group top={0}>
            <Content
              pricesData={priceData}
              xScale={xScale}
              yScale={yScale}
              isPositive={isPositive}
              dataType={dataType}
              currency={currency}
            />

            {tooltipOpen && (
              <Marker
                circleSpringPrice={circleSpring}
                innerHeight={innerHeight}
                opacityAnimation={opacityAnimation}
                isPositive={isPositive}
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
        {tooltipOpen && (
          <ChartTooltip
            tooltipAnimation={tooltipAnimation}
            opacityAnimation={opacityAnimation}
            tooltipData={tooltipData}
            currency={currency}
            dataType={dataType}
          />
        )}
      </div>

      <XAxis
        data={sortedData}
        marginLeft={0}
        xScale={xScale}
        initialDate={dates[0]}
        activeRange={timeFrame}
        className="mt-6 h-4"
        availableWidth={innerWidth}
      />
    </>
  )
}

export { TokenChart }
