import { cloneElement } from 'react'

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
import { XStack } from 'tamagui'

import { Paragraph } from '../../typography'

import type React from 'react'

// import { Pressable } from 'react-native'

const ReactButton = styled(Stack, {
  name: 'ReactButton',
  accessibilityRole: 'button',

  cursor: 'pointer',
  userSelect: 'none',
  borderRadius: 8,
  display: 'inline-flex',
  flexDirection: 'row',
  space: 4,
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  minWidth: 36,
  height: 24,
  paddingHorizontal: 8,
  borderWidth: 1,
  borderColor: '$neutral-20',

  hoverStyle: {
    borderColor: '$neutral-30',
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

interface Props {
  icon: React.ReactElement
  count: number
  selected?: boolean
}

const ReactionButton = (props: Props) => {
  const { count, selected, icon } = props

  return (
    <ReactButton selected={selected}>
      {cloneElement(icon, { color: '$neutral-100' })}
      <Paragraph weight="medium" variant="smaller" whiteSpace="nowrap">
        {count}
      </Paragraph>
    </ReactButton>
  )
}

export const Reactions = (props: Props) => {
  const {} = props

  return (
    <XStack space={8}>
      <ReactionButton count={1} icon={<LoveIcon />} selected />
      <ReactionButton count={10} icon={<ThumbsUpIcon />} />
      <ReactionButton count={99} icon={<ThumbsDownIcon />} />
      <ReactionButton count={100} icon={<LaughIcon />} />
      <ReactionButton count={100} icon={<SadIcon />} />
      <ReactionButton count={100} icon={<AngryIcon />} />
      <ReactionButton icon={<AddReactionIcon />} />
    </XStack>
  )
}
