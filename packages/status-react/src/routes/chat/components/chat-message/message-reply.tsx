import React from 'react'

import { MessageContentType, useProtocol } from '../../../../protocol'
import { styled } from '../../../../styles/config'
import { Avatar, Box, Flex, Image, Text } from '../../../../system'

import type { Message } from '../../../../protocol'

interface Props {
  message: Message
}

export const MessageReply = (props: Props) => {
  const { message } = props

  const { client } = useProtocol()

  // if (!message) {
  //   return (
  //     <Wrapper>
  //       <Text color="gray" size="13" truncate>
  //         Message not available.
  //       </Text>
  //     </Wrapper>
  //   )
  // }

  const { contentType, text, signer } = message
  const member = client.community.getMember(signer)!

  return (
    <Wrapper>
      <Flex gap="1" align="center">
        <Avatar size={20} name={member.username} colorHash={member.colorHash} />
        <Text color="gray" size="13" weight="500">
          {member.username}
        </Text>
      </Flex>
      {contentType === MessageContentType.TEXT_PLAIN && (
        <Flex>
          <Text color="gray" size="13" truncate>
            {text}
          </Text>
        </Flex>
      )}
      {contentType === MessageContentType.EMOJI && (
        <Flex>
          <Text color="gray" size="13" truncate>
            {text}
          </Text>
        </Flex>
      )}
      {contentType === MessageContentType.IMAGE && (
        <Box css={{ paddingTop: '$1' }}>
          <Image
            src="TODO"
            width={56}
            height={56}
            fit="cover"
            radius="1"
            alt="message"
          />
        </Box>
      )}
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  position: 'relative',
  // height: 40,
  marginLeft: 52,
  display: 'flex',
  flexDirection: 'column',
  // gap: '$1',
  paddingBottom: 8,

  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    '--background-accent': 'rgba(147, 155, 161, 0.4)',
    '--avatar-size': '44px',
    '--gutter': '8px',
    '--width': '2px',
  },

  '&::before': {
    display: 'block',
    position: 'absolute',
    top: 10,
    right: 'calc(100% + 10px)',
    bottom: 10,
    left: 'calc(var(--avatar-size)/2*-1 + var(--gutter)*-1)',
    marginRight: 'var(--reply-spacing)',
    marginTop: 'calc(var(--width)*-1/2)',
    marginLeft: 'calc(var(--width)*-1/2)',
    marginBottom: 'calc(0.125rem - 4px)',
    borderLeft: 'var(--width) solid var(--background-accent)',
    borderBottom: '0 solid var(--background-accent)',
    borderRight: '0 solid var(--background-accent)',
    borderTop: 'var(--width) solid var(--background-accent)',
    borderTopLeftRadius: '10px',
  },
})
