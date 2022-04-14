import React from 'react'

import { styled } from '~/src/styles/config'
import { Flex, Image, Popover, PopoverTrigger } from '~/src/system'

import type { Reaction, Reactions } from '~/src/protocol/use-messages'

interface Props {
  children: React.ReactElement
  reactions: Reactions
  onClick: (reaction: Reaction) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const emojis: Record<Reaction, { url: string; symbol: string }> = {
  heart: {
    symbol: '❤️',
    url: 'https://twemoji.maxcdn.com/v/latest/svg/2764.svg',
  },
  'thumbs-up': {
    symbol: '👍️',
    url: 'https://twemoji.maxcdn.com/v/latest/svg/1f44d.svg',
  },
  'thumbs-down': {
    symbol: '👎️',
    url: 'https://twemoji.maxcdn.com/v/latest/svg/1f44e.svg',
  },
  smile: {
    symbol: '😆',
    url: 'https://twemoji.maxcdn.com/v/latest/svg/1f606.svg',
  },
  sad: {
    symbol: '😭',
    url: 'https://twemoji.maxcdn.com/v/latest/svg/1f62d.svg',
  },
  angry: {
    symbol: '😡',
    url: 'https://twemoji.maxcdn.com/v/latest/svg/1f621.svg',
  },
}

export const ReactionPopover = (props: Props) => {
  const { reactions, children, onClick, ...popoverProps } = props

  return (
    <PopoverTrigger {...popoverProps}>
      {children}
      <Popover side="top" align="center" sideOffset={6}>
        <Flex gap={1} css={{ padding: 8 }}>
          {Object.entries(reactions).map(([reaction, value]) => {
            const emoji = emojis[reaction as Reaction]
            return (
              <Button
                key={reaction}
                onClick={() => onClick(reaction as Reaction)}
                active={value.me}
                aria-label={`React with ${emoji.symbol}`}
              >
                <Image width={30} src={emoji.url} alt={emoji.symbol} />
              </Button>
            )
          })}
        </Flex>
      </Popover>
    </PopoverTrigger>
  )
}

const Button = styled('button', {
  width: 40,
  height: 40,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  borderRadius: '$2',

  '&:hover': {
    background: '$accent-8',
  },

  variants: {
    active: {
      true: {
        border: '1px solid $primary-1',
        background: '$primary-3',
      },
    },
  },
})
