import React from 'react'

import { Box } from '~/src/system'
import { useChats } from '~/src/protocol'

import { ChannelGroup } from './channel-group'
import { ChannelItem } from './channel-item'


export const Channels = () => {

  const chats = useChats()

  return (
    <Box css={{padding:'8px 0'}}>
      {chats.map((chat) => (
        <ChannelItem
          key={chat.id}
          to={`/${chat.id}`}
          unread={false}
          muted={false}
        >
          {chat.identity!.displayName}
        </ChannelItem>
      ))}

      {/* {Object.entries(community.chats).map(([group, channels]) => (
        <ChannelGroup key={group} name={group}>
          {channels.map(channel => (
            <ChannelItem
              key={group + channel}
              to={`/${channel}`}
              unread={channel === 'general'}
              muted={channel === 'random'}
            >
              {channel}
            </ChannelItem>
          ))}
        </ChannelGroup>
      ))} */}
    </Box>
  )
}
