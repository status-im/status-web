import type { Contact } from './Contact'

export type ChannelData = {
  id: string
  name: string
  type: 'channel' | 'dm' | 'group'
  description?: string
  icon?: string
  isMuted?: boolean
  members?: Contact[]
}

export type ChannelsData = {
  [id: string]: ChannelData
}
