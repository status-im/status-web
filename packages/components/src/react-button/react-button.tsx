import { forwardRef } from 'react'

import { AddReactionIcon } from '@status-im/icons/20'
import {
  AngryIcon,
  LaughIcon,
  LoveIcon,
  SadIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from '@status-im/icons/reactions'
import { Stack, styled } from '@tamagui/core'

import { Paragraph } from '../typography'

import type { GetProps } from '@tamagui/core'
import type { Ref } from 'react'
import type { PressableProps } from 'react-native'

const Button = styled(Stack, {
  name: 'ReactButton',
  accessibilityRole: 'button',

  cursor: 'pointer',
  userSelect: 'none',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  animation: 'fast',
  space: 4,

  variants: {
    variant: {
      outline: {
        borderColor: '$neutral-10',
        hoverStyle: { borderColor: '$neutral-30' },
        pressStyle: {
          backgroundColor: '$neutral-10',
          borderColor: '$neutral-20',
        },
      },

      ghost: {
        borderColor: 'transparent',
        hoverStyle: { backgroundColor: '$neutral-10' },
        pressStyle: { backgroundColor: '$neutral-20' },
      },
    },

    selected: {
      true: {
        backgroundColor: '$neutral-10',
        borderColor: '$neutral-30',
      },
    },

    size: {
      40: {
        borderRadius: 12,
        width: 40,
        height: 40,
      },

      32: {
        borderRadius: 10,
        width: 32,
        height: 32,
      },

      compact: {
        borderRadius: 8,
        minWidth: 36,
        height: 24,
        paddingHorizontal: 8,
      },
    },
  } as const,
})

type ButtonProps = GetProps<typeof Button>

export const REACTIONS = {
  love: LoveIcon,
  laugh: LaughIcon,
  'thumbs-up': ThumbsUpIcon,
  'thumbs-down': ThumbsDownIcon,
  sad: SadIcon,
  angry: AngryIcon,
  add: AddReactionIcon,
} as const

interface Props extends PressableProps {
  icon: keyof typeof REACTIONS
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  // FIXME: use aria-selected
  selected?: boolean
  count?: number
  // FIXME: update to latest RN
  'aria-expanded'?: boolean
  'aria-selected'?: boolean
}

const ReactButton = (props: Props, ref: Ref<HTMLButtonElement>) => {
  const {
    icon,
    variant = 'outline',
    size = 40,
    count,
    ...pressableProps
  } = props

  const Icon = REACTIONS[icon]

  const selected =
    props.selected || props['aria-expanded'] || props['aria-selected']

  return (
    <Button
      {...(pressableProps as any)}
      ref={ref}
      variant={variant}
      size={size}
      selected={selected}
    >
      <Icon color="$neutral-100" />
      {count && (
        <Paragraph weight="medium" variant="smaller" whiteSpace="nowrap">
          {count}
        </Paragraph>
      )}
    </Button>
  )
}

const _ReactButton = forwardRef(ReactButton)

export { _ReactButton as ReactButton }
export type { Props as ReactButtonProps }
