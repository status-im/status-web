import { useCallback } from 'react'

import { localPoint } from '@visx/event'
import { scaleTime } from '@visx/scale'
import { useTooltip } from '@visx/tooltip'
import { bisector, extent } from 'd3-array'

import { getClosedIssues, getTotalIssues } from '../helpers/get-data'
import { formatDate } from '../utils/format-time'
import { getPercentage } from '../utils/get-percentage'

import type { DayType } from '../chart'
import type { EventType } from '@visx/event/lib/types'

type Props = {
  data: DayType[]
  dates: Date[]
  innerWidth: number
  margin: {
    top: number
    right: number
    bottom: number
    left: number
  }
}

type TooltipData = {
  date: string
  completedIssuesPercentage: number
  openIssuesPercentage: number
  totalIssues: number
  openIssues: number
  closedIssues: number
  formattedDate: string
}

/**
 * An custom hook that handles the tooltip logic
 * @param data - the data to be used in the chart
 * @param margin - the margin of the chart
 * @param dates - the dates of the chart
 * @param innerWidth - the inner width of the chart

 * @returns tooltipData - the data to be used in the tooltip
 * @returns updateTooltip - a function that updates the tooltip
 * @returns hideTooltip - a function that hides the tooltip
  * @returns tooltipOpen - a boolean that indicates if the tooltip is open
 **/

const useChartTooltip = (props: Props) => {
  const { data, margin, dates, innerWidth } = props

  // tooltip parameters
  const { tooltipData, showTooltip, hideTooltip, tooltipOpen } =
    useTooltip<TooltipData>({
      tooltipData: {
        date: '',
        completedIssuesPercentage: 0,
        openIssuesPercentage: 0,
        totalIssues: 0,
        openIssues: 0,
        closedIssues: 0,
        formattedDate: '',
      },
    })

  const filteredDates = dates.filter(Boolean) // filters out undefined values

  const getDate = useCallback((d: DayType) => new Date(d?.date), [])
  const bisectDate = bisector((d: DayType) => new Date(d?.date)).left

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

      const completedIssuesPercentage =
        getPercentage(closedIssues, totalIssues) || 0

      const openIssuesPercentage = getPercentage(openIssues, totalIssues) || 0

      showTooltip({
        tooltipData: {
          date: d?.date,
          formattedDate: formatDate(getDate(d)),
          completedIssuesPercentage,
          openIssuesPercentage,
          closedIssues,
          totalIssues,
          openIssues,
        },
      })
    },
    [xScale, margin.left, bisectDate, data, getDate, showTooltip]
  )

  return {
    tooltipData: tooltipData!,
    hideTooltip,
    updateTooltip,
    tooltipOpen,
  }
}

export { useChartTooltip }
export type { TooltipData, Props as UseChartTooltipProps }
