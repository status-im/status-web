import { styled, Text } from '@tamagui/core'
import { getFontSized } from '@tamagui/get-font-sized'

import type { GetProps } from '@tamagui/core'

export const SizableText = styled(Text, {
  name: 'SizableText',
  fontFamily: '$body',

  variants: {
    size: getFontSized,
  } as const,

  defaultVariants: {
    size: '$true',
  },
})

export type SizableTextProps = GetProps<typeof SizableText>
