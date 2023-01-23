import { Stack, styled, Text } from '@tamagui/core'

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
  backgroundColor: '$neutral-10',
  borderColor: '$neutral-10',

  hoverStyle: {
    backgroundColor: '$neutral-20',
  },

  pressStyle: {
    backgroundColor: '$neutral-20',
  },

  variants: {
    noBackground: {
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
    selected: {
      true: {
        backgroundColor: '$neutral-30',
        borderColor: '$neutral-30',
      },
    },
  } as const,
})

const Icon = styled(Text, {
  // color: '$neutral-50',
  width: 'auto',
  height: 'auto',

  justifyContent: 'center',
  lineHeight: 0,

  alignSelf: 'center',
  color: 'white',

  hoverStyle: {
    color: '$neutral-100',
  },

  variants: {
    selected: {
      true: {
        color: '$neutral-100',
      },
    },
  } as const,
})

interface Props {
  icon: React.ReactElement
  onPress?: () => void
  selected?: boolean
  noBackground?: boolean
}

const IconButton = (props: Props) => {
  const { icon, noBackground, selected, onPress } = props

  return (
    <Base selected={selected} onPress={onPress} noBackground={noBackground}>
      {icon}
    </Base>
  )
}

export { IconButton }
export type { Props as IconButtonProps }
