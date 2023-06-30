import { animated } from '@react-spring/web'
import { Text } from '@status-im/components'
import { DoneIcon, OpenIcon } from '@status-im/icons'
import { Stack } from '@tamagui/core'
import { defaultStyles, TooltipWithBounds } from '@visx/tooltip'

import type { TooltipData } from '../hooks/use-chart-tooltip'
import type { SpringValue } from '@react-spring/web'

const AnimatedTooltip = animated(TooltipWithBounds)

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
      className="rounded-2xl"
    >
      <Stack flexDirection="row" alignItems="center">
        <Text size={19} weight="semibold">
          {tooltipData.totalIssues}
        </Text>
        <Stack ml={3} alignItems="center">
          <Text size={15} weight="medium">
            issues
          </Text>
        </Stack>
      </Stack>
      <Stack pb={12}>
        <Text size={13} weight="medium" color="$neutral-50">
          {tooltipData.formattedDate}
        </Text>
      </Stack>

      <Stack borderRadius="$8" backgroundColor="$danger-50-opa-10">
        <Stack
          animation="slow"
          height={8}
          backgroundColor="$success-50"
          width={`${tooltipData.completedIssuesPercentage}%`}
          borderRadius="$8"
        />
      </Stack>
      <Stack flexDirection="row" alignItems="center" pt={18}>
        <OpenIcon size={16} color="$neutral-40" />
        <Stack px={4}>
          <Text size={13} weight="medium">
            {tooltipData.openIssues} open
          </Text>
        </Stack>
        <Stack
          backgroundColor="$danger-50-opa-30"
          borderRadius="$20"
          px={6}
          py={2}
          minWidth={36}
          justifyContent="center"
          alignItems="center"
        >
          <Text size={11} weight="medium" color="$danger-50">
            {`${tooltipData.openIssuesPercentage}%`}
          </Text>
        </Stack>
      </Stack>
      <Stack flexDirection="row" alignItems="center" pt={8}>
        <DoneIcon size={16} color="$neutral-40" />
        <Stack px={4}>
          <Text size={13} weight="medium">
            {tooltipData.closedIssues} closed
          </Text>
        </Stack>
        <Stack
          minWidth={36}
          backgroundColor="$success-50-opa-30"
          borderRadius="$20"
          px={6}
          py={2}
          justifyContent="center"
          alignItems="center"
        >
          <Text size={11} weight="medium" color="$success-50">
            {`${tooltipData.completedIssuesPercentage}%`}
          </Text>
        </Stack>
      </Stack>
    </AnimatedTooltip>
  )
}

export { ChartTooltip }
