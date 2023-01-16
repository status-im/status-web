import { styled } from '@tamagui/core'
import { SizableText } from 'tamagui'

export const Heading = styled(SizableText, {
  name: 'Heading',
  fontFamily: '$inter',
  color: '$textPrimary',

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
    uppercase: {
      true: {
        textTransform: 'uppercase',
      },
    },
    weight: {
      regular: {
        fontWeight: '400',
      },
      medium: {
        fontWeight: '500',
      },
      semibold: {
        fontWeight: '600',
      },
    },
  } as const,
  defaultVariants: {
    // note tamagui uses a generic "true" token that your sizes should set to be the same as the default on your scale
    size: '$true',
    heading: 'h1',
  },
})

export const Paragraph = styled(SizableText, {
  name: 'Paragraph',
  fontFamily: '$inter',
  color: '$textPrimary',

  variants: {
    variant: {
      normal: {
        fontSize: 15,
        lineHeight: 22,
        letterSpacing: '-0.009em',
      },
      smaller: {
        fontSize: 13,
        lineHeight: 18,
        letterSpacing: '-0.003em',
      },
    },
    uppercase: {
      true: {
        textTransform: 'uppercase',
      },
    },
    weight: {
      regular: {
        fontWeight: '400',
      },
      medium: {
        fontWeight: '500',
      },
      semibold: {
        fontWeight: '600',
      },
    },
  } as const,
  defaultVariants: {
    // note tamagui uses a generic "true" token that your sizes should set to be the same as the default on your scale
    size: '$true',
    variant: 'normal',
    weight: 'regular',
  },
})

export const Label = styled(SizableText, {
  name: 'Label',
  fontFamily: '$inter',
  color: '$textPrimary',

  fontSize: 11,
  lineHeight: 16,
  letterSpacing: '-0.005em',

  variants: {
    uppercase: {
      true: {
        textTransform: 'uppercase',
      },
    },
    weight: {
      regular: {
        fontWeight: '400',
      },
      medium: {
        fontWeight: '500',
      },
      semibold: {
        fontWeight: '600',
      },
    },
  } as const,
  defaultVariants: {
    // note tamagui uses a generic "true" token that your sizes should set to be the same as the default on your scale
    size: '$true',
    weight: 'regular',
  },
})

export const Code = styled(SizableText, {
  name: 'Code',
  fontFamily: '$mono',
  color: '$textPrimary',

  fontSize: 11,
  lineHeight: 16,
  letterSpacing: '-0.005em',

  variants: {
    normal: {
      fontSize: 15,
      lineHeight: 22,
      letterSpacing: '-0.009em',
    },
    smaller: {
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: '-0.003em',
    },
    uppercase: {
      true: {
        textTransform: 'uppercase',
      },
    },
    weight: {
      regular: {
        fontWeight: '400',
      },
      medium: {
        fontWeight: '500',
      },
      semibold: {
        fontWeight: '600',
      },
    },
  } as const,
  defaultVariants: {
    // note tamagui uses a generic "true" token that your sizes should set to be the same as the default on your scale
    size: '$true',
    variant: 'normal',
    weight: 'regular',
  },
})
