import { useCallback } from 'react'

import { localPoint } from '@visx/event'
import { scaleTime } from '@visx/scale'
import { useTooltip } from '@visx/tooltip'
import { extent } from 'd3-array'
import { timeFormat } from 'd3-time-format'

import type { ChartDataPoint as PriceType } from '../utils'
import type { EventType } from '@visx/event/lib/types'

type Props = {
  data: PriceType[]
  dates: Date[]
  innerWidth: number
  currency?: string
  margin: {
    top: number
    right: number
    bottom: number
    left: number
  }
}

type TooltipData = {
  date: string
  price: number
  formattedDate: string
}

// Eg. 'Jan 17th, 2024 - 14:45 '
const formatDate = timeFormat('%b %d, %Y - %H:%M')

const getPrice = (d: PriceType) => d.price

const useTokenChartTooltip = (props: Props) => {
  const { data, margin, dates, innerWidth } = props

  // tooltip parameters
  const { tooltipData, showTooltip, hideTooltip, tooltipOpen } =
    useTooltip<TooltipData>({
      tooltipData: {
        date: '',
        price: 0,
        formattedDate: '',
      },
    })

  const filteredDates = dates.filter(Boolean) // filters out undefined values

  const getDate = useCallback((d: PriceType) => new Date(d?.date), [])

  const xDomain = extent(filteredDates) as [Date, Date]
  const xScale = scaleTime({
    domain: xDomain,
    range: [0, innerWidth],
  })

  // Define tooltip handler
  const updateTooltip = useCallback(
    (event: EventType) => {
      const { x } = localPoint(event) || { x: 0 }
      const x0 = xScale.invert(x - margin.left)

      let closestIndex = 0
      let minDistance = Math.abs(getDate(data[0]).valueOf() - x0.valueOf())

      for (let i = 1; i < data.length; i++) {
        const distance = Math.abs(getDate(data[i]).valueOf() - x0.valueOf())
        if (distance < minDistance) {
          minDistance = distance
          closestIndex = i
        }
      }

      const d = data[closestIndex]
      const price = getPrice(d)

      showTooltip({
        tooltipData: {
          date: d?.date,
          formattedDate: formatDate(getDate(d)),
          price,
        },
      })
    },
    [xScale, margin.left, data, getDate, showTooltip],
  )

  return {
    tooltipData: tooltipData!,
    hideTooltip,
    updateTooltip,
    tooltipOpen,
  }
}

export { useTokenChartTooltip }
export type { TooltipData, Props as UseChartTooltipProps }
