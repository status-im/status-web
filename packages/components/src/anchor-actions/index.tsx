import { Stack } from 'tamagui'

import { DynamicButton } from '../dynamic-button'

type Props = {
  scrolled: boolean
}

const AnchorActions = (props: Props) => {
  const { scrolled } = props

  return (
    <Stack flexDirection="row" space={8}>
      {scrolled && <DynamicButton type="mention" count={1} />}
      {scrolled && <DynamicButton type="notification" count={0} />}
    </Stack>
  )
}

export { AnchorActions }
