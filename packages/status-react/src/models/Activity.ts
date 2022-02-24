import type { ChannelData } from './ChannelData'
import type { ChatMessage } from './ChatMessage'
import type { CommunityData } from './CommunityData'

export type ActivityStatus = 'sent' | 'accepted' | 'declined' | 'blocked'

export type Activity =
  | {
      id: string
      type: 'mention'
      date: Date
      user: string
      message: ChatMessage
      channel: ChannelData
      isRead?: boolean
    }
  | {
      id: string
      type: 'reply'
      date: Date
      user: string
      message: ChatMessage
      channel: ChannelData
      quote: ChatMessage
      isRead?: boolean
    }
  | {
      id: string
      type: 'request'
      date: Date
      user: string
      isRead?: boolean
      request: string
      requestType: 'outcome' | 'income'
      status: ActivityStatus
    }
  | {
      id: string
      type: 'invitation'
      isRead?: boolean
      date: Date
      user: string
      status: ActivityStatus
      invitation?: CommunityData
    }

export type Activities = {
  [id: string]: Activity
}
