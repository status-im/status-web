import { animated } from '@react-spring/web'
import { defaultStyles, TooltipWithBounds } from '@visx/tooltip'

import { formatChartValue } from '../utils'

import type { TooltipData } from '../hooks/use-token-chart-tooltip'
import type { BaseChartProps } from '../utils'
import type { ElementType, SpringValue } from '@react-spring/web'

const AnimatedTooltip = animated(TooltipWithBounds as ElementType)

type Props = BaseChartProps & {
  tooltipData: TooltipData
  opacityAnimation: { opacity: SpringValue<number> }
  tooltipAnimation: { x: SpringValue<number>; y: SpringValue<number> }
}

const ChartTooltip = ({
  tooltipData,
  opacityAnimation,
  tooltipAnimation,
  currency,
  dataType = 'price',
}: Props) => {
  const formattedValue = formatChartValue(tooltipData.price, dataType, currency)

  return (
    <AnimatedTooltip
      top={tooltipAnimation.y}
      left={tooltipAnimation.x}
      style={{
        ...defaultStyles,
        minWidth: 159,
        padding: '8px 12px',
        backgroundColor: '#FFF',
        border: '1px solid #F0F2F5',
        boxShadow: '0px 2px 20px rgba(9, 16, 28, 0.04)',
        borderRadius: 10,
        zIndex: 100,
        opacity: opacityAnimation.opacity,
      }}
    >
      <p className="text-19 font-semibold text-neutral-100">{formattedValue}</p>
      <p className="text-13 font-medium text-neutral-50">
        {tooltipData.formattedDate}
      </p>
    </AnimatedTooltip>
  )
}

export { ChartTooltip }
