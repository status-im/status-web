import { createElement, forwardRef } from 'react'

import { Stack, styled } from 'tamagui'

import { Text } from '../text'

import type { GetVariants, MapVariant } from '../types'
import type { IconProps } from '@status-im/icons'
import type { Ref } from 'react'
import type { View } from 'react-native'

type Variants = GetVariants<typeof Base>

type Props = {
  variant?: Variants['variant']
} & (
  | {
      icon: React.ComponentType<IconProps>
      symbol?: never
    }
  | {
      symbol: string
      icon?: never
    }
)

const Shortcut = (props: Props, ref: Ref<View>) => {
  const { variant = 'primary' } = props

  const color = textColors[variant]

  const renderContent = () => {
    if ('symbol' in props) {
      return (
        <Text size={11} weight="medium" color={color}>
          {props.symbol}
        </Text>
      )
    }

    return createElement(props.icon, { color, size: 12 })
  }

  return (
    <Base variant={variant} {...props} ref={ref}>
      {renderContent()}
    </Base>
  )
}

const _Shortcut = forwardRef(Shortcut)

export { _Shortcut as Shortcut }
export type { Props as ShortcutProps }

const textColors: MapVariant<typeof Base, 'variant'> = {
  primary: '$white-100',
  secondary: '$neutral-50',
  gray: '$neutral-50',
}

const Base = styled(Stack, {
  width: 16,
  height: 16,
  flexShrink: 0,
  borderRadius: '$6',
  borderWidth: 1,
  justifyContent: 'center',
  alignItems: 'center',

  variants: {
    variant: {
      primary: {
        backgroundColor: '$blue-50',
        borderColor: '$blue-60',
      },
      secondary: {
        backgroundColor: '$neutral-10',
        borderColor: '$neutral-20',
      },
      gray: {
        borderColor: '$neutral-10',
      },
    },
  } as const,

  defaultVariants: {
    variant: 'primary',
  },
})
