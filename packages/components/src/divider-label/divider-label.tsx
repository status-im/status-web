import { Stack } from '@tamagui/core'

import { Text } from '../text'

type Props = {
  label: string
  tight?: boolean
}

const DividerLabel = (props: Props) => {
  const { label, tight = true } = props

  return (
    <Stack
      paddingHorizontal={16}
      paddingTop={tight ? 8 : 16}
      paddingBottom={8}
      borderColor="$neutral-10"
      borderTopWidth={1}
    >
      <Text size={13} color="$neutral-50" weight="medium">
        {label}
      </Text>
    </Stack>
  )
}

export { DividerLabel }
export type { Props as DividerLabelProps }
