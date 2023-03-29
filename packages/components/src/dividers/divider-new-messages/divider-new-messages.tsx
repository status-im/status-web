import { Stack } from '@tamagui/core'
import { LinearGradient } from '@tamagui/linear-gradient'

import { Text } from '../../text'

import type { ColorTokens } from '@tamagui/core'

type Props = {
  color: ColorTokens
}

const DividerNewMessages = (props: Props) => {
  const { color } = props

  return (
    <Stack position="relative" height={42} backgroundColor={color}>
      <LinearGradient height={42} colors={['$white-95', '$white-100']}>
        <Stack paddingHorizontal={56} paddingVertical={12} zIndex={10}>
          <Text size={13} weight="medium" color={color}>
            New Messages
          </Text>
        </Stack>
      </LinearGradient>
    </Stack>
  )
}

export { DividerNewMessages }
