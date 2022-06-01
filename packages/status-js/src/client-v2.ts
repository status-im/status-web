import { getPredefinedBootstrapNodes, Waku } from 'js-waku'

import { ApplicationMetadataMessage } from '../protos/application-metadata-message'
import { ChatMessage } from '../protos/chat-message'
import { CommunityChat, CommunityDescription } from '../protos/communities'
import { idToContentTopic } from './contentTopic'
import { createSymKeyFromPassword } from './encryption'
import { hexToBuf } from './utils'

import type { WakuMessage } from 'js-waku'

export interface ClientOptions {
  publicKey: string
  env?: 'production' | 'test'
  callback: (message: ChatMessage) => void
}

export class Client {
  options: ClientOptions
  publicKey: string
  callback: (message: ChatMessage) => void
  waku?: Waku
  communityDescription?: CommunityDescription
  clocks: Record<string, Date>

  constructor(options: ClientOptions) {
    this.options = options
    this.publicKey = options.publicKey
    this.callback = options.callback
    this.clocks = {}
  }

  public async start() {
    console.log(getPredefinedBootstrapNodes('test'))
    this.waku = await Waku.create(
      this.options.env === 'test'
        ? {
            bootstrap: {
              peers: [
                '/dns4/node-01.gc-us-central1-a.wakuv2.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAmJb2e28qLXxT5kZxVUUoJt72EMzNGXB47Rxx5hw3q4YjS',
              ],
            },
          }
        : { bootstrap: { default: true } }
    )

    console.log('here')

    await this.waku.waitForRemotePeer()
  }

  public async getCommunityDescription(): Promise<CommunityDescription> {
    if (!this.waku) {
      throw new Error('Waku not started')
    }

    const contentTopic = idToContentTopic(this.options.publicKey)

    try {
      // const symKey = await createSymKeyFromPassword(hexCommunityPublicKey)
      const symKey = await createSymKeyFromPassword(this.options.publicKey)

      await this.waku.store.queryHistory([contentTopic], {
        callback: messages => {
          for (const message of messages.reverse()) {
            if (!message.payload) {
              return
            }
            // try {
            const metadata = ApplicationMetadataMessage.decode(message.payload)
            if (!metadata.payload) {
              return
            }

            const communityDescription = CommunityDescription.decode(
              metadata.payload
            )

            if (communityDescription.identity) {
              this.communityDescription = communityDescription
              this.observeCommunityChats(communityDescription.chats)
              return true
            }
          }
        },
        decryptionKeys: [symKey],
      })
    } catch (error) {
      console.log(error)
      throw error
    }

    if (!this.communityDescription) {
      throw new Error('Community not found')
    }

    return this.communityDescription
  }

  private observeCommunityChats(chats: CommunityDescription['chats']) {
    const contentTopics = Object.entries(chats).map(([chatUuid, chat]) => {
      const chatId = `${this.publicKey}${chatUuid}`
      return idToContentTopic(chatId)
    })

    this.waku!.relay.addObserver(this.handleMessage, contentTopics)
  }

  private async handleMessage(message: WakuMessage) {
    if (!message.payload || !message.timestamp) {
      return
    }

    // handle increment of Lamport clock
    const { timestamp, payload } = message
    const metadata = ApplicationMetadataMessage.decode(payload)

    // decode and validate before sending to consumers of status-js
    switch (metadata.type) {
      case ApplicationMetadataMessage.Type.TYPE_CHAT_MESSAGE: {
        const chatMessage = ChatMessage.decode(metadata.payload)

        this.clocks[chatMessage.chatId] = timestamp
        this.callback(chatMessage)
        return
      }

      // case ApplicationMetadataMessage.Type.TYPE_EMOJI_REACTION: {
      //   return
      // }

      default: {
        console.log('Unknown message type:', metadata.type)
      }
    }
  }

  async sendMessage(message: any) {}
}

export const createClient = async (options: ClientOptions) => {
  const client = new Client(options)
  await client.start()
  return client
}
