import { waku_message } from 'js-waku'
import { hexToBytes } from 'js-waku/build/main/lib/utils'
import difference from 'lodash/difference'

import { ChatMessage } from '~/protos/chat-message'
import { CommunityRequestToJoin } from '~/protos/communities'
import { EmojiReaction } from '~/protos/emoji-reaction'

import { idToContentTopic } from '../../contentTopic'
import { createSymKeyFromPassword } from '../../encryption'
import { createChannelContentTopics } from './create-channel-content-topics'
import { fetchChannelChatMessages } from './fetch-channel-chat-messages'
import { handleChannelChatMessage } from './handle-channel-chat-message'
import { handleCommunity } from './handle-community'

import type { Client } from '../../client'
import type { CommunityDescription } from '../../wire/community_description'
import type { Reactions } from './get-reactions'
import type { ImageMessage } from '~/src/proto/communities/v1/chat_message'
import type { Waku, WakuMessage } from 'js-waku'

export type CommunityMetadataType = CommunityDescription['proto']

export type MessageType = ChatMessage & {
  messageId: string
  pinned: boolean
  reactions: Reactions
  channelId: string
  responseToMessage?: Omit<MessageType, 'responseToMessage'>
}

export class Community {
  private client: Client
  private waku: Waku
  public communityPublicKey: string
  // fixme!
  private communityContentTopic!: string
  private communityDecryptionKey!: Uint8Array
  public communityMetadata!: CommunityMetadataType
  public channelMessages: Partial<{ [key: string]: MessageType[] }> = {}
  private channelMessagesCallbacks: {
    [key: string]: (messages: MessageType[]) => void
  } = {}

  private communityCallback:
    | ((community: CommunityMetadataType) => void)
    | undefined

  constructor(client: Client, waku: Waku, publicKey: string) {
    this.client = client
    this.waku = waku
    this.communityPublicKey = publicKey
  }

  public async start() {
    this.communityContentTopic = idToContentTopic(this.communityPublicKey)
    this.communityDecryptionKey = await createSymKeyFromPassword(
      this.communityPublicKey
    )

    // Waku
    this.waku.store.addDecryptionKey(this.communityDecryptionKey)

    // Community
    const communityMetadata = await this.fetchCommunity()

    if (!communityMetadata) {
      throw new Error('Failed to intiliaze Community')
    }

    this.communityMetadata = communityMetadata

    await this.observeCommunity()

    // Channels
    await this.observeChannelMessages(Object.keys(this.communityMetadata.chats))
  }

  public fetchCommunity = async () => {
    let communityMetadata: CommunityMetadataType | undefined
    let shouldStop = false

    await this.waku.store.queryHistory([this.communityContentTopic], {
      decryptionKeys: [this.communityDecryptionKey],
      callback: wakuMessages => {
        for (const wakuMessage of wakuMessages.reverse()) {
          const message = handleCommunity(wakuMessage)

          if (!message) {
            return shouldStop
          }

          communityMetadata = message
          shouldStop = true

          return shouldStop
        }
      },
    })

    return communityMetadata
  }

  // todo?: rename and implement as "fetch history" (e.g. emojis, however, would arrive first and not match)
  public createFetchChannelMessages = async (
    channelId: string,
    callback: (messages: MessageType[]) => void
  ) => {
    const id = `${this.communityPublicKey}${channelId}`
    const channelContentTopic = idToContentTopic(id)
    // todo?: keep in state instead and replace the factory
    const symKey = await createSymKeyFromPassword(id)

    return async (options: { start: Date; end?: Date }) => {
      const messages = await fetchChannelChatMessages(
        this.waku,
        symKey,
        channelContentTopic,
        this.channelMessages[channelId] ?? [],
        options,
        callback
      )

      if (!messages.length) {
        return
      }

      // state
      this.channelMessages[channelId] = messages

      return
    }
  }

  private observeCommunity = () => {
    this.waku.relay.addDecryptionKey(this.communityDecryptionKey)
    this.waku.relay.addObserver(this.handleCommunity, [
      this.communityContentTopic,
    ])
  }

  private observeChannelMessages = async (chatsIds: string[]) => {
    const symKeyPromises = chatsIds.map(async (chatId: string) => {
      const id = `${this.communityPublicKey}${chatId}`
      const channelContentTopic = idToContentTopic(id)

      const symKey = await createSymKeyFromPassword(id)

      // todo?: request waku feature to be passed as param
      this.waku.relay.addDecryptionKey(symKey, {
        method: waku_message.DecryptionMethod.Symmetric,
        contentTopics: [channelContentTopic],
      })

      return channelContentTopic
    })
    const contentTopics = await Promise.all(symKeyPromises)

    this.waku.relay.addObserver(this.handleMessage, contentTopics)
  }

  private unobserveChannelMessages = (chatIds: string[]) => {
    const contentTopics = createChannelContentTopics(
      chatIds,
      this.communityPublicKey
    )

    this.waku.relay.deleteObserver(this.handleMessage, contentTopics)
  }

