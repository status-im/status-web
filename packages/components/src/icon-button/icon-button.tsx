import { cloneElement } from 'react'

import { Stack, styled } from '@tamagui/core'

import type React from 'react'

const Base = styled(Stack, {
  name: 'IconButton',
  accessibilityRole: 'button',

  cursor: 'pointer',
  userSelect: 'none',
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: 'fast',

  width: 30,
  height: 30,
  borderWidth: 1,
  padding: 4,
  backgroundColor: '$neutral-10',
  borderColor: '$neutral-10',

  hoverStyle: {
    backgroundColor: '$neutral-20',
  },

  pressStyle: {
    backgroundColor: '$neutral-20',
  },

  variants: {
    selected: {
      true: {
        backgroundColor: '$neutral-30',
        borderColor: '$neutral-30',
      },
    },

    transparent: {
      true: {
        backgroundColor: 'transparent',
        borderColor: '$neutral-20',

        hoverStyle: {
          backgroundColor: 'transparent',
          borderColor: '$neutral-30',
        },

        pressStyle: {
          backgroundColor: 'transparent',
          borderColor: '$neutral-30',
        },
      },
    },
    blurred: {
      true: {
        backgroundColor: 'transparent',
        borderColor: '$neutral-80-opa-10',

        hoverStyle: {
          backgroundColor: 'transparent',
          borderColor: '$neutral-80-opa-20',
        },

        pressStyle: {
          backgroundColor: 'transparent',
          borderColor: '$neutral-80-opa-20',
        },
      },
    },
  } as const,
})

interface Props {
  icon: React.ReactElement
  onPress?: () => void
  selected?: boolean
  transparent?: boolean
  blurred?: boolean
  // FIXME: enforce aria-label for accessibility
  // 'aria-label'?: string
}

const IconButton = (props: Props) => {
  const { icon, transparent, selected, blurred, onPress } = props

  return (
    <Base
      selected={selected}
      onPress={onPress}
      transparent={transparent}
      blurred={blurred}
    >
      {cloneElement(icon, {
        color: selected ? '$neutral-100' : '$neutral-50',
        size: 20,
      })}
    </Base>
  )
}

export { IconButton }
export type { Props as IconButtonProps }
