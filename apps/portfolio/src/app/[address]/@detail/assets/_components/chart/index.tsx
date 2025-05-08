'use client'

import { useMemo, useState } from 'react'

import { config, useSpring } from '@react-spring/web'
import { SegmentedControl } from '@status-im/components'
import { Group } from '@visx/group'
import { ParentSize } from '@visx/responsive'
import { scaleLinear, scaleTime } from '@visx/scale'
import { extent, max } from 'd3-array'

import { Image } from '../../../../../_components/assets'
import { TIME_FRAMES } from '../../../../../_components/charts/utils'
import { XAxis } from '../../../../../_components/charts/x-axis'
import { useTokenChartTooltip } from '../../hooks/use-token-chart-tooltip'
import { Content } from './content'
import { Marker } from './marker'
import { ChartTooltip } from './tooltip'

import type { TimeFrame } from '../../../../../_components/charts/utils'
import type { ApiOutput } from '@status-im/wallet/data'

type DataType = 'price' | 'balance'

export type PriceType = {
  date: string
  price: number
}

type Props = {
  data:
    | ApiOutput['assets']['nativeTokenPriceChart']
    | ApiOutput['assets']['tokenPriceChart']
  currency?: string
  width?: number
  timeFrame?: TimeFrame
}

// Helper function to determine the number of decimal places in a number
const getDecimalPlaces = (num: number) => {
  const isFloat = num % 1 !== 0

  if (!isFloat) return 0

  return num.toString().split('.')[1].length || 0
}

