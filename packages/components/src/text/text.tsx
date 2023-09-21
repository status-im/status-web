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
  color?: ColorTokens | string
  truncate?: boolean
  wrap?: false
} & (
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
      27: {
        fontSize: 27,
        lineHeight: 32,
        letterSpacing: -0.567,
      },
      19: {
        fontSize: 19,
        lineHeight: 28,
        letterSpacing: -0.304,
      },
      15: {
        fontSize: 15,
        lineHeight: 21.75,
        letterSpacing: -0.135,
      },
      13: {
        fontSize: 13,
        lineHeight: 18.2,
        letterSpacing: -0.039,
      },
      11: {
        fontSize: 11,
        lineHeight: 15.62,
        letterSpacing: -0.055,
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
