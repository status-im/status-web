// todo?: rename to notifications (center?), inbox, or keep same as other platforms
// todo: use kebab case for the file name

import type { ChatMessage } from './chat'
import type { Client } from './client'

// todo?: rename to Activity
export type Notification = {
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

  // todo?: also calls `clearChatNotifications` (on non-action items/notifications)?
  // markAllAsRead = () => {}

  // todo?: for example from chat with red bar in UI indicating start
  // markChatNotificationsAsUnreadSince = (category, id) => {}

  // todo?: rename to `clearChatNotifications`; separate (button) from `markAllAsRead`?
  // todo?: merge with `removeChatNotifications`; together with `notification.type` condition
  /**
   * Removes all notifications.
   */
  removeNotifications = (category: 'all' | 'mentions' | 'replies') => {
    // todo?: clear all non-actionable notification too
    if (category === 'all') {
      for (const notification of this.#notifications) {
        const { isMention, isReply } = notification

        if (!(isMention || isReply)) {
          continue
        }

        this.#notifications.delete(notification)
      }
    } else if (category === 'mentions') {
      // todo: extract to a func
      this.#notifications.forEach(notification => {
        if (notification.isMention) {
          this.#notifications.delete(notification)
        }
      })
    } else if (category === 'replies') {
      this.#notifications.forEach(notification => {
        if (notification.isReply) {
          this.#notifications.delete(notification)
        }
      })
    }

    this.emitLatest()
  }

  // todo?: call from UI on ESC
  // todo?: call from UI if scrolled all the way to the end
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
