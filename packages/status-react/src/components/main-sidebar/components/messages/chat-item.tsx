import React from 'react'

import { ChatMenu } from '~/src/components/chat-menu'
import { useChannel } from '~/src/protocol'
import { ContextMenuTrigger } from '~/src/system'

import { SidebarItem } from '../sidebar-item'

import type { SidebarItemProps } from '../sidebar-item'

interface Props extends SidebarItemProps {
  children: string
}

export const ChatItem = (props: Props) => {
  const { children, ...sidebarItemProps } = props

  const chat = useChannel(children)

  return (
    <ContextMenuTrigger>
      <SidebarItem {...sidebarItemProps}>{children}</SidebarItem>
      <ChatMenu type="context" chatType={chat.type} />
    </ContextMenuTrigger>
  )
}
