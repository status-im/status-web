import React from 'react'

import { useChatContext } from '~/src/contexts/chat-context'
import { CrossIcon } from '~/src/icons/cross-icon'
import { ReplyIcon } from '~/src/icons/reply-icon'
import { styled } from '~/src/styles/config'
import { Box, Flex, Icon, IconButton, Image, Text } from '~/src/system'

import type { Message } from '~/src/protocol/use-messages'

interface Props {
  message: Message
}

export const InputReply = (props: Props) => {
  const { dispatch } = useChatContext()

  const { message } = props

  return (
    <Wrapper>
      <Flex align="center" justify="between">
        <Flex gap={1}>
          <Icon hidden>
            <ReplyIcon />
          </Icon>
          <Text size="13" weight="500" truncate={false}>
            {message.contact.name}
          </Text>
        </Flex>

        <IconButton
          label="Cancel reply"
          onClick={() => dispatch({ type: 'CANCEL_REPLY' })}
        >
          <CrossIcon />
        </IconButton>
      </Flex>
      {message.type === 'text' && (
        <Flex>
          <Text size="13" truncate={false}>
            {message.text}
          </Text>
        </Flex>
      )}
      {message.type === 'image' && (
        <Image
          src={message.imageUrl}
          width={56}
          height={56}
          fit="cover"
          radius="bubble"
          alt="message"
        />
      )}
      {message.type === 'image-text' && (
        <Box>
          <Flex>
            <Text size="13" truncate={false}>
              {message.text}
            </Text>
          </Flex>
          <Image
            src={message.imageUrl}
            width={56}
            height={56}
            fit="cover"
            radius="bubble"
            alt="message"
          />
        </Box>
      )}
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  overflow: 'hidden',
  padding: '6px 12px',
  background: 'rgba(0, 0, 0, 0.1)',
  borderRadius: '14px 14px 4px 14px;',
})
