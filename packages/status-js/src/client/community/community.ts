import { waku_message } from 'js-waku'
import difference from 'lodash/difference'

import { MessageType } from '~/protos/enums'

import { idToContentTopic } from '../../contentTopic'
import { createSymKeyFromPassword } from '../../encryption'
import { Chat } from '../chat'

import type { Client } from '../../client'
import type { CommunityDescription } from '../../wire/community_description'
import type { Waku } from 'js-waku'

export type CommunityMetadataType = CommunityDescription['proto']

export class Community {
  private client: Client
  // todo?: use client.waku instead
  private waku: Waku

  // todo: remove community prefix
  public communityPublicKey: string
  private communityContentTopic!: string
  private communityDecryptionKey!: Uint8Array
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
    await this.observeChatMessages(Object.keys(this.communityMetadata.chats))
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

  private observeChatMessages = async (chatUuids: string[]) => {
    const chatPromises = chatUuids.map(async (chatUuid: string) => {
      const chat = await Chat.create(this.client, {
        uuid: chatUuid,
        communityPublicKey: this.communityPublicKey,
        type: MessageType.COMMUNITY_CHAT,
      })

      this.chats.set(chatUuid, chat)

      this.waku.relay.addDecryptionKey(chat.symetricKey, {
        method: waku_message.DecryptionMethod.Symmetric,
        contentTopics: [chat.contentTopic],
      })

      return chat.contentTopic
    })

    const contentTopics = await Promise.all(chatPromises)

    this.waku.relay.addObserver(this.client.handleWakuMessage, contentTopics)
  }

  private unobserveChatMessages = (chatUuids: string[]) => {
    const contentTopics = chatUuids.map(chatUuid => {
      const id = `${this.communityPublicKey}${chatUuid}`
      const contentTopic = idToContentTopic(id)

      return contentTopic
    })

    this.waku.relay.deleteObserver(this.client.handleWakuMessage, contentTopics)
  }

  public handleCommunityMetadataEvent = (
    communityMetadata: CommunityMetadataType
  ) => {
    if (this.communityMetadata) {
      if (this.communityMetadata.clock > communityMetadata.clock) {
        return
      }

      // Chats
      const removedChats = difference(
        Object.keys(this.communityMetadata.chats),
        Object.keys(communityMetadata.chats)
      )
      const addedChats = difference(
        Object.keys(communityMetadata.chats),
        Object.keys(this.communityMetadata.chats)
      )

      if (removedChats.length) {
        this.unobserveChatMessages(removedChats)
      }

      if (addedChats.length) {
        // fixme?: await
        this.observeChatMessages(addedChats)
      }
    }

    // Community
    this.communityMetadata = communityMetadata
    this.communityCallback?.(communityMetadata)
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
