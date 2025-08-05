import { animated } from '@react-spring/web'
import { defaultStyles, TooltipWithBounds } from '@visx/tooltip'

import { formatTokenAmount } from '../../token-amount'
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
  const getFormattedValue = () => {
    switch (dataType) {
      case 'price':
        return formatChartValue(tooltipData.price, 'price', currency)
      case 'balance':
        return formatChartValue(
          tooltipData.balance ?? tooltipData.price,
          'balance',
          currency,
        )
      case 'value':
        return formatChartValue(
          tooltipData.value ?? tooltipData.price,
          'value',
          currency,
        )
    }
  }

  if (
    dataType === 'value' &&
    tooltipData.value !== undefined &&
    tooltipData.balance !== undefined
  ) {
    return (
      <TooltipWrapper
        tooltipAnimation={tooltipAnimation}
        opacityAnimation={opacityAnimation}
      >
        <div className="flex flex-col gap-1">
          <p className="text-19 font-semibold text-neutral-100">
            {formatChartValue(tooltipData.value, 'value', currency)}
          </p>
          <div className="flex flex-col gap-1">
            <p className="text-13 font-medium text-neutral-50">
              Price: {formatChartValue(tooltipData.price, 'price', currency)}
            </p>
            <p className="text-13 font-medium text-neutral-50">
              Balance: {formatTokenAmount(tooltipData.balance, 'precise')}
            </p>
          </div>
          <p className="text-13 font-medium text-neutral-50">
            {tooltipData.formattedDate}
          </p>
        </div>
      </TooltipWrapper>
    )
  }

  return (
    <TooltipWrapper
      tooltipAnimation={tooltipAnimation}
      opacityAnimation={opacityAnimation}
    >
      <p className="text-19 font-semibold text-neutral-100">
        {getFormattedValue()}
      </p>
      <p className="text-13 font-medium text-neutral-50">
        {tooltipData.formattedDate}
      </p>
    </TooltipWrapper>
  )
}

type TooltipWrapperProps = {
  tooltipAnimation: { x: SpringValue<number>; y: SpringValue<number> }
  opacityAnimation: { opacity: SpringValue<number> }
  children: React.ReactNode
}

const TooltipWrapper = ({
  tooltipAnimation,
  opacityAnimation,
  children,
}: TooltipWrapperProps) => (
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
    {children}
  </AnimatedTooltip>
)

export { ChartTooltip }
