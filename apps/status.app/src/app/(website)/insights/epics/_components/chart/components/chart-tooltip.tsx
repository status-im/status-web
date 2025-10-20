import { animated } from '@react-spring/web'
import { DoneIcon, OpenIcon } from '@status-im/icons/16'
import { defaultStyles, TooltipWithBounds } from '@visx/tooltip'

import type { TooltipData } from '../hooks/use-chart-tooltip'
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
  marginLeft: 25,
}

const ChartTooltip = (props: Props) => {
  const { tooltipData, opacityAnimation, tooltipAnimation } = props
  return (
    <AnimatedTooltip
      top={tooltipAnimation.y}
      left={tooltipAnimation.x}
      style={{ ...tooltipStyles, opacity: opacityAnimation.opacity }}
      className="rounded-16"
    >
      <div className="flex flex-row items-center">
        <span className="text-19 font-semibold">{tooltipData.totalIssues}</span>
        <div className="ml-3 flex items-center">
          <span className="text-15 font-medium">issues</span>
        </div>
      </div>
      <div className="pb-3">
        <span className="text-13 font-medium text-neutral-50">
          {tooltipData.formattedDate}
        </span>
      </div>

      <div className="rounded-8 bg-danger-50/10">
        <div
          className="h-2 rounded-8 bg-success-50 transition-all duration-300 ease-in-out"
          style={{ width: `${tooltipData.completedIssuesPercentage}%` }}
        />
      </div>
      <div className="flex flex-row items-center pt-[18px]">
        <OpenIcon className="text-neutral-40" />
        <div className="px-1">
          <span className="text-13 font-medium">
            {tooltipData.openIssues} open
          </span>
        </div>
        <div className="flex min-w-[36px] items-center justify-center rounded-full bg-danger-50/30 px-1.5 py-0.5">
          <span className="text-11 font-medium text-danger-50">
            {tooltipData.openIssuesPercentage}%
          </span>
        </div>
      </div>
      <div className="flex flex-row items-center pt-2">
        <DoneIcon className="text-neutral-40" />
        <div className="px-1">
          <span className="text-13 font-medium">
            {tooltipData.closedIssues} closed
          </span>
        </div>
        <div className="flex min-w-[36px] items-center justify-center rounded-full bg-success-50/30 px-1.5 py-0.5">
          <span className="text-11 font-medium text-success-50">
            {tooltipData.completedIssuesPercentage}%
          </span>
        </div>
      </div>
    </AnimatedTooltip>
  )
}

export { ChartTooltip }
