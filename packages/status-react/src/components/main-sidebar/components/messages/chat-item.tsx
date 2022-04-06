import React from 'react'

import { BellIcon } from '~/src/icons/bell-icon'
import { ContextMenu, ContextMenuTrigger } from '~/src/system'

import { SidebarItem } from '../sidebar-item'

import type { SidebarItemProps } from '../sidebar-item'

interface Props extends SidebarItemProps {
  children: string
}

export const ChatItem = (props: Props) => {
  const { children, ...sidebarItemProps } = props

  return (
    <ContextMenuTrigger>
      <SidebarItem {...sidebarItemProps}>{children}</SidebarItem>
      <ContextMenu>
        <ContextMenu.Item icon={<BellIcon />}>View Profile</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.TriggerItem label="Mute Chat" icon={<BellIcon />}>
          <ContextMenu.Item>For 15 min</ContextMenu.Item>
          <ContextMenu.Item>For 1 hour</ContextMenu.Item>
          <ContextMenu.Item>For 8 hours</ContextMenu.Item>
          <ContextMenu.Item>For 24 hours</ContextMenu.Item>
          <ContextMenu.Item>Until I turn it back on</ContextMenu.Item>
        </ContextMenu.TriggerItem>
        <ContextMenu.Separator />
        <ContextMenu.Item icon={<BellIcon />} danger>
          Delete
        </ContextMenu.Item>
      </ContextMenu>
    </ContextMenuTrigger>
  )
}