  private handleCommunity = (wakuMessage: WakuMessage) => {
    const communityMetadata = handleCommunity(wakuMessage)

    if (!communityMetadata) {
      return
    }

    // Channels
    const removedChats = difference(
      Object.keys(this.communityMetadata.chats),
      Object.keys(communityMetadata.chats)
    )
    const addedChats = difference(
      Object.keys(communityMetadata.chats),
      Object.keys(communityMetadata.chats)
    )

    if (removedChats.length) {
      this.unobserveChannelMessages(removedChats)
    }

    if (addedChats.length) {
      this.observeChannelMessages(addedChats)
    }

    // Community
    this.communityCallback?.(communityMetadata)
  }

  private handleMessage = (wakuMessage: WakuMessage) => {
    const messages = handleChannelChatMessage(
      wakuMessage,
      this.channelMessages,
      this.client.account?.publicKey
    )

    if (!messages.length) {
      return
    }

    // state
    const channelId = messages[0].channelId

    this.channelMessages[channelId] = messages

    // callback
    // todo!: review use of ! why not just use messages defined above?
    this.channelMessagesCallbacks[channelId]?.(this.channelMessages[channelId]!)
  }

  public getMessages(channelId: string): MessageType[] {
    return this.channelMessages[channelId] ?? []
  }

  public onCommunityUpdate = (
    callback: (community: CommunityMetadataType) => void
  ) => {
    this.communityCallback = callback

    return () => {
      this.communityCallback = undefined
    }
  }

  public onChannelMessageUpdate = (
    channelId: string,
    callback: (messages: MessageType[]) => void
  ) => {
    this.channelMessagesCallbacks[channelId] = callback

    return () => {
      delete this.channelMessagesCallbacks[channelId]
    }
  }

  public sendTextMessage = async (
    chatUuid: string,
    text: string,
    responseTo?: string
  ) => {
    const chat = this.communityMetadata.chats[chatUuid]

    if (!chat) {
      throw new Error('Chat not found')
    }

    // TODO: move to chat instance
    const chatId = `${this.communityPublicKey}${chatUuid}`
    const channelContentTopic = idToContentTopic(chatId)
    const symKey = await createSymKeyFromPassword(chatId)

    // TODO: protos does not support optional fields :-(
    const payload = ChatMessage.encode({
      clock: BigInt(Date.now()),
      timestamp: BigInt(Date.now()),
      text,
      responseTo: responseTo ?? '',
      ensName: '',
      chatId,
      messageType: 'COMMUNITY_CHAT',
      contentType: ChatMessage.ContentType.TEXT_PLAIN,
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

    await this.client.sendMessage(
      'TYPE_CHAT_MESSAGE',
      payload,
      channelContentTopic,
      symKey
    )
  }

  public sendImageMessage = async (chatUuid: string, image: ImageMessage) => {
    const chat = this.communityMetadata.chats[chatUuid]

    if (!chat) {
      throw new Error('Chat not found')
    }

    // TODO: move to chat instance
    const chatId = `${this.communityPublicKey}${chatUuid}`
    const channelContentTopic = idToContentTopic(chatId)
    const symKey = await createSymKeyFromPassword(chatId)

    const payload = ChatMessage.encode({
      clock: BigInt(Date.now()),
      timestamp: BigInt(Date.now()),
      text: '',
      responseTo: responseTo ?? '',
      ensName: '',
      chatId,
      messageType: 'COMMUNITY_CHAT',
      contentType: ChatMessage.ContentType.TEXT_PLAIN,
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

    await this.client.sendMessage(
      'TYPE_CHAT_MESSAGE',
      payload,
      channelContentTopic,
      symKey
    )
  }

  public sendReaction = async (
    chatId: string,
    messageId: string,
    reaction: EmojiReaction.Type
  ) => {
    // const chat = this.communityMetadata.chats[chatId]

    // if (!chat) {
    //   throw new Error('Chat not found')
    // }

    // TODO: move to chat instance
    // const chatId = `${this.communityPublicKey}${chatUuid}`
    const channelContentTopic = idToContentTopic(chatId)
    const symKey = await createSymKeyFromPassword(chatId)

    // TODO: protos does not support optional fields :-(
    const payload = EmojiReaction.encode({
      clock: BigInt(Date.now()),
      chatId: chatId,
      messageType: 'COMMUNITY_CHAT',
      grant: new Uint8Array([]),
      messageId,
      retracted: false,
      type: reaction,
    })

    await this.client.sendMessage(
      'TYPE_EMOJI_REACTION',
      payload,
      channelContentTopic,
      symKey
    )
  }

  public requestToJoin = async (chatUuid: string) => {
    if (!this.client.account) {
      throw new Error('Account not found')
    }

    const chat = this.communityMetadata.chats[chatUuid]

    if (!chat) {
      throw new Error('Chat not found')
    }

    // TODO: move to chat instance
    const chatId = `${this.communityPublicKey}${chatUuid}`

    const payload = CommunityRequestToJoin.encode({
      clock: BigInt(Date.now()),
      chatId,
      communityId: hexToBytes(this.communityPublicKey),
      ensName: '',
    })

    await this.client.sendMessage(
      'TYPE_COMMUNITY_REQUEST_TO_JOIN',
      payload,
      this.communityContentTopic,
      this.communityDecryptionKey
    )
  }
}
