import React from 'react'

import { useAccount } from '../../protocol'
import { styled } from '../../styles/config'
import { Flex, Image, Popover, PopoverTrigger } from '../../system'

import type { Reaction, Reactions } from '../../protocol'

interface Props {
  children: React.ReactElement
  reactions: Reactions
  onClick: (reaction: Reaction) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const emojis: Record<Reaction, { url: string; symbol: string }> = {
  LOVE: {
    symbol: '❤️',
    url: 'https://twemoji.maxcdn.com/v/latest/svg/2764.svg',
  },
  THUMBS_UP: {
    symbol: '👍️',
    url: 'https://twemoji.maxcdn.com/v/latest/svg/1f44d.svg',
  },
  THUMBS_DOWN: {
    symbol: '👎️',
    url: 'https://twemoji.maxcdn.com/v/latest/svg/1f44e.svg',
  },
  LAUGH: {
    symbol: '😆',
    url: 'https://twemoji.maxcdn.com/v/latest/svg/1f606.svg',
  },
  SAD: {
    symbol: '😭',
    url: 'https://twemoji.maxcdn.com/v/latest/svg/1f62d.svg',
  },
  ANGRY: {
    symbol: '😡',
    url: 'https://twemoji.maxcdn.com/v/latest/svg/1f621.svg',
  },
}

export const ReactionPopover = (props: Props) => {
  const { reactions, children, onClick, ...popoverProps } = props

  const { account } = useAccount()

  return (
    <PopoverTrigger {...popoverProps}>
      {children}
      <Popover side="top" align="center" sideOffset={6}>
        <Flex gap={1} css={{ padding: 8 }}>
          {Object.entries(emojis).map(([type, emoji]) => {
            const value = reactions[type as Reaction]
            const me = account ? value.has('0x' + account.publicKey) : false

            return (
              <Button
                key={type}
                onClick={() => onClick(type as Reaction)}
                active={me}
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
