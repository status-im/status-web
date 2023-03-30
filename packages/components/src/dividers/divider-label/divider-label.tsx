import { Stack } from '@tamagui/core'

import { Text } from '../../text'
import { DividerLine } from '../divider-line'

type Props = {
  label: string
  tight?: boolean
  count?: number
}

// TODO: Add counter after PR #355 lands
const DividerLabel = (props: Props) => {
  const { label, tight = true } = props

  return (
    <Stack paddingBottom={8} gap={tight ? 8 : 16}>
      <DividerLine />
      <Stack paddingHorizontal={16}>
        <Text size={13} color="$neutral-50" weight="medium">
          {label}
        </Text>
      </Stack>
    </Stack>
  )
}

export { DividerLabel }
export type { Props as DividerLabelProps }
