import React from 'react'

import { useSortedChats } from '../../../../protocol'
import { Box } from '../../../../system'
import { ChatGroup } from './chat-group'
import { ChatItem } from './chat-item'

export const Chats = () => {
  const { categories, chats } = useSortedChats()

  return (
    <Box css={{ padding: '18px 0', overflow: 'auto' }}>
      {chats.map(chat => (
        <ChatItem key={chat.id} chat={chat} />
      ))}

      {categories.map(category => (
        <ChatGroup key={category.id} name={category.name}>
          {category.chats.map(chat => (
            <ChatItem key={chat.id} chat={chat} />
          ))}
        </ChatGroup>
      ))}
    </Box>
  )
}
