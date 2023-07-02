import { createElement } from 'react'

import { styled } from '@tamagui/core'
import { View } from 'react-native'

import { getColorWithOpacity } from '../../utils/get-color-with-opacity'
import { Text } from '../text'

import type { TextProps } from '../text'
import type { IconProps } from '@status-im/icons'
import type { ColorTokens } from '@tamagui/core'
import type { ComponentType } from 'react'
import type { PressableProps } from 'react-native'

type Props = {
  size: 32 | 24
  icon?: string | ComponentType<IconProps>
  label?: string
  selected?: boolean
  disabled?: boolean
  onPress?: PressableProps['onPress']
  color?: ColorTokens | `#${string}`
}

const textSizes: Record<NonNullable<Props['size']>, TextProps['size']> = {
  '32': 15,
  '24': 13,
}

const iconSizes: Record<NonNullable<Props['size']>, IconProps['size']> = {
  '32': 20,
  '24': 12,
}

const Tag = (props: Props) => {
  const { size, icon, label, selected, disabled, onPress, color } = props

  const renderIcon = () => {
    if (!icon) {
      return null
    }

    if (typeof icon === 'string') {
      return <Text size={textSizes[size]}>{icon}</Text>
    }

    return createElement(icon, {
      size: iconSizes[size],
      color,
    })
  }

  return (
    <Base
      size={size}
      selected={selected}
      disabled={disabled}
      iconOnly={Boolean(icon && !label)}
      variant={color}
      {...(onPress && {
        role: 'button',
        onPress,
      })}
      onHoverIn={e => {
        console.log('onHoverIn', e)
      }}
    >
      {renderIcon()}
      {label && (
        <Text size={textSizes[size]} weight="medium" {...(color && { color })}>
          {label}
        </Text>
      )}
    </Base>
  )
}

export { Tag }
export type { Props as TagProps }

const Base = styled(View, {
  name: 'Tag',

  userSelect: 'none',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: '$neutral-20',
  borderRadius: '$full',
  backgroundColor: '$white-100',

  animation: 'fast',

  hoverStyle: {
    borderColor: '$neutral-30',
    backgroundColor: '$neutral-5',
  },
  pressStyle: {
    borderColor: '$neutral-30',
    backgroundColor: '$neutral-5',
  },

  variants: {
    variant: (token: ColorTokens | string, { tokens }) => {
      const color = tokens.colors[token as keyof typeof tokens.colors]
        ? tokens.colors[token as keyof typeof tokens.colors].val
        : token

      return {
        borderColor: getColorWithOpacity(color, 0.2),
        pressStyle: {
          borderColor: getColorWithOpacity(color, 0.3),
          backgroundColor: getColorWithOpacity(color, 0.1),
        },
        hoverStyle: {
          borderColor: getColorWithOpacity(color, 0.3),
          backgroundColor: getColorWithOpacity(color, 0.1),
        },
      }
    },

    size: {
      32: {
        height: 32,
        minWidth: 32,
        paddingHorizontal: 12,
        gap: 6,
      },
      24: {
        height: 24,
        minWidth: 24,
        paddingHorizontal: 8,
        gap: 5,
      },
    },
    selected: {
      true: {
        backgroundColor: '$primary-50-opa-10',
        borderColor: '$primary-50',

        hoverStyle: {
          backgroundColor: '$primary-50-opa-20',
          borderColor: '$primary-60',
        },
        pressStyle: {
          backgroundColor: '$primary-50-opa-20',
          borderColor: '$primary-60',
        },
      },
    },

    disabled: {
      true: {
        opacity: 0.3,
        cursor: 'default',
      },
    },

    iconOnly: {
      true: {
        paddingHorizontal: 0,
      },
    },
  },
})
