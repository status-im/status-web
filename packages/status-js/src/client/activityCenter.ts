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
  // todo?: rename count to mentionsAndRepliesCount, mentionsCount
  unreadChats: Map<string, { count: number }>
  totalCount: number
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
    let totalCount = 0

    for (const notification of this.#notifications.values()) {
      if (notification.type === 'message') {
        const chatUuid = notification.value.chatUuid

        const chat = unreadChats.get(chatUuid)
        let count = chat?.count ?? 0

        const isMention = notification.isMention || notification.isReply
        if (isMention) {
          count++
          totalCount++
        }

        if (chat) {
          chat.count = count
        } else {
          unreadChats.set(chatUuid, { count })
        }

        if (!isMention) {
          continue
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

    return {
      // todo?: group notifications (all, mentions, replies)
      notifications,
      unreadChats,
      totalCount,
    }
  }

  public addMessageNotification = (
    newMessage: ChatMessage,
    referencedMessage?: ChatMessage
  ) => {
    /* todo?: set unread chats here
    if not client emit and return
    if not mention or reply emit and return
    else add notification emit and return */

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

  // todo?: mark as read
  // markAllAsRead = () => {}

  // markAsRead = (category, ids) => {}

  // fixme: add category/group param (i.e. all, mentions, etc.)
  /**
   * Removes all notifications.
   */
  removeNotifications = () => {
    // fixme!: do not clear non-metntions
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
