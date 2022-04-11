import React from 'react'

import { ChatMenu } from '~/src/components/chat-menu'
import { useChat } from '~/src/protocol/use-chat'
import { ContextMenuTrigger } from '~/src/system'

import { SidebarItem } from '../sidebar-item'

import type { SidebarItemProps } from '../sidebar-item'

interface Props extends SidebarItemProps {
  children: string
}

export const ChatItem = (props: Props) => {
  const { children, ...sidebarItemProps } = props

  const chat = useChat(children)

  return (
    <ContextMenuTrigger>
      <SidebarItem {...sidebarItemProps}>{children}</SidebarItem>
      <ChatMenu type="context" chatType={chat.type} />
    </ContextMenuTrigger>
  )
}
