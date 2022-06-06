// todo: replies
// todo: identities/members?
// todo: validate sig
// todo: observer contact updates
// todo: observer channels

// denormalized
// before calling callback; response to message id
// proactively change
import { bytesToHex } from 'ethereum-cryptography/utils'
import { Waku, waku_message } from 'js-waku'
import difference from 'lodash/difference'
import sortBy from 'lodash/sortBy'
import uniqBy from 'lodash/uniqBy'

import { ApplicationMetadataMessage } from '../protos/application-metadata-message'
// import { ChatIdentity } from '../protos/chat-identity'
import { ChatMessage, DeleteMessage, EditMessage } from '../protos/chat-message'
import { EmojiReaction } from '../protos/emoji-reaction'
import { PinMessage } from '../protos/pin-message'
import { ProtocolMessage } from '../protos/protocol-message'
import { Account } from './account'
import { fetchChannelMessages } from './client/community/fetch-channel-messages'
// import { ChatIdentity } from './wire/chat_identity'
import { idToContentTopic } from './contentTopic'
import { createSymKeyFromPassword } from './encryption'
import { payloadToId } from './utils/payload-to-id'
import { recoverPublicKeyFromMetadata } from './utils/recover-public-key-from-metadata'
import { CommunityDescription } from './wire/community_description'

import type { WakuMessage } from 'js-waku'

// todo: rename to chat
type CommunityType = CommunityDescription['proto']
type ChannelType = any
export type MessageType = ChatMessage & {
  messageId: string
  pinned: boolean
  reactions: Reactions
}

type Reaction =
  | 'heart'
  | 'thumbs-up'
  | 'thumbs-down'
  | 'smile'
  | 'sad'
  | 'angry'

type Reactions = {
  [key in Reaction]: {
    count: number
    me: boolean
  }
}

export interface ClientOptions {
  publicKey: string
  env?: 'production' | 'test'
}

class Client {
  private waku!: Waku
  private communityPublicKey: string

  public account?: Account
  // fixme
  public community!: Community

  constructor(options: ClientOptions) {
    this.communityPublicKey = options.publicKey
  }

  public async start() {
    const waku = await Waku.create({
      bootstrap: {
        default: false,
        peers: [
          '/dns4/node-01.gc-us-central1-a.wakuv2.test.statusim.net/tcp/443/wss/p2p/16Uiu2HAmJb2e28qLXxT5kZxVUUoJt72EMzNGXB47Rxx5hw3q4YjS',
          // '/dns4/node-01.do-ams3.wakuv2.test.statusim.net/tcp/8000/wss/p2p/16Uiu2HAmPLe7Mzm8TsYUubgCAW1aJoeFScxrLj8ppHFivPo97bUZ',
          // '/dns4/node-01.do-ams3.status.test.statusim.net/tcp/30303/p2p/16Uiu2HAkukebeXjTQ9QDBeNDWuGfbaSg79wkkhK4vPocLgR6QFDf'
        ],
      },
      libp2p: { config: { pubsub: { enabled: true, emitSelf: true } } },
    })
    await waku.waitForRemotePeer()
    this.waku = waku

    const community = new Community(this, waku, this.communityPublicKey)
    await community.start()
    this.community = community
  }

  public async stop() {
    await this.waku.stop()
  }

  public createAccount = (): Account => {
    this.account = new Account()
    return this.account
  }

  // TODO?: should this exist
  // public deleteAccount = () => {
  //   this.account = undefined
  // }
}

class Community {
  private client: Client
  private waku: Waku
  public communityPublicKey: string
  private communityContentTopic!: string
  private communityDecryptionKey!: Uint8Array
  public communityMetadata!: CommunityType
  public channelMessages: Partial<{ [key: string]: MessageType[] }> = {}
  private channelCallbacks: {
    [key: string]: (channel: ChannelType) => void
  } = {}
  private channelMessagesCallbacks: {
    [key: string]: (messages: MessageType[]) => void
  } = {}
  private communityCallback: ((community: CommunityType) => void) | undefined
  public fetchChannelMessages

