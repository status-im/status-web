import { forwardRef } from 'react'

import { Stack, styled } from 'tamagui'

import type { GetVariants } from '../types'
import type { StackProps } from '@tamagui/core'
import type { Ref } from 'react'
import type { View } from 'react-native'

type Variants = GetVariants<typeof Base>

type Props = StackProps & {
  variant?: Variants['variant']
  inverted?: boolean
}

const Shadow = (props: Props, ref: Ref<View>) => {
  const { variant = '$1', inverted = false, ...stackProps } = props

  return (
    <Base
      {...stackProps}
      ref={ref}
      variant={inverted ? undefined : variant}
      inverted={inverted ? variant : undefined}
    />
  )
}

const _Shadow = forwardRef(Shadow)

export { _Shadow as Shadow }
export type { Props as ShadowProps }

const Base = styled(Stack, {
  variants: {
    variant: {
      $1: {
        // box-shadow: 0px 2px 20px 0px hsla(218, 51%, 7%, 0.04);
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 20,
        shadowColor: 'hsla(218, 51%, 7%, 0.04)',
      },
      $2: {
        // box-shadow: 0px 4px 20px 0px hsla(218, 51%, 7%, 0.08);
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 20,
        shadowColor: 'hsla(218, 51%, 7%, 0.08)',
      },
      $3: {
        // box-shadow: 0px 8px 30px 0px hsla(218, 51%, 7%, 0.12);
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 30,
        shadowColor: 'hsla(218, 51%, 7%, 0.12)',
      },
      $4: {
        // box-shadow: 0px 12px 56px 0px hsla(218, 51%, 7%, 0.16);
        shadowOffset: { width: 0, height: 12 },
        shadowRadius: 56,
        shadowColor: 'hsla(218, 51%, 7%, 0.16)',
      },
      none: {},
    },

    inverted: {
      $1: {
        // box-shadow: 0px -2px 20px 0px hsla(218, 51%, 7%, 0.04);
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 20,
        shadowColor: 'hsla(218, 51%, 7%, 0.04)',
      },
      $2: {
        // box-shadow: 0px -4px 20px 0px hsla(218, 51%, 7%, 0.08);
        shadowOffset: { width: 0, height: -4 },
        shadowRadius: 20,
        shadowColor: 'hsla(218, 51%, 7%, 0.08)',
      },
      $3: {
        // box-shadow: 0px -8px 30px 0px hsla(218, 51%, 7%, 0.12);
        shadowOffset: { width: 0, height: -8 },
        shadowRadius: 30,
        shadowColor: 'hsla(218, 51%, 7%, 0.12)',
      },
      $4: {
        // box-shadow: 0px 12px 56px 0px hsla(218, 51%, 7%, 0.16);
        shadowOffset: { width: 0, height: 12 },
        shadowRadius: 56,
        shadowColor: 'hsla(218, 51%, 7%, 0.16)',
      },
      none: {},
    },
  } as const,

  defaultVariants: {
    variant: '$1',
  },
})
