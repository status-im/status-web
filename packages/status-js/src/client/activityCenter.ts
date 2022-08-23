// todo: rename to notifications (center?), inbox, or keep same as other platforms
import type { ChatMessage } from './chat'
// import type { Client } from './client'

// todo?: union
// todo?: rename to Activity
type Notification = {
  // fixme?: specify message type (message_reply)
  type: 'message'
  value: ChatMessage
}

type ActivityCenterLatest = {
  notifications: Notification[]
  // todo?: rename count to mentionsAndRepliesCount
  unreadChats: Map<string, { count: number }> // id, count (mentions, replies)
}

// todo?: rename to NotificationCenter
export class ActivityCenter {
  // todo?: use client.account for mentions and replies, or in chat.ts
  // #client: Client

  #notifications: Set<Notification>
  #callbacks: Set<(latest: ActivityCenterLatest) => void>

  constructor(/* client: Client */) {
    // this.#client = client

    this.#notifications = new Set()
    this.#callbacks = new Set()
  }

  // todo?: rename to latest, change
  public getLatest = (): ActivityCenterLatest => {
    const notifications: Notification[] = []
    const unreadChats: Map<string, { count: number }> = new Map()

    for (const notification of this.#notifications.values()) {
      // todo?: switch
      if (notification.type === 'message') {
        const chatUuid = notification.value.chatUuid

        const chat = unreadChats.get(chatUuid)
        if (chat) {
          // fixme!: isReply || isMention
          const shouldIncrement = false
          if (shouldIncrement) {
            chat.count++
          }
        } else {
          unreadChats.set(chatUuid, { count: 0 })
        }
      }

      notifications.push(notification)
    }

    // todo?: reverse order
    notifications.sort((a, b) => {
      if (a.value.clock < b.value.clock) {
        return -1
      }

      if (a.value.clock > b.value.clock) {
        return 1
      }

      return 0
    })

    // fixme!?: do not display regular messages, only mentions and replies
    // todo?: group notifications (all, unreads, mentions, replies, _chats.{id,count})
    return { notifications, unreadChats }
  }

  public addMessageNotification = (value: ChatMessage) => {
    this.#notifications.add({ type: 'message', value })

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