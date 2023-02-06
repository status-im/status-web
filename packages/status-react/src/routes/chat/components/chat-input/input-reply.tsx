import React from 'react'

import { useChatContext } from '../../../../contexts/chat-context'
import { CrossIcon } from '../../../../icons/cross-icon'
import { MessageContentType } from '../../../../protocol'
import { styled } from '../../../../styles/config'
import { Flex, IconButton, Text } from '../../../../system'

import type { Member, Message } from '../../../../protocol'

interface Props {
  reply: {
    message: Message
    member: Member
  }
}

export const InputReply = (props: Props) => {
  const { dispatch } = useChatContext()

  const { reply } = props
  const { message, member } = reply

  return (
    <Wrapper>
      <Flex align="center" justify="between">
        <Text size="13" weight="500" truncate={false}>
          {member.username}
        </Text>

        <IconButton
          label="Cancel reply"
          onClick={() => dispatch({ type: 'DELETE_REPLY' })}
        >
          <CrossIcon />
        </IconButton>
      </Flex>
      {message.contentType === MessageContentType.TEXT_PLAIN && (
        <Flex>
          <Text size="13" truncate>
            {message.text}
          </Text>
        </Flex>
      )}
      {/* {message.contentType === 'IMAGE' && (
        <Image
          src={message.imageUrl}
          width={56}
          height={56}
          fit="cover"
          radius="bubble"
          alt="message"
        />
      )} */}
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
