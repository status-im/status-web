import React from 'react'

import { BellIcon } from '~/src/icons/bell-icon'
import { ContextMenu, DropdownMenu } from '~/src/system'

interface Props {
  type: 'dropdown' | 'context'
  chatType: 'channel' | 'chat' | 'group-chat'
}

export const ChatMenu = (props: Props) => {
  const { type, chatType } = props

  const Menu = type === 'dropdown' ? DropdownMenu : ContextMenu

  const renderMenuItems = () => {
    const commonMenuItems = (
      <>
        <Menu.TriggerItem label="Mute Chat" icon={<BellIcon />}>
          <Menu.Item>For 15 min</Menu.Item>
          <Menu.Item>For 1 hour</Menu.Item>
          <Menu.Item>For 8 hours</Menu.Item>
          <Menu.Item>For 24 hours</Menu.Item>
          <Menu.Item>Until I turn it back on</Menu.Item>
        </Menu.TriggerItem>
        <Menu.Item icon={<BellIcon />}>Mark as Read</Menu.Item>
        <Menu.TriggerItem label="Fetch Messages" icon={<BellIcon />}>
          <Menu.Item>Last 24 hours</Menu.Item>
          <Menu.Item>Last 2 days</Menu.Item>
          <Menu.Item>Last 3 days</Menu.Item>
          <Menu.Item>Last 7 days</Menu.Item>
        </Menu.TriggerItem>
      </>
    )

    if (chatType === 'channel') {
      return commonMenuItems
    }

    if (chatType === 'group-chat') {
      return (
        <>
          <Menu.Item icon={<BellIcon />}>Add / remove from group</Menu.Item>
          <Menu.Item icon={<BellIcon />}>Edit name and image</Menu.Item>
          <Menu.Separator />
          {commonMenuItems}
          <Menu.Separator />
          <Menu.Item icon={<BellIcon />} danger>
            Leave Chat
          </Menu.Item>
        </>
      )
    }

    return (
      <>
        <Menu.Item icon={<BellIcon />}>View Profile</Menu.Item>
        <Menu.Separator />
        {commonMenuItems}
        <Menu.Separator />
        <Menu.Item icon={<BellIcon />} danger>
          Delete Chat
        </Menu.Item>
      </>
    )
  }

  return <Menu>{renderMenuItems()}</Menu>
}
