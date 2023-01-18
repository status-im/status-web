import { Stack, styled, Text } from '@tamagui/core'

// import { Pressable } from 'react-native'
import type React from 'react'

const Base = styled(Stack, {
  name: 'IconButton',
  accessibilityRole: 'button',

  cursor: 'pointer',
  userSelect: 'none',
  borderRadius: 10,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',

  width: 31,
  height: 31,
  borderWidth: 1,
  backgroundColor: '$neutral-10',
  borderColor: '$neutral-10',

  hoverStyle: {
    backgroundColor: '$neutral-20',
  },

  variants: {
    selected: {
      true: {
        backgroundColor: '$neutral-30',
        borderColor: '$neutral-30',
      },
    },
  } as const,
})

const Icon = styled(Text, {
  color: '$neutral-50',
  width: 20,
  height: 20,

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
}

const IconButton = (props: Props) => {
  const { icon, selected, onPress } = props

  return (
    <Base selected={selected} onPress={onPress}>
      <Icon selected={selected}>{icon}</Icon>
    </Base>
  )
}

export { IconButton }
export type { Props as IconButtonProps }
