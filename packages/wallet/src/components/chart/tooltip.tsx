import { animated } from '@react-spring/web'
import { defaultStyles, TooltipWithBounds } from '@visx/tooltip'

import type { TooltipData } from './hooks/use-token-chart-tooltip'
import type { ElementType, SpringValue } from '@react-spring/web'

const AnimatedTooltip = animated(TooltipWithBounds as ElementType)

type Props = {
  tooltipData: TooltipData
  currency?: string
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
  minWidth: 159,
  padding: '8px 12px',
  backgroundColor: '#FFF',
  border: '1px solid #F0F2F5',
  boxShadow: '0px 2px 20px rgba(9, 16, 28, 0.04)',
  borderRadius: 10,
  zIndex: 100,
}

const getFractionalDigits = (value: number) => {
  return value.toString().split('.')[1]?.length || 0
}

const ChartTooltip = (props: Props) => {
  const { tooltipData, opacityAnimation, tooltipAnimation, currency } = props

  const fractionalDigits = getFractionalDigits(tooltipData.price)
  const price = tooltipData.price.toLocaleString('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: fractionalDigits,
    maximumFractionDigits: fractionalDigits,
  })

  return (
    <AnimatedTooltip
      top={tooltipAnimation.y}
      left={tooltipAnimation.x}
      style={{ ...tooltipStyles, opacity: opacityAnimation.opacity }}
    >
      <p className="text-19 font-semibold text-neutral-100">{price}</p>

      <p className="text-13 font-medium text-neutral-50">
        {tooltipData.formattedDate}
      </p>
    </AnimatedTooltip>
  )
}

export { ChartTooltip }
