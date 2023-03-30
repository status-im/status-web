import { Stack } from '@tamagui/core'

import { Text } from '../../text'
import { DividerLine } from '../divider-line'

type Props = {
  label: string
}

const DividerDate = (props: Props) => {
  const { label } = props

  return (
    <Stack
      paddingTop={8}
      marginBottom={12}
      marginLeft={48}
      marginRight={8}
      gap={4}
      // borderBottomWidth={1}
      // borderColor="$neutral-10"
    >
      <Text size={11} color="$neutral-50" weight="medium">
        {label}
      </Text>
      <DividerLine />
    </Stack>
  )
}

export { DividerDate }
export type { Props as DividerLabelProps }
