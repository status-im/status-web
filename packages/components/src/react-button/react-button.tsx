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
import { styled } from '@tamagui/core'
import { Stack } from '@tamagui/web'

import { Text } from '../text'

import type { ReactionType } from '../messages/types'
import type { PressableProps } from '../types'
import type { Ref } from 'react'

export const REACTIONS_ICONS = {
  love: LoveIcon,
  laugh: LaughIcon,
  'thumbs-up': ThumbsUpIcon,
  'thumbs-down': ThumbsDownIcon,
  sad: SadIcon,
  angry: AngryIcon,
  add: AddReactionIcon,
} as const

type Props = PressableProps & {
  type: ReactionType
  selected?: boolean
  count?: number
  // FIXME: update to latest RN
  'aria-expanded'?: boolean
  'aria-selected'?: boolean
}

const ReactButton = (props: Props, ref: Ref<HTMLButtonElement>) => {
  const { type, count, ...pressableProps } = props

  const Icon = REACTIONS_ICONS[type]

  const selected =
    props.selected || props['aria-expanded'] || props['aria-selected']

  return (
    <Button
      {...(pressableProps as unknown as object)}
      ref={ref}
      selected={selected}
    >
      <Icon color="$neutral-100" />
      {count && (
        <Text size={13} weight="medium" wrap={false}>
          {count}
        </Text>
      )}
    </Button>
  )
}

const _ReactButton = forwardRef(ReactButton)

export { _ReactButton as ReactButton }
export type { Props as ReactButtonProps }

const Button = styled(Stack, {
  name: 'ReactButton',
  tag: 'button',
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

  borderRadius: 8,
  minWidth: 36,
  height: 24,
  paddingHorizontal: 8,

  borderColor: '$neutral-20',
  hoverStyle: { borderColor: '$neutral-30' },
  pressStyle: {
    backgroundColor: '$neutral-10',
    borderColor: '$neutral-20',
  },

  variants: {
    selected: {
      true: {
        backgroundColor: '$neutral-10',
        borderColor: '$neutral-30',
      },
    },
  } as const,
})
