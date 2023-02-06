import React, { useState } from 'react'

import {
  emojis,
  ReactionPopover,
} from '../../../../components/reaction-popover'
import { ReactionIcon } from '../../../../icons/reaction-icon'
import { useAccount } from '../../../../protocol'
import { styled } from '../../../../styles/config'
import { Flex, Image, Text } from '../../../../system'

import type { Reaction, Reactions } from '../../../../protocol'

interface Props {
  reactions: Reactions
  onClick: (reaction: Reaction) => void
}

export const MessageReactions = (props: Props) => {
  const { reactions, onClick } = props

  const { isMember } = useAccount()

  const [open, setOpen] = useState(false)

  const hasReaction = Object.values<Set<string>>(reactions).some(
    value => value.size > 0
  )

  if (hasReaction === false) {
    return null
  }

  const handlePopoverClick = (reaction: Reaction) => {
    onClick(reaction)
    setOpen(false)
  }

  return (
    <Flex align="center" css={{ paddingTop: 6 }} gap={1}>
      {Object.entries(emojis).map(([type, emoji]) => (
        <ReactionButton
          key={type}
          emoji={emoji}
          value={reactions[type as Reaction]}
          onClick={() => onClick(type as Reaction)}
        />
      ))}

      {isMember && (
        <ReactionPopover
          open={open}
          onOpenChange={setOpen}
          reactions={reactions}
          onClick={handlePopoverClick}
        >
          <AddReactionButton aria-label="Add Reaction">
            <ReactionIcon width={16} height={16} />
          </AddReactionButton>
        </ReactionPopover>
      )}
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
  value: Reactions['LOVE']
  onClick: VoidFunction
}

const ReactionButton = (props: ReactionProps) => {
  const { emoji, value, onClick } = props

  const { account } = useAccount()

  const count = value.size
  const me = account ? value.has('0x' + account.publicKey) : false

  if (value.size === 0) {
    return null
  }

  return (
    <Button
      onClick={onClick}
      active={me}
      aria-label={`${emoji.symbol}, ${count} reaction, press to react`}
    >
      <Image width={14} src={emoji.url} alt={emoji.symbol} />
      <Text size="12">{count}</Text>
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
