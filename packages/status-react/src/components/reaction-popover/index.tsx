import React from 'react'

import { styled } from '~/src/styles/config'
import { Flex, Image, Popover, PopoverTrigger } from '~/src/system'

interface Props {
  children: React.ReactElement
  onClick: (emoji: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const ReactionPopover = (props: Props) => {
  const { children, onClick, ...popoverProps } = props

  return (
    <PopoverTrigger {...popoverProps}>
      {children}
      <Popover side="top" align="center" sideOffset={6}>
        <Flex gap={1} css={{ padding: 8 }}>
          <Button onClick={() => onClick('')} active={false}>
            <Image
              width={30}
              src="https://twemoji.maxcdn.com/v/latest/svg/2764.svg"
              alt="React with ❤️"
            />
          </Button>
          <Button onClick={() => onClick('')} active>
            <Image
              width={30}
              src="https://twemoji.maxcdn.com/v/latest/svg/1f44d.svg"
              alt="React with 👍️"
            />
          </Button>
          <Button onClick={() => onClick('')} active>
            <Image
              width={30}
              src="https://twemoji.maxcdn.com/v/latest/svg/1f44e.svg"
              alt="React with 👎️"
            />
          </Button>
          <Button onClick={() => onClick('')} active={false}>
            <Image
              width={30}
              src="https://twemoji.maxcdn.com/v/latest/svg/1f606.svg"
              alt="React with 😆"
            />
          </Button>
          <Button onClick={() => onClick('')} active={false}>
            <Image
              width={30}
              src="https://twemoji.maxcdn.com/v/latest/svg/1f62d.svg"
              alt="React with 😭"
            />
          </Button>
          <Button onClick={() => onClick('')} active={false}>
            <Image
              width={30}
              src="https://twemoji.maxcdn.com/v/latest/svg/1f621.svg"
              alt="React with 😡"
            />
          </Button>
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