  constructor(client: Client, waku: Waku, publicKey: string) {
    this.client = client
    this.waku = waku
    this.communityPublicKey = publicKey

    this.fetchChannelMessages = fetchChannelMessages(
      this,
      this.waku.store.queryHistory.bind(this.waku.store)
    )
  }

  public async start() {
    // Community
    this.communityContentTopic = idToContentTopic(this.communityPublicKey)
    this.communityDecryptionKey = await createSymKeyFromPassword(
      this.communityPublicKey
    )

    this.waku.store.addDecryptionKey(this.communityDecryptionKey)
    await this.fetchCommunity()

    // handle community not connected
    await this.observeCommunity()

    // Channel messages
    await this.observeChannelMessages(Object.keys(this.communityMetadata.chats))

    console.log('CLINET: STARTED')
    console.log('COMMUNITY:', this)
  }

  private async observeCommunity() {
    // console.log('here')
    this.waku.relay.addDecryptionKey(this.communityDecryptionKey)
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
        if (!decodedPayload.identity) {
          return
        }

        const removedChats = difference(
          Object.keys(this.communityMetadata.chats),
          Object.keys(decodedPayload.proto.chats)
        )
        const addedChats = difference(
          Object.keys(decodedPayload.proto.chats),
          Object.keys(this.communityMetadata.chats)
        )

        if (removedChats.length) {
          this.unobserveChannelMessages(removedChats)
        }

        if (addedChats.length) {
          this.observeChannelMessages(addedChats)
        }

        this.communityMetadata = decodedPayload.proto
        this.communityCallback?.(decodedPayload.proto)
      },
      [this.communityContentTopic]
    )
  }

  private async observeChannelMessages(chats: string[]) {
    const contentTopics: string[] = []

    for (const chatId of chats) {
      const id = `${this.communityPublicKey}${chatId}`
      const channelContentTopic = idToContentTopic(id)
      const symKey = await createSymKeyFromPassword(id)

      contentTopics.push(channelContentTopic)

      // todo: request waku feature to be passed as param
      // TODO?: use contentTopics as array instead of separate observer for each chat
      this.waku.relay.addDecryptionKey(symKey, {
        method: waku_message.DecryptionMethod.Symmetric,
        contentTopics: [channelContentTopic],
      })
    }

    // todo?: delete Waku observers
    // todo?: check if waku propagates errors
    // todo!: request Waku feature to accept decryption keys as a param
    this.waku.relay.addObserver(this.handleMessage, contentTopics)
    console.log('Added observer', contentTopics)
  }

  private unobserveChannelMessages(chatIds: string[]) {
    const contentTopics = chatIds.map(chatId => {
      const id = `${this.communityPublicKey}${chatId}`
      const channelContentTopic = idToContentTopic(id)

      return channelContentTopic
    })

    this.waku.relay.deleteObserver(this.handleMessage, contentTopics)
  }

  private handleMessage = (wakuMessage: WakuMessage) => {
    console.log('MESSAGE: HANDLE')
    if (!wakuMessage.payload) {
      return
    }

    const decodedProtocol = ProtocolMessage.decode(wakuMessage.payload)
    if (!decodedProtocol) {
      return
    }

    const decodedMetadata = ApplicationMetadataMessage.decode(
      decodedProtocol.publicMessage
      // message.payload
    )
    if (!decodedMetadata.payload) {
      return
    }

    try {
      const pk = recoverPublicKeyFromMetadata(decodedMetadata)
      console.log('pk', pk)
    } catch (err) {
      console.error(err)
    }

    console.log('MESSAGE: DECODED METADATA')

    let shouldUpdate = false
    let _decodedPayload:
      | ChatMessage
      | EditMessage
      | DeleteMessage
      | PinMessage
      | EmojiReaction
      | undefined
    switch (decodedMetadata.type) {
      case ApplicationMetadataMessage.Type.TYPE_CHAT_MESSAGE: {
        console.log('MESSAGE:')

        if (!wakuMessage.signaturePublicKey) {
          break
        }

        const messageId = payloadToId(
          decodedProtocol.publicMessage,
          wakuMessage.signaturePublicKey
        )
        const decodedPayload = ChatMessage.decode(decodedMetadata.payload)

        console.log('MESSAGE: DECODED')

        // todo: explain
        // if (!decodedMetadata.identity) {
        //   break
        // }
        // const decodedIdentity = ChatIdentity.decode(decodedProtocol.bundles[0].identity)

        // todo: handle already received messages

        // TODO?: ignore messages which are messageType !== COMMUNITY_CHAT

        const channelId = decodedPayload.chatId.slice(68)

        console.log('THIS:', this)

        if (!this.channelMessages[channelId]) {
          this.channelMessages[channelId] = []
        }

        console.log('THIS:', this)
        console.log('CHANNEL:', channelId)
        console.log('MESSAGES:', this.channelMessages)

        const channelMessage: MessageType = {
          ...decodedPayload,
          // ...decodedIdentity,
          messageId,
          pinned: false,
          reactions: {
            'thumbs-up': {
              count: 0,
              me: false,
            },
            'thumbs-down': {
              count: 0,
              me: false,
            },
            heart: {
              count: 0,
              me: false,
            },
            smile: {
              count: 0,
              me: false,
            },
            sad: {
              count: 0,
              me: false,
            },
            angry: {
              count: 0,
              me: false,
            },
          },
        }
        console.log('MESSAGE: PREMAPPED')

        this.channelMessages[channelId].push(channelMessage)

        shouldUpdate = true
        _decodedPayload = decodedPayload

        console.log('MESSAGE: MAPPED')

        break
      }
      case ApplicationMetadataMessage.Type.TYPE_EDIT_MESSAGE: {
        if (!wakuMessage.signaturePublicKey) {
          break
        }

        const decodedPayload = EditMessage.decode(decodedMetadata.payload)
        const channelId = decodedPayload.chatId.slice(68)
        const messageId = decodedPayload.messageId

        const msgs = this.channelMessages[channelId].map(message => {
          if (message.messageId === messageId) {
            shouldUpdate = true

            return {
              ...message,
              // fixme?: other fields that user can edit
              text: decodedPayload.text,
            }
          }

          return message
        })

        this.channelMessages[channelId] = msgs
        _decodedPayload = decodedPayload

        break
      }
      case ApplicationMetadataMessage.Type.TYPE_DELETE_MESSAGE: {
        const decodedPayload = DeleteMessage.decode(decodedMetadata.payload)
        const channelId = decodedPayload.chatId.slice(68)
        const messageId = decodedPayload.messageId

        const msgs = this.channelMessages[channelId].filter(message => {
          if (message.messageId === messageId) {
            shouldUpdate = true
            return false
          }
          return true
        })

        this.channelMessages[channelId] = msgs
        _decodedPayload = decodedPayload

        break
      }
      case ApplicationMetadataMessage.Type.TYPE_PIN_MESSAGE: {
        const decodedPayload = PinMessage.decode(decodedMetadata.payload)
        const channelId = decodedPayload.chatId.slice(68)
        const messageId = decodedPayload.messageId

        const message = this.channelMessages[channelId].find(
          message => message.messageId === messageId
        )

        if (message) {
          message.pinned = Boolean(decodedPayload.pinned)
          shouldUpdate = true
          _decodedPayload = decodedPayload
        }

        break
      }
      case ApplicationMetadataMessage.Type.TYPE_EMOJI_REACTION: {
        if (!wakuMessage.signaturePublicKey) {
          break
        }

        const decodedPayload = EmojiReaction.decode(decodedMetadata.payload)
        const channelId = decodedPayload.chatId.slice(68)
        const messageId = decodedPayload.messageId

        const message = this.channelMessages[channelId].find(
          message => message.messageId === messageId
        )

        if (message) {
          const isMe =
            this.client.account?.publicKey ===
            `0x${bytesToHex(wakuMessage.signaturePublicKey)}`

          // TODO?: not needed anymore
          message.reactions ??= {
            'thumbs-up': {
              count: 0,
              me: false,
            },
            'thumbs-down': {
              count: 0,
              me: false,
            },
            heart: {
              count: 0,
              me: false,
            },
            smile: {
              count: 0,
              me: false,
            },
            sad: {
              count: 0,
              me: false,
            },
            angry: {
              count: 0,
              me: false,
            },
          }
          // fixme?: mutates
          setReactions(message.reactions, decodedPayload, isMe)

          shouldUpdate = true
          _decodedPayload = decodedPayload
        }

        break
      }

      default:
        break
    }

    if (shouldUpdate && _decodedPayload) {
      const channelId = _decodedPayload.chatId.slice(68)
      const messages = this.channelMessages[channelId] ?? []

      const sortedMessages = sortBy(messages, ['timestamp'])
      // todo: do not use
      const uniqueChannelMessages = uniqBy(sortedMessages, 'messageId')

      this.channelMessages[channelId] = uniqueChannelMessages
      this.channelMessagesCallbacks[channelId]?.(
        this.channelMessages[channelId]
      )

      console.log('MESSAGE: NEW', messages, channelId)
    }
  }

  public async fetchCommunity() {
    let community: CommunityType | undefined

    await this.waku.store.queryHistory([this.communityContentTopic], {
      decryptionKeys: [this.communityDecryptionKey],
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

          community = decodedPayload.proto
          this.communityMetadata = decodedPayload.proto

          return true
        }
      },
    })

    return community
  }

  public getMessages(channelId: string): MessageType[] {
    return this.channelMessages[channelId] ?? []
  }

  public onCommunityUpdate(callback: (community: CommunityType) => void) {
    this.communityCallback = callback

    return () => {
      this.communityCallback = undefined
    }
  }

  public onChannelUpdate(
    channelId: string,
    callback: (channel: ChannelType) => void
  ) {
    this.channelCallbacks[channelId] = callback

    return () => {
      delete this.channelCallbacks[channelId]
    }
  }

  public onChannelMessageUpdate(
    channelId: string,
    callback: (messages: MessageType[]) => void
  ) {
    this.channelMessagesCallbacks[channelId] = callback

    return () => {
      delete this.channelMessagesCallbacks[channelId]
    }
  }
}