const Chart = ({
  price,
  balance,
}: {
  price:
    | ApiOutput['assets']['nativeTokenPriceChart']
    | ApiOutput['assets']['tokenPriceChart']
  balance: ApiOutput['assets']['tokenBalanceChart']
}) => {
  const [activeDataType, setActiveDataType] = useState<DataType>('price')
  const [activeTimeFrame, setActiveTimeFrame] = useState<TimeFrame>('24H')

  // Todo: Currency should be dynamic
  const currency = 'EUR'

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <div className="inline-flex">
          <SegmentedControl.Root
            value={activeDataType}
            onValueChange={value => setActiveDataType(value as DataType)}
            size="24"
          >
            <SegmentedControl.Item value="price">Price</SegmentedControl.Item>
            <SegmentedControl.Item value="balance">
              Balance
            </SegmentedControl.Item>
          </SegmentedControl.Root>
        </div>
        <div className="inline-flex">
          <SegmentedControl.Root
            value={activeTimeFrame}
            onValueChange={value => setActiveTimeFrame(value as TimeFrame)}
            size="24"
          >
            {TIME_FRAMES.filter(frame => frame !== '2Y').map(frame => (
              <SegmentedControl.Item key={frame} value={frame}>
                {frame}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
        </div>
      </div>

      <ParentSize className="w-full bg-white-100">
        {({ width }) => {
          return (
            <TokenChart
              data={activeDataType === 'price' ? price : balance}
              width={width}
              currency={currency}
              timeFrame={activeTimeFrame}
            />
          )
        }}
      </ParentSize>
    </div>
  )
}

export { Chart }

// CHART CONTENT
const margin = { top: 0, right: 60, bottom: 0, left: 0 }
const WIDTH = 300
const HEIGHT = 256

const TokenChart = (props: Props) => {
  const { data, currency, width = WIDTH, timeFrame } = props
  const dates = data.map(d => new Date(d.date))

  const innerWidth = (width || 0) - margin.left - margin.right
  const innerHeight = HEIGHT - margin.bottom

  const filteredDates = dates.filter(Boolean)

  const xDomain = extent(filteredDates) as [Date, Date]
  const xScale = scaleTime({
    domain: xDomain,
    range: [0, innerWidth],
    nice: false,
  })

  const dateRange = xDomain[1]?.getTime() - xDomain[0]?.getTime()

  const maxTicksX = 7
  const numTicksX = Math.min(
    data.length,
    Math.ceil(dateRange / (24 * 60 * 60 * 1000)),
    maxTicksX
  )

  const maxTicks = 7

  // Find the maximum number of decimal places in the data
  const maxDecimalPlaces = Math.min(
    Math.max(...data.map(d => getDecimalPlaces(d.price))),
    4
  )

  // Calculate maxPrice with margin
  const marginFactor = 1.1
  const maxPrice = (max(data.map(d => d.price)) || 0) * marginFactor

  // Calculate tick interval gap
  const tickInterval = maxPrice / (maxTicks - 1)

  // Generate tick values
  const tickValuesY = Array.from({ length: maxTicks }, (_, i) => {
    const tickValue = Math.min(i * tickInterval, maxPrice)

    // If the maximum number of decimal places is 0, return integer values
    if (maxDecimalPlaces === 0) {
      return Math.round(tickValue).toString()
    }

    // Otherwise, format the tick value to respect the decimal places, unless is zero.
    return tickValue.toFixed(tickValue === 0 ? 0 : maxDecimalPlaces)
  })

  // Adjust tickInterval calculation
  const yScale = scaleLinear({
    domain: [0, maxPrice],
    range: [innerHeight, 0],
    nice: true,
  })

  const priceData = useMemo(
    () =>
      data.map(d => ({
        date: new Date(d.date),
        value: d.price,
      })),
    [data]
  )

  const { tooltipData, updateTooltip, hideTooltip, tooltipOpen } =
    useTokenChartTooltip({
      data,
      margin,
      dates,
      innerWidth,
    })

  const circleSpringPrice = useSpring({
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
    return (
      <div className="relative mt-4 flex h-[296px] w-full flex-col">
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <Image
            id="Portfolio/Assets/Empty:750:232"
            className="max-w-[375px]"
            alt=""
          />
          <div className="flex flex-col items-center justify-center gap-0.5">
            <p className="text-15 font-600">No data available</p>
            <p className="max-w-[375px] text-13">
              Some generic description about the fact of not having data
            </p>
          </div>
        </div>
        <div className="absolute left-0 top-0 z-10 flex size-full max-h-[264px] flex-col-reverse items-start justify-between">
          {Array.from({ length: 7 }).map((_, index) => {
            return (
              <div
                key={index}
                className="flex w-full items-center justify-start gap-7"
              >
                {/* Dashed line for each value */}
                <div className="h-px w-full border-t border-dashed border-neutral-10" />

                <p className="text-neutral-10">-</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="relative mt-4">
        <YAxis tickValuesY={tickValuesY} width={innerWidth} />

        <svg
          width="100%"
          height={HEIGHT}
          overflow="visible"
          className="relative z-20"
        >
          <Group top={margin.top}>
            <Content
              pricesData={priceData}
              xScale={xScale}
              yScale={yScale}
              innerHeight={innerHeight}
              innerWidth={innerWidth}
              numTicksX={numTicksX}
            />

            {tooltipOpen && (
              <Marker
                circleSpringPrice={circleSpringPrice}
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
            currency={currency}
          />
        )}
      </div>

      <XAxis
        data={data}
        marginLeft={0}
        xScale={xScale}
        initialDate={dates[0]}
        activeRange={timeFrame}
        className="mt-6 h-4"
      />
    </>
  )
}

type YAxisProps = {
  tickValuesY: string[]
  width: number
}

const YAxis = (props: YAxisProps) => {
  const { tickValuesY, width } = props

  return (
    <div className="absolute -bottom-2 left-0 z-10 flex size-full flex-col-reverse items-start justify-between">
      {tickValuesY.map((value, index) => {
        return (
          <div key={index} className="flex w-full items-center justify-start">
            {/* Dashed line for each value */}
            <div
              className="h-px w-full border-t border-dashed border-neutral-10"
              style={{
                width,
              }}
            />
            <div className="flex-1 items-end">
              <p
                key={index}
                className="text-right text-11 font-medium text-neutral-40"
              >
                {value}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
