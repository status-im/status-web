import { useCallback } from 'react'

import { localPoint } from '@visx/event'
import { scaleTime } from '@visx/scale'
import { useTooltip } from '@visx/tooltip'
import { bisector, extent } from 'd3-array'
import { timeFormat } from 'd3-time-format'

import type { CumulativeDeviceType } from '../devices/chart'
import type { EventType } from '@visx/event/lib/types'

type Props = {
  data: CumulativeDeviceType[]
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
  verifiedPercentage: number
  unverifiedPercentage: number
  verifiedDevices: number
  unverifiedDevices: number
  formattedDate: string
}

const formatDate = timeFormat('%b %Y')

const getPercentage = (value: number, total: number): number =>
  Math.round((value / total) * 100)
const getUnverifiedDevices = (d: CumulativeDeviceType) => d.unverified_devices
const getVerifiedDevices = (d: CumulativeDeviceType) => d.verified_devices

const useCumulativeChartTooltip = (props: Props) => {
  const { data, margin, dates, innerWidth } = props

  // tooltip parameters
  const { tooltipData, showTooltip, hideTooltip, tooltipOpen } =
    useTooltip<TooltipData>({
      tooltipData: {
        date: '',
        verifiedPercentage: 0,
        unverifiedDevices: 0,
        verifiedDevices: 0,
        unverifiedPercentage: 0,
        formattedDate: '',
      },
    })

  const filteredDates = dates.filter(Boolean) // filters out undefined values

  const getDate = useCallback(
    (d: CumulativeDeviceType) => new Date(d?.date),
    []
  )
  const bisectDate = bisector(
    (d: CumulativeDeviceType) => new Date(d?.date)
  ).left

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

      const unverifiedDevices = getUnverifiedDevices(d)
      const verifiedDevices = getVerifiedDevices(d)

      const totalDevices = unverifiedDevices + verifiedDevices

      const unverifiedPercentage =
        getPercentage(unverifiedDevices, totalDevices) || 0

      const verifiedPercentage =
        getPercentage(verifiedDevices, totalDevices) || 0

      showTooltip({
        tooltipData: {
          date: d?.date,
          formattedDate: formatDate(getDate(d)),
          verifiedPercentage,
          unverifiedDevices,
          verifiedDevices,
          unverifiedPercentage,
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

export { useCumulativeChartTooltip }
export type { TooltipData }
