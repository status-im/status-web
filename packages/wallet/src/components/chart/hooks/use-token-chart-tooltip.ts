import { useCallback } from 'react'

import { localPoint } from '@visx/event'
import { scaleTime } from '@visx/scale'
import { useTooltip } from '@visx/tooltip'
import { extent } from 'd3-array'
import { timeFormat } from 'd3-time-format'

import type { ChartDataPoint } from '../utils'
import type { EventType } from '@visx/event/lib/types'

type Props = {
  data: ChartDataPoint[]
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

type TooltipData = ChartDataPoint & {
  formattedDate: string
}

// Eg. 'Jan 17th, 2024 - 14:45 '
const formatDate = timeFormat('%b %d, %Y - %H:%M')

const useTokenChartTooltip = (props: Props) => {
  const { data, margin, dates, innerWidth } = props

  // tooltip parameters
  const { tooltipData, showTooltip, hideTooltip, tooltipOpen } =
    useTooltip<TooltipData>({
      tooltipData: {
        date: '',
        price: 0,
        balance: 0,
        value: 0,
        formattedDate: '',
      },
    })

  const filteredDates = dates.filter(Boolean) // filters out undefined values

  const getDate = useCallback((d: ChartDataPoint) => new Date(d?.date), [])

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

      showTooltip({
        tooltipData: {
          ...d,
          formattedDate: formatDate(getDate(d)),
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
