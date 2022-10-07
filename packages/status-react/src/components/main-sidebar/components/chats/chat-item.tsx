import React, { forwardRef } from 'react'

import { NavLink } from 'react-router-dom'

import { useActivityCenter } from '../../../../protocol'
import { styled } from '../../../../styles/config'
import { Avatar, Badge, Flex } from '../../../../system'

import type { Chat } from '../../../../protocol/use-sorted-chats'
import type { Ref } from 'react'

interface Props {
  chat: Chat
}

const ChatItem = (props: Props, ref: Ref<HTMLAnchorElement>) => {
  const { chat } = props

  const { unreadChats } = useActivityCenter()

  const muted = false
  const unread = unreadChats.has(chat.id)
  const count = unreadChats.get(chat.id)?.count ?? 0

  const { color, displayName } = chat.identity!

  return (
    <Link
      ref={ref}
      to={`/${chat.id}`}
      state={muted ? 'muted' : unread ? 'unread' : undefined}
    >
      <Flex gap={2} align="center">
        <Avatar size={24} name={displayName} color={color} initialsLength={1} />
        #{displayName}
      </Flex>
      {count > 0 && <Badge>{count}</Badge>}
    </Link>
  )
}

const _ChatItem = forwardRef(ChatItem)

export { _ChatItem as ChatItem }
export type SidebarItemProps = Omit<Props, 'children'>

const Link = styled(NavLink, {
  position: 'relative',
  fontFamily: '$sans',
  fontWeight: '$500',
  fontSize: 15,
  display: 'flex',
  justifyContent: 'space-between',
  color: '$accent-4',
  alignItems: 'center',
  width: '100%',
  borderRadius: 8,
  padding: 8,

  '&:hover': {
    background: '$gray-3',
  },

  '&.active': {
    color: '$accent-1',
    background: '$gray-3',
  },

  variants: {
    state: {
      muted: {
        color: '$accent-5',
      },
      unread: {
        color: '$accent-1',
        fontWeight: '$600',
      },
    },
  },
})
