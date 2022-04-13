import React from 'react'

import { ReactionPopover } from '~/src/components/reaction-popover'
import { ReactionIcon } from '~/src/icons/reaction-icon'
import { styled } from '~/src/styles/config'
import { Flex, Image } from '~/src/system'

interface Props {
  onClick: (reaction: string) => void
}

export const Reactions = (props: Props) => {
  const { onClick } = props

  return (
    <Flex css={{ paddingTop: 6 }} gap={1}>
      <Button
        onClick={() => onClick('')}
        active={false}
        aria-label="❤️, 1 reaction, press to react"
      >
        <Image
          width={16}
          src="https://twemoji.maxcdn.com/v/latest/svg/2764.svg"
          alt="❤️"
        />
        1
      </Button>
      <Button
        onClick={() => onClick('')}
        active={true}
        aria-label="👍️, 1 reaction, press to react"
      >
        <Image
          width={16}
          src="https://twemoji.maxcdn.com/v/latest/svg/1f44d.svg"
          alt="👍️"
        />
        2
      </Button>
      <Button
        onClick={() => onClick('')}
        active={true}
        aria-label="👎️, 1 reaction, press to react"
      >
        <Image
          width={16}
          src="https://twemoji.maxcdn.com/v/latest/svg/1f44e.svg"
          alt="👎️"
        />
        3
      </Button>
      <Button
        onClick={() => onClick('')}
        active={false}
        aria-label="😆, 1 reaction, press to react"
      >
        <Image
          width={16}
          src="https://twemoji.maxcdn.com/v/latest/svg/1f606.svg"
          alt="😆"
        />
        1
      </Button>
      <Button
        onClick={() => onClick('')}
        active={false}
        aria-label="😭, 1 reaction, press to react"
      >
        <Image
          width={16}
          src="https://twemoji.maxcdn.com/v/latest/svg/1f62d.svg"
          alt="😭"
        />
      </Button>
      <Button
        onClick={() => onClick('')}
        active={false}
        aria-label="😡, 1 reaction, press to react"
      >
        <Image
          width={16}
          src="https://twemoji.maxcdn.com/v/latest/svg/1f621.svg"
          alt="😡"
        />
      </Button>
      <ReactionPopover
        onClick={emoji => {
          console.log(emoji)
        }}
      >
        <Button>
          <ReactionIcon />
        </Button>
      </ReactionPopover>
    </Flex>
  )
}

const Button = styled('button', {
  padding: 2,
  boxShadow: '0px 4px 12px rgba(0, 34, 51, 0.08)',
  background: '$accent-8',
  borderRadius: '2px 10px 10px 10px',
  minWidth: 36,
  height: 20,
  display: 'inline-flex',
  alignItems: 'center',

  variants: {
    active: {
      true: {},
    },
  },
})
