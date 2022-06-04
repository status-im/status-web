import debug from 'debug'

import { Chat } from './chat'
import { idToContentTopic } from './contentTopic'
import { ApplicationMetadataMessage_Type } from './proto/status/v1/application_metadata_message'
import { bufToHex, hexToBuf } from './utils'
import { ApplicationMetadataMessage } from './wire/application_metadata_message'
import { ChatMessage } from './wire/chat_message'
import { CommunityDescription } from './wire/community_description'

import type { CommunityChat } from './wire/community_chat'
import type { Waku, WakuMessage } from 'js-waku'
import { createSymKeyFromPassword } from './encryption'
// import { createSymKeyFromPassword } from './encryption'

type Events = 'communityfetch' | 'communityudpate' | 'channelmessagereceive'

const dbg = debug('communities:community')

export class Community {
  public publicKey: Uint8Array
  private waku: Waku
  // TODO?: rename to channels
  public chats: Map<string, Chat> // Chat id, Chat
  public description?: CommunityDescription

  constructor(publicKey: Uint8Array, waku: Waku) {
    this.publicKey = publicKey
    this.waku = waku
    this.chats = new Map()
  }

  // TODO: explain why init func instead of constructor
  /**
   * Instantiate a Community by retrieving its details from the Waku network.
   *
   * This class is used to interact with existing communities only,
   * the Status Desktop or Mobile app must be used to manage a community.
   *
   * @param publicKey The community's public key in hex format.
   * Can be found in the community's invite link: https://join.status.im/c/<public key>
   * @param waku The Waku instance, used to retrieve Community information from the network.
   */
  public static async instantiateCommunity(
    publicKey: string,
    waku: Waku
  ): Promise<Community> {
    const community = new Community(hexToBuf(publicKey), waku)

    await community.refreshCommunityDescription()

    return community
  }

  public get publicKeyStr(): string {
    return bufToHex(this.publicKey)
  }

  /**
   * Retrieve and update community information from the network.
   * Uses most recent community description message available.
   */
  async refreshCommunityDescription(): Promise<void> {
    const desc = await CommunityDescription.retrieve(
      this.publicKey,
      this.waku.store
    )

    if (!desc) {
      dbg(`Failed to retrieve Community Description for ${this.publicKeyStr}`)
      return
    }

    this.description = desc

    await Promise.all(
      Array.from(this.description.chats).map(([chatUuid, communityChat]) => {
        return this.instantiateChat(chatUuid, communityChat)
      })
    )
  }

  /**
   * Instantiate [[Chat]] object based on the passed chat name.
   * The Chat MUST already be part of the Community and the name MUST be exact (including casing).
   *
   * @throws string If the Community Description is unavailable or the chat is not found;
   */
  private async instantiateChat(
    chatUuid: string,
    communityChat: CommunityChat
  ): Promise<void> {
    if (!this.description)
      throw 'Failed to retrieve community description, cannot instantiate chat'

    const chatId = this.publicKeyStr + chatUuid
    if (this.chats.get(chatId)) return

    const chat = await Chat.create(chatId, communityChat)

    this.chats.set(chatId, chat)
  }
}

class CommunityBeta {
  private waku: Waku
  private publicKey: string
  private callbacks: any = {}
  private communityData: any = {}
  private channelEvents: any = {}
  private symKey

  private channels: Record<string, ChatMessage[]> = {}

  constructor(waku: Waku, publicKey: string) {
    this.waku = waku
    this.publicKey = publicKey
  }

  // todo: observer only if some callbacks set
  // todo: doc as to be called after callbacks have been added
  public async start() {
    this.symKey = await createSymKeyFromPassword(this.publicKey)

    const communityTopic = idToContentTopic(this.publicKey)

    await this.fetchCommunity(communityTopic)
    // this.observeCommunity(communityTopic)

    // const channelTopics = []
    // this.observeChannelMessages(channelTopics)
  }

  // TODO: should return unsubscribe function
  public addCallback(type: Events, callback: () => void) {
    const callbacks = this.callbacks[type]

    if (!callbacks?.length) {
      this.callbacks[type] = [callback]
    } else {
      this.callbacks[type].push(callback)
    }

    return () => {
      this.callbacks[type].filter(cb => cb === callback)
    }
  }

  private async fetchCommunity(topic: string): Promise<void> {
    let payload = undefined

    // todo: request Waku to replace callbacks
    await this.waku.store
      .queryHistory([topic], {
        decryptionKeys: [this.symKey],
        callback: messages => {
          for (const message of messages.reverse()) {
            if (!message.payload) {
              return
            }

            const decodedMetadata = ApplicationMetadataMessage.decode(
              message.payload
            )
            if (!decodedMetadata.payload) {
              return
            }

            const decodedPayload = CommunityDescription.decode(
              decodedMetadata.payload
            )
            // todo: explain
            if (!decodedPayload.identity) {
              return
            }

            payload = decodedPayload

            //           this.channels[chatId] = [
            //             ...maessages,
            //             ...this.channels[chatId]
            //           ]

            // this.callbacks[''].forEach(cb => cb(this.channels[chatId]))

            return true
          }
        },
      })
      .catch(error => {
        console.error(error)
      })

    if (payload) {
      const result = {
        name: undefined,
        description: undefined,
        color: undefined,
        channels: undefined,
        members: undefined,
      }

      // todo: set `this.communityData`
      this.callbacks['communityfetch'].forEach(callback => callback(result))
    }

    // todo: handle no (valid) messages case
  }

  private observeCommunity(topic: string) {
    let payload = undefined

    this.waku.relay.addObserver(
      message => {
        if (!message.payload) {
          return
        }

        const decodedMetadata = ApplicationMetadataMessage.decode(
          message.payload
        )
        if (!decodedMetadata.payload) {
          return
        }

        const decodedPayload = CommunityDescription.decode(
          decodedMetadata.payload
        )
        // todo: explain
        if (!decodedPayload.identity) {
          return
        }

        payload = decodedPayload
      },
      [topic]
    )

    if (payload) {
      const result = {
        name: undefined,
        description: undefined,
        color: undefined,
        channels: undefined,
        members: undefined,
      }

      this.callbacks['communityupdate'].forEach(callback => callback(result))
    }

    // todo: handle no (valid) messages case
  }

  private observeChannelMessages(topics: string[]) {
    let payload = undefined

    this.waku.relay.addObserver(message => {
      if (!message.payload || !message.timestamp) {
        return
      }

      const decodedMetadata = ApplicationMetadataMessage.decode(message.payload)
      if (!decodedMetadata.payload) {
        return
      }

      switch (decodedMetadata.type) {
        case ApplicationMetadataMessage_Type.TYPE_CHAT_MESSAGE: {
          const message = ChatMessage.decode(decodedMetadata.payload)

          this.channels[message.chatId].push(message)
          this.callbacks.forEach(callback => callback(this.channels[chatId]))

          // handle chat message
          // push

          payload = message
          return
        }
        default:
          return
      }
    }, topics)

    if (payload) {
      // todo: push to `this.channelEvents` by type

      this.callbacks['channelmessagereceive'].forEach(callback =>
        callback(result)
      )
    }

    // todo: handle no (valid) messages case
  }
}

export function createCommunityBeta(waku: Waku, publicKey: string) {
  const community = new CommunityBeta(waku, publicKey)

  return community
}
