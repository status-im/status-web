import { Stack } from 'tamagui'

import { Text } from '../../typography'

interface Props {}

export const Actions = (props: Props) => {
  const {} = props

  return (
    <Stack position="absolute" top={0} right={0}>
      <Text>actions</Text>
    </Stack>
  )
}
