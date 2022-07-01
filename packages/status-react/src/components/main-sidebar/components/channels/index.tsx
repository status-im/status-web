import React from 'react'

import { useChats } from '../../../../protocol'
import { Box } from '../../../../system'
// import { ChannelGroup } from './channel-group'
import { ChannelItem } from './channel-item'

export const Channels = () => {
  const chats = useChats()

  return (
    <Box css={{ padding: '18px 0', overflow: 'auto' }}>
      {chats.map(chat => (
        <ChannelItem
          key={chat.id}
          to={`/${chat.id}`}
          unread={false}
          muted={false}
          name={chat.identity?.displayName}
          color={chat.identity?.color}
        >
          {chat.identity!.displayName}
        </ChannelItem>
      ))}
    </Box>
  )
}
