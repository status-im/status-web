import { useMatch } from 'react-router-dom'

import { useProtocol } from './provider'

export const useActiveChat = () => {
  const { client } = useProtocol()

  const { params } = useMatch(':id')!
  const chatId = params.id!

  return client.community.getChat(chatId)
}
