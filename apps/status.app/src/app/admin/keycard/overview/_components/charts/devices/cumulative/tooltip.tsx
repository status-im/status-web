import { animated } from '@react-spring/web'
import { DoneIcon, OpenIcon } from '@status-im/icons/16'
import { defaultStyles, TooltipWithBounds } from '@visx/tooltip'

import { formatNumber } from '~admin/_utils'

import type { TooltipData } from '../../hooks/use-cumulative-chart-tooltip'
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
  const totalDevices = formatNumber(
    tooltipData.verifiedDevices + (tooltipData?.unverifiedDevices || 0)
  )

  return (
    <AnimatedTooltip
      top={tooltipAnimation.y}
      left={tooltipAnimation.x}
      style={{ ...tooltipStyles, opacity: opacityAnimation.opacity }}
    >
      <div>
        <div className="flex items-center gap-1 text-neutral-100">
          <p className="text-19 font-semibold">{totalDevices}</p>
          <p className="pt-1 text-15 font-semibold">devices</p>
        </div>
      </div>
      <div className="pb-2">
        <p className="text-13 font-medium text-neutral-50">
          {tooltipData.formattedDate}
        </p>
      </div>

      <div className="rounded-8 bg-customisation-blue-50/20">
        <div
          className="h-2 rounded-8 bg-customisation-blue-50 transition-all duration-300 ease-out"
          style={{
            width: `${tooltipData.verifiedPercentage}%`,
          }}
        />
      </div>
      <div className="flex items-center pt-[18px]">
        <DoneIcon className="text-neutral-40" />
        <div className="px-1">
          <p className="text-13 font-medium">
            {formatNumber(tooltipData.verifiedDevices)} verified
          </p>
        </div>
        <div className="flex h-5 min-w-[36px] items-center justify-center rounded-20 bg-success-50/30 px-[6px] py-0.5 transition-all duration-300 ease-out">
          <p className="text-11 font-medium text-success-50">
            {`${tooltipData.verifiedPercentage}%`}
          </p>
        </div>
      </div>
      <div className="flex items-center pt-2">
        <OpenIcon color="text-neutral-40" />
        <div className="px-1">
          <p className="text-13 font-medium">
            {formatNumber(tooltipData.unverifiedDevices)} unverified
          </p>
        </div>
        <div className="flex h-5 min-w-[36px] items-center justify-center rounded-20 bg-danger-50/30 px-[6px] py-0.5">
          <p className="text-11 font-medium text-danger-50">
            {`${tooltipData.unverifiedPercentage}%`}
          </p>
        </div>
      </div>
    </AnimatedTooltip>
  )
}

export { ChartTooltip }
