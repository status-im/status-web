import { Stack } from '@tamagui/core'

import { Paragraph } from '../typography'

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
      <Paragraph color="$neutral-50" weight="medium" variant="smaller">
        {label}
      </Paragraph>
    </Stack>
  )
}

export { DividerLabel }
export type { Props as DividerLabelProps }
