// todo?: rename to notifications (center?), inbox, or keep same as other platforms

import type { ChatMessage } from './chat'
import type { Client } from './client'

// todo?: rename to Activity
type Notification = {
  type: 'message'
  value: ChatMessage
  isMention?: boolean
  isReply?: boolean
}

export type ActivityCenterLatest = {
  notifications: Notification[]
  // todo?: rename count to mentionsAndRepliesCount
  unreadChats: Map<string, { count: number }>
}

export class ActivityCenter {
  #client: Client

  #notifications: Set<Notification>
  #callbacks: Set<(latest: ActivityCenterLatest) => void>

  constructor(client: Client) {
    this.#client = client

    this.#notifications = new Set()
    this.#callbacks = new Set()
  }

  public getLatest = (): ActivityCenterLatest => {
    const notifications: Notification[] = []
    const unreadChats: Map<string, { count: number }> = new Map()

    for (const notification of this.#notifications.values()) {
      if (notification.type === 'message') {
        const chatUuid = notification.value.chatUuid

        const chat = unreadChats.get(chatUuid)
        let count = chat?.count ?? 0

        if (notification.isMention || notification.isReply) {
          count++
        }

        if (chat) {
          chat.count = count
        } else {
          unreadChats.set(chatUuid, { count })
        }
      }

      notifications.push(notification)
    }

    notifications.sort((a, b) => {
      if (a.value.clock > b.value.clock) {
        return -1
      }

      if (a.value.clock < b.value.clock) {
        return 1
      }

      return 0
    })

    // fixme!?: do not display regular messages, only mentions and replies
    // todo?: group notifications (all, unreads, mentions, replies, _chats.{id,count})
    return { notifications, unreadChats }
  }

  // todo: pass ids instead of values and resolve within
  public addMessageNotification = (
    newMessage: ChatMessage,
    referencedMessage?: ChatMessage
  ) => {
    let isMention: boolean | undefined
    let isReply: boolean | undefined

    if (this.#client.account) {
      const publicKey = `0x${this.#client.account.publicKey}`

      isMention = newMessage.text.includes(publicKey)
      isReply = referencedMessage?.signer === publicKey
    }

    // todo?: getLatest on login
    this.#notifications.add({
      type: 'message',
      value: newMessage,
      isMention,
      isReply,
    })

    this.emitLatest()
  }

  /**
   * Removes all notifications.
   */
  removeNotifications = () => {
    this.#notifications.clear()

    this.emitLatest()
  }

  /**
   * Removes chat message notifications from the Activity Center. For example,
   * on only opening or after scrolling to the end.
   */
  public removeChatNotifications = (chatUuid: string) => {
    // todo?: add chatUuid to "readChats" Set instead and resolve in getNotifications
    // triggered by following emit, and clear the set afterwards
    for (const notification of this.#notifications) {
      if (notification.type !== 'message') {
        continue
      }

      if (notification.value.chatUuid === chatUuid) {
        this.#notifications.delete(notification)
      }
    }

    this.emitLatest()
  }

  private emitLatest = () => {
    const latest = this.getLatest()

    this.#callbacks.forEach(callback => callback(latest))
  }

  public onChange = (callback: (latest: ActivityCenterLatest) => void) => {
    this.#callbacks.add(callback)

    return () => {
      this.#callbacks.delete(callback)
    }
  }
}
