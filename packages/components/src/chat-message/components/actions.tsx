import { Stack } from 'tamagui'

import { Paragraph } from '../../typography'

interface Props {
  onClick: VoidFunction
}

export const Actions = (_props: Props) => {
  return (
    <Stack position="absolute" top={0} right={0}>
      <Paragraph>actions</Paragraph>
    </Stack>
  )
}
