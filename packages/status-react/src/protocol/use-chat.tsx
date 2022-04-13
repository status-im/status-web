export interface Chat {
  type: 'channel' | 'group-chat' | 'chat'
  imageUrl?: string
}

const chats: Record<string, Chat> = {
  welcome: { type: 'channel', imageUrl: '' },
  general: {
    type: 'channel',
    imageUrl:
      'https://images.unsplash.com/flagged/photo-1559717865-a99cac1c95d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2l0eSxuaWdodHx8fHx8fDE2NDk4NDYyMzI&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
  },
  random: {
    type: 'channel',
    imageUrl:
      'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
  },
  'vitalik.eth': { type: 'chat', imageUrl: '' },
  'pvl.eth': { type: 'chat', imageUrl: '' },
  'Climate Change': { type: 'group-chat', imageUrl: '' },
}

export const useChat = (id: string) => {
  return chats[id]
}
