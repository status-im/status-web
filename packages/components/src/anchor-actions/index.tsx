import { Stack } from 'tamagui'

import { DynamicButton } from '../dynamic-button'

// type Props = {}

const AnchorActions = () => {
  return (
    <Stack flexDirection="row" space={8}>
      <DynamicButton type="mention" count={1} />
      <DynamicButton type="notification" count={0} />
    </Stack>
  )
}

export { AnchorActions }
