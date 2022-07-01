import React from 'react'

import { BellIcon } from '../../icons/bell-icon'
import { ContextMenu, DropdownMenu } from '../../system'
// import { useAlertDialog } from '../../system/dialog/alert-dialog'
// import { useDialog } from '../../system/dialog/dialog'

// import { UserProfileDialog } from '../user-profile-dialog'
// import { EditGroupChatDialog } from './edit-group-chat-dialog'

interface Props {
  type: 'dropdown' | 'context'
  // chatType: 'channel' | 'chat' | 'group-chat'
}

export const ChatMenu = (props: Props) => {
  const { type } = props

  const Menu = type === 'dropdown' ? DropdownMenu : ContextMenu

  // const userProfileDialog = useDialog(UserProfileDialog)
  // const editGroupChatDialog = useDialog(EditGroupChatDialog)

  // const deleteChatDialog = useAlertDialog({
  //   title: 'Delete Chat',
  //   description: 'Are you sure you want to delete this chat?',
  //   actionLabel: 'Delete',
  //   actionVariant: 'danger',
  //   cancelLabel: 'Keep',
  // })
  // const leaveGroupDialog = useAlertDialog({
  //   title: 'Leave Group',
  //   description: 'Are you sure you want to leave this group chat?',
  //   actionLabel: 'Leave',
  //   actionVariant: 'danger',
  //   cancelLabel: 'Stay',
  // })

  return (
    <Menu>
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
    </Menu>
  )

  // if (chatType === 'channel') {
  //   return <Menu>{commonMenuItems}</Menu>
  // }

  // if (chatType === 'group-chat') {
  //   return (
  //     <Menu>
  //       <Menu.Item icon={<BellIcon />}>Add / remove from group</Menu.Item>
  //       <Menu.Item
  //         icon={<BellIcon />}
  //         onSelect={() => editGroupChatDialog.open({})}
  //       >
  //         Edit name and image
  //       </Menu.Item>
  //       <Menu.Separator />
  //       {commonMenuItems}
  //       <Menu.Separator />
  //       <Menu.Item
  //         icon={<BellIcon />}
  //         danger
  //         onSelect={() => leaveGroupDialog.open()}
  //       >
  //         Leave Chat
  //       </Menu.Item>
  //     </Menu>
  //   )
  // }

  // return (
  //   <Menu>
  //     <Menu.Item
  //       icon={<BellIcon />}
  //       onSelect={() => userProfileDialog.open({ name: 'Satoshi' })}
  //     >
  //       View Profile
  //     </Menu.Item>
  //     <Menu.Separator />
  //     {commonMenuItems}
  //     <Menu.Separator />
  //     <Menu.Item
  //       icon={<BellIcon />}
  //       danger
  //       onSelect={() => deleteChatDialog.open()}
  //     >
  //       Delete Chat
  //     </Menu.Item>
  //   </Menu>
  // )
}
