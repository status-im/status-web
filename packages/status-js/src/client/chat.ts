import { PageDirection } from 'js-waku'

import {
  ChatMessage as ChatMessageProto,
  DeleteMessage,
  EditMessage,
} from '~/protos/chat-message'
import { EmojiReaction } from '~/protos/emoji-reaction'

import { idToContentTopic } from '../contentTopic'
import { createSymKeyFromPassword } from '../encryption'
import { containsOnlyEmoji } from '../helpers/contains-only-emoji'
import { getReactions } from './community/get-reactions'

import type { MessageType } from '../../protos/enums'
import type { Client } from '../client'
import type { Community } from './community/community'
import type { Reactions } from './community/get-reactions'
import type { ImageMessage } from '~/src/proto/communities/v1/chat_message'
import type { CommunityChat } from '~/src/proto/communities/v1/communities'
import type { WakuMessage } from 'js-waku'

export type ChatMessage = ChatMessageProto & {
  messageId: string
  pinned: boolean
  reactions: Reactions
  chatUuid: string
  responseToMessage?: Omit<ChatMessage, 'responseToMessage'>
}

export class Chat {
  private readonly client: Client

  public readonly uuid: string
  public readonly id: string
  public readonly contentTopic: string
  public readonly type: MessageType.COMMUNITY_CHAT
  public readonly symmetricKey: Uint8Array
  public description: CommunityChat
  public readonly chatCallbacks: Set<(description: CommunityChat) => void>
  public messages: ChatMessage[]
  public readonly messageCallbacks: Set<(messages: ChatMessage[]) => void>

  constructor(options: {
    client: Client
    uuid: string
    id: string
    contentTopic: string
    type: MessageType.COMMUNITY_CHAT
    symmetricKey: Uint8Array
    description: CommunityChat
  }) {
    this.client = options.client

    this.uuid = options.uuid
    this.id = options.id
    this.contentTopic = options.contentTopic
    this.type = options.type
    this.symmetricKey = options.symmetricKey
    this.description = options.description

    this.chatCallbacks = new Set()
    this.messages = []
    this.messageCallbacks = new Set()
  }

  public static create = async (
    community: Community,
    client: Client,
    uuid: string,
    type: MessageType.COMMUNITY_CHAT,
    description: CommunityChat
  ) => {
    const id = `${community.publicKey}${uuid}`
    const contentTopic = idToContentTopic(id)
    const symmetricKey = await createSymKeyFromPassword(id)

    return new Chat({
      client,
      uuid,
      id,
      contentTopic,
      type,
      symmetricKey,
      description,
    })
  }

  public getMessages = () => {
    return this.messages
  }

  public onChange = (callback: (description: CommunityChat) => void) => {
    this.chatCallbacks.add(callback)

    return () => {
      this.chatCallbacks.delete(callback)
    }
  }

  public emitChange = (description: CommunityChat) => {
    this.chatCallbacks.forEach(callback => callback(description))
  }

  public onMessage = (
    callback: (messages: ChatMessage[]) => void
  ): (() => void) => {
    this.messageCallbacks.add(callback)

    return () => {
      this.messageCallbacks.delete(callback)
    }
  }

  public fetchMessages = async (
    options: { start: Date },
    callback: (messages: ChatMessage[]) => void
  ) => {
    const startTime = options.start
    const endTime = new Date()

    let _oldestClock: bigint | undefined
    let _oldestMessageTime: Date | undefined

    if (this.messages.length) {
      _oldestClock = this.messages[0].clock
      _oldestMessageTime = new Date(Number(this.messages[0].timestamp))

      // already handled
      if (_oldestMessageTime <= options.start) {
        callback(this.messages)

        return
      }
    }

    await this.client.waku.store.queryHistory([this.contentTopic], {
      timeFilter: {
        startTime: startTime,
        endTime: endTime,
      },
      pageSize: 50,
      // most recent page first
      pageDirection: PageDirection.BACKWARD,
      decryptionKeys: [this.symmetricKey],
      callback: (wakuMessages: WakuMessage[]) => {
        // oldest message first
        for (const wakuMessage of wakuMessages) {
          this.client.handleWakuMessage(wakuMessage)
        }
      },
    })

    // callback
    // more not found
    if (
      _oldestClock &&
      this.messages.length &&
      _oldestClock >= this.messages[0].clock
    ) {
      callback([])

      return
    }

    callback(this.messages)
  }

  public emitMessages = (messages: ChatMessage[]) => {
    // fixme!: don't emit on backfill
    this.messageCallbacks.forEach(callback => callback([...messages]))
  }

  public handleChange = (description: CommunityChat) => {
    // state
    this.description = description

    // callback
    this.emitChange(description)
  }

  public handleNewMessage = (message: ChatMessage) => {
    let messageIndex = this.messages.length
    while (messageIndex > 0) {
      const _message = this.messages[messageIndex - 1]

      if (_message.clock <= message.clock) {
        break
      }

      messageIndex--
    }

    let responseToMessageIndex = this.messages.length
    while (--responseToMessageIndex >= 0) {
      const _message = this.messages[responseToMessageIndex]

      if (_message.messageId === message.responseTo) {
        break
      }
    }

    if (responseToMessageIndex >= 0) {
      message.responseToMessage = this.messages[responseToMessageIndex]
    }

    // state
    this.messages.splice(messageIndex, 0, message)

    // callback
    this.emitMessages(this.messages)
  }

