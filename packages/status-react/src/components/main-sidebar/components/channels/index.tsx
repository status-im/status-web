import React from 'react'

import { Box } from '~/src/system'

import { ChannelGroup } from './channel-group'
import { ChannelItem } from './channel-item'

const CHANNELS = {
  Public: ['welcome', 'general', 'random'],
  Internal: ['watercooler', 'pm'],
}

export const Channels = () => {
  return (
    <Box>
      {Object.entries(CHANNELS).map(([group, channels]) => (
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
      ))}
    </Box>
  )
}
