import React from 'react'

import { emojis, ReactionPopover } from '~/src/components/reaction-popover'
import { ReactionIcon } from '~/src/icons/reaction-icon'
import { Reaction } from '~/src/protocol/use-messages'
import { styled } from '~/src/styles/config'
import { Flex, Image, Text } from '~/src/system'

import type { Reactions } from '~/src/protocol/use-messages'

interface Props {
  reactions: Reactions
  onClick: (reaction: Reaction) => void
}

export const MessageReactions = (props: Props) => {
  const { reactions, onClick } = props

  const hasReaction = Object.values(reactions).some(
    reaction => reaction.count !== 0
  )

  if (hasReaction === false) {
    return null
  }

  return (
    <Flex align="center" css={{ paddingTop: 6 }} gap={1}>
      {Object.entries(reactions).map(([reaction, value]) => (
        <Reaction
          key={reaction}
          emoji={emojis[reaction as Reaction]}
          reaction={value}
          onClick={() => onClick(reaction as Reaction)}
        />
      ))}

      <ReactionPopover reactions={reactions} onClick={onClick}>
        <AddReactionButton aria-label="Add Reaction">
          <ReactionIcon width={16} height={16} />
        </AddReactionButton>
      </ReactionPopover>
    </Flex>
  )
}

const AddReactionButton = styled('button', {
  color: '$gray-1',
  width: 16,
  height: 16,

  "&[aria-expanded='true']": {
    color: '$primary-1',
  },
})

interface ReactionProps {
  emoji: {
    url: string
    symbol: string
  }
  reaction: Props['reactions']['smile']
  onClick: VoidFunction
}

const Reaction = (props: ReactionProps) => {
  const { emoji, reaction, onClick } = props

  if (reaction.count === 0) {
    return null
  }

  return (
    <Button
      onClick={onClick}
      active={reaction.me}
      aria-label={`${emoji.symbol}, ${reaction.count} reaction, press to react`}
    >
      <Image width={14} src={emoji.url} alt={emoji.symbol} />
      <Text size="12">{reaction.count}</Text>
    </Button>
  )
}

const Button = styled('button', {
  padding: '0px 8px 0px 3px',
  boxShadow: '0px 4px 12px rgba(0, 34, 51, 0.08)',
  background: '$accent-8',
  borderRadius: '2px 10px 10px 10px',
  minWidth: 36,
  height: 20,
  display: 'inline-flex',
  gap: 4,
  alignItems: 'center',

  variants: {
    active: {
      true: {
        border: '1px solid $primary-1',
        background: '$primary-3',
      },
    },
  },
})
