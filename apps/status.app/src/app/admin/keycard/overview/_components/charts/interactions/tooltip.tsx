import { animated } from '@react-spring/web'
import { DoneIcon, FirmwareIcon, FolderIcon } from '@status-im/icons/16'
import { defaultStyles, TooltipWithBounds } from '@visx/tooltip'

import { formatNumber } from '~admin/_utils'

import type { TooltipData } from '../hooks/use-interactions-chart-tooltip'
import type { ElementType, SpringValue } from '@react-spring/web'

const AnimatedTooltip = animated(TooltipWithBounds as ElementType)

type Props = {
  tooltipData: TooltipData
  opacityAnimation: {
    opacity: SpringValue<number>
  }
  tooltipAnimation: {
    x: SpringValue<number>
    y: SpringValue<number>
  }
}

// defining tooltip styles
const tooltipStyles: React.CSSProperties = {
  ...defaultStyles,
  minWidth: 272,
  padding: 12,
  backgroundColor: '#FFF',
  border: '1px solid #F0F2F5',
  boxShadow: '0px 2px 20px rgba(9, 16, 28, 0.04)',
  borderRadius: 20,
  marginLeft: 66,
}

const ChartTooltip = (props: Props) => {
  const { tooltipData, opacityAnimation, tooltipAnimation } = props

  return (
    <AnimatedTooltip
      top={tooltipAnimation.y}
      left={tooltipAnimation.x}
      style={{ ...tooltipStyles, opacity: opacityAnimation.opacity }}
    >
      <div>
        <div className="flex items-center gap-1 text-neutral-100">
          <p className="text-19 font-semibold">
            {tooltipData.totalInteractions}
          </p>
          <p className="pt-1 text-15 font-semibold">interactions</p>
        </div>
      </div>
      <div className="pb-4">
        <p className="text-13 font-medium text-neutral-50">
          {tooltipData.formattedDate}
        </p>
      </div>
      <div className="flex items-center">
        <DoneIcon className="text-neutral-50" />
        <div className="px-1">
          <p className="text-13 font-medium">
            {formatNumber(tooltipData.verifications)} verifications
          </p>
        </div>
      </div>
      <div className="flex items-center pt-2">
        <FirmwareIcon className="text-neutral-50" />
        <div className="px-1">
          <p className="text-13 font-medium">
            {formatNumber(tooltipData.firmware)} firmware updates
          </p>
        </div>
      </div>
      <div className="flex items-center pt-2">
        <FolderIcon className="text-neutral-50" />
        <div className="px-1">
          <p className="text-13 font-medium">
            {formatNumber(tooltipData.firmware)} database updates
          </p>
        </div>
      </div>
    </AnimatedTooltip>
  )
}

export { ChartTooltip }
