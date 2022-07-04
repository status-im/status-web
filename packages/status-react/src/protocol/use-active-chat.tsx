import { useMatch } from 'react-router-dom'

import { useProtocol } from './use-protocol'

export const useActiveChat = () => {
  const { client } = useProtocol()

  const path = useMatch(':id')

  if (!path?.params.id) {
    return
  }

  return client.community.getChat(path.params.id)
}
