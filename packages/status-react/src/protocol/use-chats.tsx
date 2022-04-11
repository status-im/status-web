import { useClient } from './provider'

interface Chat {
  type: 'channel' | 'group-chat' | 'chat'
}

export const useChats = (id: string) => {
  const client = useClient()
}
