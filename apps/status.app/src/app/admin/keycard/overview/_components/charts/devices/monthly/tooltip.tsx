import { animated } from '@react-spring/web'
import { defaultStyles, TooltipWithBounds } from '@visx/tooltip'

import { formatNumber } from '~admin/_utils'

import type { ElementType, SpringValue } from '@react-spring/web'

const AnimatedTooltip = animated(TooltipWithBounds as ElementType)

type Props = {
  tooltipData?: TooltipData
  opacityAnimation: {
    opacity: SpringValue<number>
  }
  tooltipAnimation: {
    x: number
    y: number
  }
}

type TooltipData = {
  verifiedDevices: number
  formattedDate: string
}

// defining tooltip styles
const tooltipStyles: React.CSSProperties = {
  ...defaultStyles,
  padding: 12,
  backgroundColor: '#FFF',
  border: '1px solid #F0F2F5',
  boxShadow: '0px 2px 20px rgba(9, 16, 28, 0.04)',
  borderRadius: 20,
  marginLeft: 46,
  marginTop: 16,
}

const MonthlyTooltip = (props: Props) => {
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
            {formatNumber(tooltipData?.verifiedDevices)} verifications
          </p>
        </div>
      </div>
      <div className="pb-2">
        <p className="text-13 font-medium text-neutral-50">
          {tooltipData?.formattedDate}
        </p>
      </div>
    </AnimatedTooltip>
  )
}

export { MonthlyTooltip }