// fixme: type
const REACTION_MAP: Record<EmojiReaction.Type, string> = {
  [EmojiReaction.Type.LOVE]: 'heart',
  [EmojiReaction.Type.THUMBS_UP]: 'thumbs-up',
  [EmojiReaction.Type.THUMBS_DOWN]: 'thumbs-down',
  [EmojiReaction.Type.LAUGH]: 'smile',
  [EmojiReaction.Type.SAD]: 'sad',
  [EmojiReaction.Type.ANGRY]: 'angry',
  [EmojiReaction.Type.UNKNOWN_EMOJI_REACTION_TYPE]: 'unknown',
}

function setReactions(
  reactions: Reactions,
  reaction: EmojiReaction,
  isMe: boolean
) {
  const type = REACTION_MAP[reaction.type]
  const isRetracted = reaction.retracted

  if (!reactions[type]) {
    reactions[type] = {
      count: 1,
      me: isMe,
    }

    return
  }

  reactions[type].count += isRetracted ? -1 : 1

  if (isMe) {
    reactions[type].me = isRetracted ? false : true
  }
}

// todo export community metadata type
export type { Client, Community, CommunityType }

export async function createClient(options: ClientOptions): Promise<Client> {
  const client = new Client(options)
  // TODO?: add start
  return client
}
