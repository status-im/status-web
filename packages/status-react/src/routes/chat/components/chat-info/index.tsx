import React from 'react'

import { PinIcon } from '~/src/icons/pin-icon'
import { Avatar, DialogTrigger, Flex, Text } from '~/src/system'

import { PinnedMessagesDialog } from './pinned-messages-dialog'

import type { Chat } from '~/src/protocol/use-chat'

interface Props {
  chat: Chat
}

export const ChatInfo = (props: Props) => {
  const { chat } = props

  if (chat.type == 'channel') {
    return (
      <Flex align="center" gap="2">
        <Avatar size={36} src={chat.imageUrl} />
        <div>
          <Text>#general</Text>
          <Flex align="center">
            <Text size={12} color="gray">
              <DialogTrigger>
                <button
                  style={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  {/* <PinIcon width={7} height={13} />2 pinned messages */}2
                  pinned messages
                </button>
                <PinnedMessagesDialog />
              </DialogTrigger>{' '}
              | General discussions about CryptoKitties.
            </Text>
          </Flex>
        </div>
      </Flex>
    )
  }

  if (chat.type == 'group-chat') {
    return (
      <Flex align="center" gap="2">
        <Avatar size={36} src={chat.imageUrl} />
        <div>
          <Text>Climate Change</Text>
          <Flex align="center">
            <DialogTrigger>
              <Text as="button" size={12} color="gray">
                <PinIcon width={7} /> 2 pinned messages
              </Text>
              <PinnedMessagesDialog />
            </DialogTrigger>
            <Text size={12} color="gray">
              | 5 members
            </Text>
          </Flex>
        </div>
      </Flex>
    )
  }

  return (
    <Flex align="center" gap="2">
      <Avatar size={36} src={chat.imageUrl} />
      <div>
        <Text>pvl.eth</Text>
        <Text size={12} color="gray">
          0x63FaC9201494f0bd17B9892B9fae4d52fe3BD377
        </Text>
      </div>
    </Flex>
  )
}
