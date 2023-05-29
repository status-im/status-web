import { createElement } from 'react'

import { Stack, styled } from '@tamagui/core'

import { Text } from '../text'

import type { TextProps } from '../text'
import type { IconProps } from '@status-im/icons'
import type { ComponentType } from 'react'

type Props = {
  size: 32 | 24
  icon?: string | ComponentType<IconProps>
  label?: string
  selected?: boolean
  disabled?: boolean
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
  const { size, icon, label, selected, disabled } = props

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
    >
      {renderIcon()}
      {label && (
        <Text size={textSizes[size]} weight="medium">
          {label}
        </Text>
      )}
    </Base>
  )
}

export { Tag }
export type { Props as TagProps }

const Base = styled(Stack, {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: '$neutral-20',
  borderRadius: '$full',
  backgroundColor: '$white-100',

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
