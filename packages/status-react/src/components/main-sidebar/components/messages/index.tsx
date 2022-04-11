import React from 'react'

import { EditIcon } from '~/src/icons/edit-icon'
import { Box, Grid, Heading, IconButton } from '~/src/system'

import { ChatItem } from './chat-item'

const CHATS = ['vitalik.eth', 'pvl.eth', 'Climate Change']

export const Messages = () => {
  return (
    <Box>
      <Grid
        flow="column"
        align="center"
        justify="between"
        css={{ marginBottom: 16 }}
      >
        <Heading weight="600">Messages</Heading>
        <IconButton label="New Chat" to="/new">
          <EditIcon />
        </IconButton>
      </Grid>
      {CHATS.map(chat => (
        <ChatItem key={chat} to={`/${chat}`} unread={false} muted={false}>
          {chat}
        </ChatItem>
      ))}
    </Box>
  )
}
