import debug from 'debug'
import { waku_message, WakuMessage } from 'js-waku'

import { Chat } from './chat'
import { ApplicationMetadataMessage_Type } from './proto/status/v1/application_metadata_message'
import { getLatestUserNickname } from './utils'
import { ApplicationMetadataMessage } from './wire/application_metadata_message'
import { ChatMessage } from './wire/chat_message'

import type { Identity } from './identity'
import type { Content } from './wire/chat_message'
import type { Waku } from 'js-waku'

const dbg = debug('communities:messenger')

// TODO: pass waku client
export class Messenger {
  waku: Waku
  chatsById: Map<string, Chat>
  observers: {
    [chatId: string]: Set<
      (
        message: ApplicationMetadataMessage,
        timestamp: Date,
        chatId: string
      ) => void
    >
  }
  identity: Identity | undefined

  private constructor(identity: Identity | undefined, waku: Waku) {
    this.identity = identity
    this.waku = waku
    this.chatsById = new Map()
    this.observers = {}
  }

  public static async create(
    identity: Identity | undefined,
    // wakuOptions?: waku.CreateOptions
    // TODO: pass waku as client
    // wakuOptions?: WakuCreateOptions
    waku: Waku
  ): Promise<Messenger> {
    // const _wakuOptions = Object.assign(
    //   { bootstrap: { default: true } },
    //   wakuOptions
    // )
    // const waku = await Waku.create(_wakuOptions)
    return new Messenger(identity, waku)
  }

  /**
   * Joins a public chat using its id.
   *
   * For community chats, prefer [[joinChat]].
   *
   * Use `addListener` to get messages received on this chat.
   */
  public async joinChatById(chatId: string): Promise<void> {
    const chat = await Chat.create(chatId)

    await this.joinChat(chat)
  }

  /**
   * Joins several of public chats.
   *
   * Use `addListener` to get messages received on these chats.
   */
  public async joinChats(chats: Iterable<Chat>): Promise<void> {
    await Promise.all(
      Array.from(chats).map(chat => {
        return this.joinChat(chat)
      })
    )
  }

  /**
   * Joins a public chat.
   *
   * Use `addListener` to get messages received on this chat.
   */
  public async joinChat(chat: Chat): Promise<void> {
    if (this.chatsById.has(chat.id))
      throw `Failed to join chat, it is already joined: ${chat.id}`

    this.waku.addDecryptionKey(chat.symKey, {
      method: waku_message.DecryptionMethod.Symmetric,
      contentTopics: [chat.contentTopic],
    })

    this.waku.relay.addObserver(
      (wakuMessage: WakuMessage) => {
        if (!wakuMessage.payload || !wakuMessage.timestamp) return

        const message = ApplicationMetadataMessage.decode(wakuMessage.payload)

        switch (message.type) {
          case ApplicationMetadataMessage_Type.TYPE_CHAT_MESSAGE:
            this._handleNewChatMessage(chat, message, wakuMessage.timestamp)
            break
          default:
            dbg('Received unsupported message type', message.type)
        }
      },
      [chat.contentTopic]
    )

    this.chatsById.set(chat.id, chat)
  }

  /**
   * Sends a message on the given chat Id.
   */
  public async sendMessage(
    chatId: string,
    content: Content,
    responseTo?: string
  ): Promise<void> {
    if (this.identity) {
      const chat = this.chatsById.get(chatId)
      if (!chat) throw `Failed to send message, chat not joined: ${chatId}`

      const chatMessage = chat.createMessage(content, responseTo)

      const appMetadataMessage = ApplicationMetadataMessage.create(
        chatMessage.encode(),
        ApplicationMetadataMessage_Type.TYPE_CHAT_MESSAGE,
        this.identity
      )

      const wakuMessage = await WakuMessage.fromBytes(
        appMetadataMessage.encode(),
        chat.contentTopic,
        { symKey: chat.symKey, sigPrivKey: this.identity.privateKey }
      )

      await this.waku.relay.send(wakuMessage)
    }
  }

  /**
   * Add an observer of new messages received on the given chat id.
   *
   * @throws string If the chat has not been joined first using [joinChat].
   */
  public addObserver(
    observer: (
      message: ApplicationMetadataMessage,
      timestamp: Date,
      chatId: string
    ) => void,
    chatId: string | string[]
  ): void {
    let chats = []

    if (typeof chatId === 'string') {
      chats.push(chatId)
    } else {
      chats = [...chatId]
    }

    chats.forEach(id => {
      if (!this.chatsById.has(id))
        throw 'Cannot add observer on a chat that is not joined.'
      if (!this.observers[id]) {
        this.observers[id] = new Set()
      }

      this.observers[id].add(observer)
    })
  }

  /**
   * Delete an observer of new messages received on the given chat id.
   *
   * @throws string If the chat has not been joined first using [joinChat].
   */

  deleteObserver(
    observer: (message: ApplicationMetadataMessage) => void,
    chatId: string
  ): void {
    if (this.observers[chatId]) {
      this.observers[chatId].delete(observer)
    }
  }

  /**
   * Stops the messenger.
   */
  public async stop(): Promise<void> {
    await this.waku.stop()
  }

  /**
   * Retrieve previous messages from a Waku Store node for the given chat Id.
   *
   * Note: note sure what is the preferred interface: callback or returning all messages
   * Callback is more flexible and allow processing messages as they are retrieved instead of waiting for the
   * full retrieval via paging to be done.
   */
  public async retrievePreviousMessages(
    chatId: string,
    startTime: Date,
    endTime: Date,
    callback?: (messages: ApplicationMetadataMessage[]) => void
  ): Promise<number> {
    const chat = this.chatsById.get(chatId)
    if (!chat)
      throw `Failed to retrieve messages, chat is not joined: ${chatId}`

    const _callback = (wakuMessages: WakuMessage[]): void => {
      const isDefined = (
        msg: ApplicationMetadataMessage | undefined
      ): msg is ApplicationMetadataMessage => {
        return !!msg
      }

      const messages = wakuMessages.map((wakuMessage: WakuMessage) => {
        if (!wakuMessage.payload || !wakuMessage.timestamp) return

        const message = ApplicationMetadataMessage.decode(wakuMessage.payload)

        switch (message.type) {
          case ApplicationMetadataMessage_Type.TYPE_CHAT_MESSAGE:
            this._handleNewChatMessage(chat, message, wakuMessage.timestamp)
            return message
          default:
            dbg('Retrieved unsupported message type', message.type)
            return
        }
      })
      if (callback) {
        callback(messages.filter(isDefined))
      }
    }
    const allMessages = await this.waku.store.queryHistory(
      [chat.contentTopic],
      {
        timeFilter: { startTime, endTime },
        callback: _callback,
      }
    )
    return allMessages.length
  }

  private _handleNewChatMessage(
    chat: Chat,
    message: ApplicationMetadataMessage,
    timestamp: Date
  ): void {
    if (!message.payload || !message.type || !message.signature) return

    const chatMessage = ChatMessage.decode(message.payload)
    chat.handleNewMessage(chatMessage)

    if (this.observers[chat.id]) {
      this.observers[chat.id].forEach(observer => {
        observer(message, timestamp, chat.id)
      })
    }
  }

  async checkIfUserInWakuNetwork(publicKey: Uint8Array): Promise<boolean> {
    const { clock, nickname } = await getLatestUserNickname(
      publicKey,
      this.waku
    )
    return clock > 0 && nickname !== ''
  }
}
