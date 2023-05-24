import { createElement } from 'react'

import { getColorWithOpacity } from '@status-im/components/utils/get-color-with-opacity'
import { Stack, styled } from '@tamagui/core'

import { Text } from '../text'
import { tokens } from '../tokens'

import type { TextProps } from '../text'
import type { IconProps } from '@status-im/icons'
import type { ColorTokens, StackStyleProps } from '@tamagui/core'
import type { ComponentType } from 'react'

type Props = {
  size: 32 | 24
  icon?: string | ComponentType<IconProps>
  label?: string
  selected?: boolean
  disabled?: boolean
  onPress?: () => void
  color?: ColorTokens | string
}

// TypeGuard for ColorTokens
function isColorTokens(value: string | ColorTokens): value is ColorTokens {
  return typeof value === 'string' && value.startsWith('$')
}

const textSizes: Record<NonNullable<Props['size']>, TextProps['size']> = {
  '32': 15,
  '24': 13,
}

const iconSizes: Record<NonNullable<Props['size']>, IconProps['size']> = {
  '32': 20,
  '24': 12,
}

const getCustomStyles = (props: Props): StackStyleProps | null => {
  const { color: colorFromProps, icon } = props

  if (!colorFromProps) {
    return null
  }

  let color: string | ColorTokens = colorFromProps

  if (isColorTokens(colorFromProps)) {
    color =
      tokens.color[colorFromProps.replace('$', '') as keyof typeof tokens.color]
        ?.val
  }

  if (icon) {
    return {
      borderColor: getColorWithOpacity(color!, 0.2),
      backgroundColor: getColorWithOpacity(color!, 0.1),
      pressStyle: {
        backgroundColor: getColorWithOpacity(color, 0.2),
        borderColor: getColorWithOpacity(color, 0.3),
      },
      hoverStyle: {
        backgroundColor: getColorWithOpacity(color, 0.2),
        borderColor: getColorWithOpacity(color, 0.3),
      },
    }
  }

  return {
    borderColor: getColorWithOpacity(color, 0.2),
    pressStyle: {
      borderColor: getColorWithOpacity(color, 0.3),
    },
    hoverStyle: {
      borderColor: getColorWithOpacity(color, 0.3),
    },
  }
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

    return createElement(icon, { size: iconSizes[size] })
  }

  return (
    <Base
      size={size}
      selected={selected}
      disabled={disabled}
      iconOnly={Boolean(icon && !label)}
      onPress={() => onPress?.()}
      {...getCustomStyles(props)}
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

const Base = styled(Stack, {
  tag: 'tag',
  name: 'Tag',
  accessibilityRole: 'button',

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: '$neutral-20',
  borderRadius: '$full',

  animation: 'fast',
  cursor: 'pointer',

  hoverStyle: {
    borderColor: '$neutral-30',
  },
  pressStyle: {
    borderColor: '$neutral-30',
  },

  variants: {
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
