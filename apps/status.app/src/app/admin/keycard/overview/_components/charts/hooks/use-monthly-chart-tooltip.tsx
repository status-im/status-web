import { useCallback } from 'react'

import { localPoint } from '@visx/event'
import { useTooltip } from '@visx/tooltip'
import { timeFormat } from 'd3-time-format'

import type { MonthlyDeviceType } from '../devices/chart'

type TooltipData = {
  verifiedDevices: number
  formattedDate: string
}

const formatDate = timeFormat('%b %d, %Y')

const useMonthlyChartTooltip = () => {
  // tooltip parameters
  const {
    tooltipData,
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<TooltipData>({
    tooltipData: {
      verifiedDevices: 0,
      formattedDate: '',
    },
  })

  // Define tooltip handler
  const updateTooltip = useCallback(
    (
      event: React.MouseEvent<SVGRectElement, MouseEvent>,
      {
        x,
        barWidth,
        d,
      }: {
        x: number
        barWidth: number
        d: MonthlyDeviceType
      }
    ) => {
      const eventSvgCoords = localPoint(event)
      const left = x + barWidth / 2

      showTooltip({
        tooltipData: {
          formattedDate: formatDate(new Date(d?.date)),
          verifiedDevices: d.verified_devices,
        },
        tooltipTop: eventSvgCoords?.y || 0,
        tooltipLeft: left,
      })
    },

    [showTooltip]
  )

  return {
    tooltipData: tooltipData!,
    hideTooltip,
    updateTooltip,
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
  }
}

export { useMonthlyChartTooltip }
