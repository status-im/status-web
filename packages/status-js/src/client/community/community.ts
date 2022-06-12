import { waku_message } from 'js-waku'

import { MessageType } from '~/protos/enums'
import { getDifferenceByKeys } from '~/src/helpers/get-difference-by-keys'

import { idToContentTopic } from '../../contentTopic'
import { createSymKeyFromPassword } from '../../encryption'
import { Chat } from '../chat'

import type { Client } from '../../client'
import type {
  CommunityChat,
  CommunityDescription,
} from '~/src/proto/communities/v1/communities'
import type { Waku } from 'js-waku'

// todo: rename
export type CommunityMetadataType = CommunityDescription

export class Community {
  private client: Client
  // todo?: use client.waku instead
  private waku: Waku

  // todo: remove community prefix
  public communityPublicKey: string
  private communityContentTopic!: string
  private communityDecryptionKey!: Uint8Array
  // todo: rename to description
  public communityMetadata!: CommunityMetadataType
  public chats: Map<string, Chat>
  public communityCallback:
    | ((community: CommunityMetadataType) => void)
    | undefined

  constructor(client: Client, waku: Waku, publicKey: string) {
    this.client = client
    this.waku = waku
    this.communityPublicKey = publicKey

    this.chats = new Map()
  }

  public async start() {
    this.communityContentTopic = idToContentTopic(this.communityPublicKey)
    // todo: rename
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

    // Chats
    // fixme?: don't await
    await this.observeChatMessages(this.communityMetadata.chats)
  }

  public fetchCommunity = async () => {
    let communityMetadata: CommunityMetadataType | undefined
    let shouldStop = false

    await this.waku.store.queryHistory([this.communityContentTopic], {
      decryptionKeys: [this.communityDecryptionKey],
      // oldest message first
      callback: wakuMessages => {
        let index = wakuMessages.length

        // most recent page first
        while (--index >= 0) {
          this.client.handleWakuMessage(wakuMessages[index])

          if (!this.communityMetadata) {
            return shouldStop
          }

          communityMetadata = this.communityMetadata
          shouldStop = true

          return shouldStop
        }
      },
    })

    return communityMetadata
  }

  private observeCommunity = () => {
    this.waku.relay.addDecryptionKey(this.communityDecryptionKey)
    this.waku.relay.addObserver(this.client.handleWakuMessage, [
      this.communityContentTopic,
    ])
  }

  private observeChatMessages = async (
    chatProtos: CommunityDescription['chats']
  ) => {
    const chatPromises = Object.entries(chatProtos).map(
      async ([chatUuid, chatProto]: [string, CommunityChat]) => {
        const chat = await Chat.create(this, this.client, {
          type: MessageType.COMMUNITY_CHAT,
          uuid: chatUuid,
          ...chatProto,
        })
        const contentTopic = chat.contentTopic

        this.chats.set(chatUuid, chat)

        this.waku.relay.addDecryptionKey(chat.symetricKey, {
          method: waku_message.DecryptionMethod.Symmetric,
          contentTopics: [contentTopic],
        })

        return contentTopic
      }
    )

    const contentTopics = await Promise.all(chatPromises)

    this.waku.relay.addObserver(this.client.handleWakuMessage, contentTopics)
  }

  private unobserveChatMessages = (
    chatProtos: CommunityDescription['chats']
  ) => {
    const contentTopics = Object.keys(chatProtos).map(chatUuid => {
      const chat = this.chats.get(chatUuid)
      const contentTopic = chat!.contentTopic

      this.chats.delete(chatUuid)

      return contentTopic
    })

    this.waku.relay.deleteObserver(this.client.handleWakuMessage, contentTopics)
  }

  public handleCommunityDescription = (
    communityMetadata: CommunityMetadataType
  ) => {
    if (this.communityMetadata) {
      if (this.communityMetadata.clock > communityMetadata.clock) {
        return
      }

      // todo: update chats props
      // Chats
      // observe
      const removedChats = getDifferenceByKeys(
        this.communityMetadata.chats,
        communityMetadata.chats
      )
      if (removedChats.length) {
        this.unobserveChatMessages(removedChats)
      }

      const addedChats = getDifferenceByKeys(
        communityMetadata.chats,
        this.communityMetadata.chats
      )
      if (addedChats.length) {
        // fixme?: await
        this.observeChatMessages(addedChats)
      }
    }

    // Community
    // state
    this.communityMetadata = communityMetadata

    // callback
    this.communityCallback?.(this.communityMetadata)

    // Chats
    // handle
    // this.chats.forEach()
  }

  public onCommunityUpdate = (
    callback: (community: CommunityMetadataType) => void
  ) => {
    this.communityCallback = callback

    return () => {
      this.communityCallback = undefined
    }
  }
}
