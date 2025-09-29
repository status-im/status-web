import { useCallback } from 'react'

import { localPoint } from '@visx/event'
import { scaleTime } from '@visx/scale'
import { useTooltip } from '@visx/tooltip'
import { bisector, extent } from 'd3-array'
import { timeFormat } from 'd3-time-format'

import type { InteractionsType } from '../interactions/chart'
import type { EventType } from '@visx/event/lib/types'
import type { TimeFrame } from '~components/charts/utils'

type Props = {
  data: InteractionsType[]
  dates: Date[]
  innerWidth: number
  activeRange: TimeFrame
  margin: {
    top: number
    right: number
    bottom: number
    left: number
  }
}

type TooltipData = {
  date: string
  totalInteractions: number
  verifications: number
  firmware: number
  databases: number
  formattedDate: string
}

const useInteractionsChartTooltip = (props: Props) => {
  const { data, margin, dates, innerWidth, activeRange } = props

  // tooltip parameters
  const { tooltipData, showTooltip, hideTooltip, tooltipOpen } =
    useTooltip<TooltipData>({
      tooltipData: {
        date: '',
        totalInteractions: 0,
        verifications: 0,
        firmware: 0,
        databases: 0,
        formattedDate: '',
      },
    })

  const filteredDates = dates.filter(Boolean) // filters out undefined values

  const getDate = useCallback((d: InteractionsType) => new Date(d?.date), [])
  const bisectDate = bisector((d: InteractionsType) => new Date(d?.date)).left

  const xDomain = extent(filteredDates) as [Date, Date]
  const xScale = scaleTime({
    domain: xDomain,
    range: [0, innerWidth],
  })

  const formatDate = timeFormat(
    activeRange === '7D' || activeRange === '1M' ? '%b %d, %Y' : '%b %Y'
  )

  // Define tooltip handler
  const updateTooltip = useCallback(
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
        tooltipData: {
          date: d.date,
          totalInteractions: d.verifications + d.databases + d.firmware,
          formattedDate: formatDate(getDate(d)),
          verifications: d.verifications,
          databases: d.databases,
          firmware: d.firmware,
        },
      })
    },
    [xScale, margin.left, bisectDate, data, getDate, showTooltip, formatDate]
  )

  return {
    tooltipData: tooltipData!,
    hideTooltip,
    updateTooltip,
    tooltipOpen,
  }
}

export { useInteractionsChartTooltip }
export type { TooltipData }
