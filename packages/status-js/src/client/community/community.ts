import { hexToBytes } from 'ethereum-cryptography/utils'
import { waku_message } from 'js-waku'

import { getDifferenceByKeys } from '../../helpers/get-difference-by-keys'
import { getObjectsDifference } from '../../helpers/get-objects-difference'
import { CommunityRequestToJoin } from '../../protos/communities'
import { MessageType } from '../../protos/enums'
import { compressPublicKey } from '../../utils/compress-public-key'
import { generateKeyFromPassword } from '../../utils/generate-key-from-password'
import { getNextClock } from '../../utils/get-next-clock'
import { idToContentTopic } from '../../utils/id-to-content-topic'
import { Chat } from '../chat'
import { Member } from '../member'

import type {
  CommunityChat,
  CommunityDescription,
} from '../../proto/communities/v1/communities'
import type { Client } from '../client'

export class Community {
  private client: Client
  #clock: bigint

  /** Compressed. */
  public publicKey: string
  public id: string
  private contentTopic!: string
  private symmetricKey!: Uint8Array
  public description!: CommunityDescription
  public chats: Map<string, Chat>
  #members: Map<string, Member>
  #callbacks: Set<(description: CommunityDescription) => void>

  constructor(client: Client, publicKey: string) {
    this.client = client

    this.publicKey = publicKey
    this.id = publicKey.replace(/^0[xX]/, '')

    this.#clock = BigInt(Date.now())
    this.chats = new Map()
    this.#members = new Map()
    this.#callbacks = new Set()
  }

  public async start() {
    this.contentTopic = idToContentTopic(this.publicKey)
    this.symmetricKey = await generateKeyFromPassword(this.publicKey)

    // Waku
    this.client.waku.store.addDecryptionKey(this.symmetricKey, {
      contentTopics: [this.contentTopic],
    })
    this.client.waku.relay.addDecryptionKey(this.symmetricKey, {
      contentTopics: [this.contentTopic],
    })

    // Community
    const description = await this.fetch()

    if (!description) {
      throw new Error('Failed to intiliaze Community')
    }

    this.description = description

    this.observe()
    this.addMembers(this.description.members)

    // Chats
    await this.observeChatMessages(this.description.chats)
  }

  // todo: rename this to chats when changing references in ui
  public get _chats() {
    return [...this.chats.values()]
  }

  public getChat(uuid: string) {
    return this.chats.get(uuid)
  }

  public get members() {
    return [...this.#members.values()]
  }

  public getMember(publicKey: string) {
    return this.#members.get(publicKey)
  }

  public fetch = async () => {
    // most recent page first
    await this.client.waku.store.queryHistory([this.contentTopic], {
      callback: wakuMessages => {
        let index = wakuMessages.length

        // most recent message first
        while (--index >= 0) {
          this.client.handleWakuMessage(wakuMessages[index])

          if (this.description) {
            return true
          }
        }
      },
    })

    return this.description
  }

  private observe = () => {
    this.client.waku.relay.addObserver(this.client.handleWakuMessage, [
      this.contentTopic,
    ])
  }

  private observeChatMessages = async (
    chatDescriptions: CommunityDescription['chats']
  ) => {
    const chatPromises = Object.entries(chatDescriptions).map(
      async ([chatUuid, chatDescription]: [string, CommunityChat]) => {
        const chat = await Chat.create(
          this,
          this.client,
          chatUuid,
          MessageType.COMMUNITY_CHAT,
          chatDescription
        )
        const contentTopic = chat.contentTopic

        this.chats.set(chatUuid, chat)

        this.client.waku.relay.addDecryptionKey(chat.symmetricKey, {
          method: waku_message.DecryptionMethod.Symmetric,
          contentTopics: [contentTopic],
        })

        return contentTopic
      }
    )

    const contentTopics = await Promise.all(chatPromises)

    this.client.waku.relay.addObserver(
      this.client.handleWakuMessage,
      contentTopics
    )
  }

  private unobserveChatMessages = (
    chatDescription: CommunityDescription['chats']
  ) => {
    const contentTopics: string[] = []

    for (const chatUuid of Object.keys(chatDescription)) {
      const chat = this.chats.get(chatUuid)

      if (!chat) {
        continue
      }

      const contentTopic = chat.contentTopic

      this.chats.delete(chatUuid)
      contentTopics.push(contentTopic)
    }

    if (!contentTopics.length) {
      return
    }

    this.client.waku.relay.deleteObserver(
      this.client.handleWakuMessage,
      contentTopics
    )
  }

  private addMembers = (members: CommunityDescription['members']) => {
    for (const publicKey of Object.keys(members)) {
      const member = new Member(publicKey)
      this.#members.set(publicKey, member)
    }
  }

  private removeMembers = (ids: string[]) => {
    for (const id of ids) {
      this.#members.delete(id)
    }
  }

  public handleDescription = (description: CommunityDescription) => {
    if (this.description) {
      // already handled
      if (this.description.clock >= description.clock) {
        return
      }

      // Chats
      // observe
      const removedChats = getDifferenceByKeys(
        this.description.chats,
        description.chats
      )
      if (Object.keys(removedChats).length) {
        this.unobserveChatMessages(removedChats)
      }

      const addedChats = getDifferenceByKeys(
        description.chats,
        this.description.chats
      )
      if (Object.keys(addedChats).length) {
        this.observeChatMessages(addedChats)
      }

      // TODO: migrate chats to new format
      // const chats = getObjectsDifference(
      //   this.description.chats,
      //   description.chats
      // )

      // this.observeChatMessages(chats.added)
      // this.unobserveChatMessages(chats.removed)

      const members = getObjectsDifference(
        this.description.members,
        description.members
      )

      this.addMembers(members.added)
      this.removeMembers(members.removed)
    }

    // Community
    // state
    this.description = description

    // callback
    this.#callbacks.forEach(callback => callback({ ...this.description }))

    // Chats
    // handle
    Object.entries(this.description.chats).forEach(
      ([chatUuid, chatDescription]) =>
        this.chats.get(chatUuid)?.handleChange(chatDescription)
    )
  }

  public onChange = (callback: (description: CommunityDescription) => void) => {
    this.#callbacks.add(callback)

    return () => {
      this.#callbacks.delete(callback)
    }
  }

  public requestToJoin = async (chatId = '') => {
    const payload = CommunityRequestToJoin.encode({
      clock: this.setClock(this.#clock),
      chatId,
      communityId: hexToBytes(this.id),
      ensName: '',
    })

    await this.client.sendWakuMessage(
      'TYPE_COMMUNITY_REQUEST_TO_JOIN',
      payload,
      this.contentTopic,
      this.symmetricKey
    )
  }

  public isOwner = (
    /** Uncompressed. */
    signerPublicKey: string
  ): boolean => {
    return this.publicKey === `0x${compressPublicKey(signerPublicKey)}`
  }

  public isMember = (signerPublicKey: string): boolean => {
    return this.getMember(signerPublicKey) !== undefined
  }

  public setClock = (currentClock?: bigint): bigint => {
    this.#clock = getNextClock(currentClock)

    return this.#clock
  }
}
