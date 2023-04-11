import { forwardRef } from 'react'

import { styled, Text as BaseText } from '@tamagui/core'

import type { ColorTokens, GetProps } from '@tamagui/core'
import type { Ref } from 'react'
import type { Text as RNText } from 'react-native'

type Variants = GetProps<typeof Base>
type Type = NonNullable<Variants['type']>
type Weight = NonNullable<Variants['weight']>

type Props = {
  children: React.ReactNode
  color?: ColorTokens
  truncate?: boolean
  wrap?: false
} & (
  | { size: 64; weight?: Weight }
  | { size: 27; weight?: Weight }
  | { size: 19; weight?: Weight }
  | { size: 15; weight?: Weight; type?: Type }
  | { size: 13; weight?: Weight; type?: Type }
  | { size: 11; weight?: Weight; type?: Type; uppercase?: boolean }
)

// TODO: monospace should be used only for variant. Extract to separate <Address> component?
// TODO: Ubuntu Mono should be used only for code snippets. Extract to separate <Code> component?
const Text = (props: Props, ref: Ref<RNText>) => {
  const { color = '$neutral-100', ...rest } = props
  return <Base {...rest} ref={ref} color={color} />
}

export type TextSizeVariant<V extends string | number | undefined> = Record<
  NonNullable<V>,
  Props['size']
>

export const TEXT_SIZES: TextSizeVariant<Props['size']> = {
  '40': 15,
  '32': 15,
  '24': 13,
}

const Base = styled(BaseText, {
  name: 'Text',

  variants: {
    type: {
      default: {
        fontFamily: '$sans',
      },
      monospace: {
        fontFamily: '$mono',
      },
    },

    size: {
      64: {
        fontSize: 64,
        lineHeight: 68,
        letterSpacing: -0.02,
      },
      27: {
        fontSize: 27,
        lineHeight: 32,
        letterSpacing: -0.021,
      },
      19: {
        fontSize: 19,
        lineHeight: 26,
        letterSpacing: -0.016,
      },
      15: {
        fontSize: 15,
        lineHeight: 22,
        letterSpacing: -0.009,
      },
      13: {
        fontSize: 13,
        lineHeight: 18,
        letterSpacing: -0.003,
      },
      11: {
        fontSize: 11,
        lineHeight: 18,
        letterSpacing: -0.003,
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

    uppercase: {
      true: {
        textTransform: 'uppercase',
      },
    },

    wrap: {
      false: {
        whiteSpace: 'nowrap',
      },
    },

    truncate: {
      true: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
        maxWidth: '100%',
        minWidth: 0,
      },
    },
  } as const,

  defaultVariants: {
    type: 'default',
    weight: 'regular',
  },
})

const _Text = forwardRef(Text)

export { _Text as Text }
export type { Props as TextProps }
