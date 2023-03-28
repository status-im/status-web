import { Stack } from '@tamagui/core'
import { LinearGradient } from '@tamagui/linear-gradient'

import { Text } from '../../text'

import type { ColorTokens } from '@tamagui/core'

type Props = {
  color: ColorTokens
}

const NewMessages = (props: Props) => {
  const { color = '$blue-50' } = props

  return (
    <Stack position="relative" height={42} backgroundColor={color}>
      <LinearGradient
        height={42}
        colors={['rgba(255, 255, 255, 0.9)', 'white']}
      >
        <Stack paddingHorizontal={56} paddingVertical={12}>
          <Text size={13} weight="medium" color={color}>
            New Messages
          </Text>
        </Stack>
      </LinearGradient>
    </Stack>
  )
}

export { NewMessages }
