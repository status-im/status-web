import { styled } from '@tamagui/core'

import { SizableText } from './sizableText'

export const Heading = styled(SizableText, {
  name: 'Heading',
  fontFamily: '$inter',
  color: '$neutral-100',
  fontWeight: '600',

  variants: {
    heading: {
      h1: {
        fontSize: 27,
        lineHeight: 32,
        letterSpacing: '-0.021em',
      },
      h2: {
        fontSize: 19,
        lineHeight: 26,
        letterSpacing: '-0.016em',
      },
    },
  },

  defaultVariants: {
    // note tamagui uses a generic "true" token that your sizes should set to be the same as the default on your scale
    size: '$true',
    heading: 'h1',
  },
})
