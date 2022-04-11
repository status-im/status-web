interface Chat {
  type: 'channel' | 'group-chat' | 'chat'
}

const chats: Record<string, Chat> = {
  welcome: { type: 'channel' },
  general: { type: 'channel' },
  random: { type: 'channel' },
  'vitalik.eth': { type: 'chat' },
  'pvl.eth': { type: 'chat' },
  'Climate Change': { type: 'group-chat' },
}

export const useChat = (id: string) => {
  return chats[id]
}
