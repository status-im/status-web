import { Stack } from '@tamagui/core'

import type { EmojiProps } from './EmojiProps'
import type React from 'react'

export function themed(Component: React.ElementType) {
  const useWrapped = (props: EmojiProps) => {
    const { size, hasBackground, sizeBackground = 24, ...rest } = props

    if (hasBackground) {
      return (
        <Stack
          width={sizeBackground}
          height={sizeBackground}
          borderRadius="50%"
          backgroundColor="$turquoise-50-opa-10"
          justifyContent="center"
          alignItems="center"
        >
          <Component {...rest} size={size} />
        </Stack>
      )
    }
    return <Component {...rest} size={size} />
  }
  return useWrapped
}