  public handleEditedMessage = (messageId: string, text: string) => {
    let messageIndex = this.messages.length
    while (--messageIndex >= 0) {
      const _message = this.messages[messageIndex]

      if (_message.messageId === messageId) {
        break
      }
    }

    // original not found
    if (messageIndex < 0) {
      return
    }

    this.messages[messageIndex] = {
      ...this.messages[messageIndex],
      text,
    }

    // callback
    this.emitMessages(this.messages)
  }

  public handleDeletedMessage = (messageId: string) => {
    let messageIndex = this.messages.length
    while (--messageIndex >= 0) {
      const _message = this.messages[messageIndex]

      if (_message.messageId === messageId) {
        break
      }
    }

    if (messageIndex < 0) {
      return
    }

    this.messages.splice(messageIndex, 1)

    this.emitMessages(this.messages)
  }

  public handlePinnedMessage = (messageId: string, pinned?: boolean) => {
    let messageIndex = this.messages.length
    while (--messageIndex >= 0) {
      const _message = this.messages[messageIndex]

      if (_message.messageId === messageId) {
        break
      }
    }

    if (messageIndex < 0) {
      return
    }

    this.messages[messageIndex].pinned = Boolean(pinned)

    this.emitMessages(this.messages)
  }

  public handleEmojiReaction = (
    messageId: string,
    reaction: EmojiReaction,
    publicKey: string
  ) => {
    let messageIndex = this.messages.length
    while (--messageIndex >= 0) {
      const _message = this.messages[messageIndex]

      if (_message.messageId === messageId) {
        break
      }
    }

    if (messageIndex < 0) {
      return
    }

    this.messages[messageIndex].reactions = getReactions(
      reaction,
      this.messages[messageIndex].reactions,
      publicKey
    )

    this.emitMessages(this.messages)
  }

  public sendTextMessage = async (text: string, responseTo?: string) => {
    if (text === '') {
      throw new Error('Text message cannot be empty')
    }

    const type = containsOnlyEmoji(text)
      ? ChatMessageProto.ContentType.EMOJI
      : ChatMessageProto.ContentType.TEXT_PLAIN

    // TODO: protos does not support optional fields :-(
    const payload = ChatMessageProto.encode({
      clock: BigInt(Date.now()),
      timestamp: BigInt(Date.now()),
      text,
      responseTo: responseTo ?? '',
      ensName: '',
      chatId: this.id,
      contentType: type,
      messageType: 'COMMUNITY_CHAT' as MessageType,
      sticker: { hash: '', pack: 0 },
      image: {
        type: 'JPEG',
        payload: new Uint8Array([]),
      },
      audio: {
        type: 'AAC',
        payload: new Uint8Array([]),
        durationMs: BigInt(0),
      },
      community: new Uint8Array([]),
      grant: new Uint8Array([]),
      displayName: '',
    })

    await this.client.sendWakuMessage(
      'TYPE_CHAT_MESSAGE',
      payload,
      this.contentTopic,
      this.symmetricKey
    )
  }

  public sendImageMessage = async (image: ImageMessage) => {
    const payload = ChatMessageProto.encode({
      clock: BigInt(Date.now()),
      timestamp: BigInt(Date.now()),
      text: '',
      responseTo: '',
      ensName: '',
      chatId: this.id,
      messageType: 'COMMUNITY_CHAT' as MessageType,
      contentType: ChatMessageProto.ContentType.TEXT_PLAIN,
      sticker: { hash: '', pack: 0 },
      image: {
        type: image.type,
        payload: image.payload,
      },
      audio: {
        type: 'AAC',
        payload: new Uint8Array([]),
        durationMs: BigInt(0),
      },
      community: new Uint8Array([]),
      grant: new Uint8Array([]),
      displayName: '',
    })

    await this.client.sendWakuMessage(
      'TYPE_CHAT_MESSAGE',
      payload,
      this.contentTopic,
      this.symmetricKey
    )
  }

  public editMessage = async (messageId: string, text: string) => {
    // todo?: check if message exists

    if (text === '') {
      throw new Error('Text message cannot be empty')
    }

    const payload = EditMessage.encode({
      clock: BigInt(Date.now()),
      text,
      messageId,
      chatId: this.id,
      grant: new Uint8Array([]),
      messageType: 'COMMUNITY_CHAT' as MessageType,
    })

    await this.client.sendWakuMessage(
      'TYPE_EDIT_MESSAGE',
      payload,
      this.contentTopic,
      this.symmetricKey
    )
  }

  public deleteMessage = async (messageId: string) => {
    // todo: check if message exists

    const payload = DeleteMessage.encode({
      clock: BigInt(Date.now()),
      messageId,
      chatId: this.id,
      grant: new Uint8Array([]),
      messageType: 'COMMUNITY_CHAT' as MessageType,
    })

    await this.client.sendWakuMessage(
      'TYPE_DELETE_MESSAGE',
      payload,
      this.contentTopic,
      this.symmetricKey
    )
  }

  public sendReaction = async (
    messageId: string,
    reaction: keyof ChatMessage['reactions']
  ) => {
    if (!this.client.account) {
      throw new Error('Account not initialized')
    }

    const message = this.getMessage(messageId)

    if (!message) {
      throw new Error('Message not found')
    }

    const retracted = message.reactions[reaction].has(
      this.client.account.publicKey
    )

    const payload = EmojiReaction.encode({
      clock: BigInt(Date.now()),
      chatId: this.id,
      messageType: 'COMMUNITY_CHAT' as MessageType,
      messageId,
      type: reaction,
      retracted,
      grant: new Uint8Array([]),
    })

    await this.client.sendWakuMessage(
      'TYPE_EMOJI_REACTION',
      payload,
      this.contentTopic,
      this.symmetricKey
    )
  }
}
