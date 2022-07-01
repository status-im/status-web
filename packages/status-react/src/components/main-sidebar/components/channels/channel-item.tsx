import React from 'react'

import { ChatMenu } from '../../../../components/chat-menu'
import { ContextMenuTrigger } from '../../../../system'
import { SidebarItem } from '../sidebar-item'

import type { SidebarItemProps } from '../sidebar-item'

interface Props extends SidebarItemProps {
  children: string
}

export const ChannelItem = (props: Props) => {
  const { children, ...sidebarItemProps } = props

  return (
    <ContextMenuTrigger>
      <SidebarItem {...sidebarItemProps}>#{children}</SidebarItem>
      <ChatMenu type="context" />
    </ContextMenuTrigger>
  )
}
