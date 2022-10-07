import React from 'react'

import { useSortedChats } from '../../../../protocol'
import { Box } from '../../../../system'
import { ChatCategory } from './chat-category'
import { ChatItem } from './chat-item'

export const Chats = () => {
  const { categories, chats } = useSortedChats()

  return (
    <Box css={{ padding: '18px 0', overflowY: 'scroll' }}>
      {chats.map(chat => (
        <ChatItem key={chat.id} chat={chat} />
      ))}

      {categories.map(category => (
        <ChatCategory key={category.id} name={category.name}>
          {category.chats.map(chat => (
            <ChatItem key={chat.id} chat={chat} />
          ))}
        </ChatCategory>
      ))}
    </Box>
  )
}
