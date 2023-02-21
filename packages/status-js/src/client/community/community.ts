import { hexToBytes } from 'ethereum-cryptography/utils'
import { SymDecoder } from 'js-waku/lib/waku_message/version_1'

import { getDifferenceByKeys } from '../../helpers/get-difference-by-keys'
import { getObjectsDifference } from '../../helpers/get-objects-difference'
import { ApplicationMetadataMessage_Type } from '../../protos/application-metadata-message_pb'
import { CommunityRequestToJoin } from '../../protos/communities_pb'
import { MessageType } from '../../protos/enums_pb'
import { compressPublicKey } from '../../utils/compress-public-key'
import { generateKeyFromPassword } from '../../utils/generate-key-from-password'
import { getNextClock } from '../../utils/get-next-clock'
import { idToContentTopic } from '../../utils/id-to-content-topic'
import { Chat } from '../chat'
import { Member } from '../member'

import type { CommunityDescription as CommunityDescriptionProto } from '../../protos/communities_pb'
import type { CommunityChat } from '../chat'
import type { Client } from '../client'
import type { PlainMessage } from '@bufbuild/protobuf'

type CommunityDescription = PlainMessage<CommunityDescriptionProto>

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
  #chatUnobserveFns: Map<string, () => void>

  constructor(client: Client, publicKey: string) {
    this.client = client

    this.publicKey = publicKey
    this.id = publicKey.replace(/^0[xX]/, '')

    this.#clock = BigInt(Date.now())
    this.chats = new Map()
    this.#members = new Map()
    this.#callbacks = new Set()
    this.#chatUnobserveFns = new Map()
  }

  public async start() {
    this.contentTopic = idToContentTopic(this.publicKey)
    this.symmetricKey = await generateKeyFromPassword(this.publicKey)

    // Community
    const description = await this.fetch()

    if (!description) {
      throw new Error('Failed to intiliaze Community')
    }

    // Observe community description
    await this.observe()

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
    await this.client.waku.store.queryOrderedCallback(
      [new SymDecoder(this.contentTopic, this.symmetricKey)],
      wakuMessage => {
        this.client.handleWakuMessage(wakuMessage)

        if (this.description) {
          return true
        }
      }
    )

    return this.description
  }

  private observe = async () => {
    await this.client.waku.filter.subscribe(
      [new SymDecoder(this.contentTopic, this.symmetricKey)],
      this.client.handleWakuMessage
    )
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

        this.chats.set(chatUuid, chat)

        const unobserveFn = await this.client.waku.filter.subscribe(
          [new SymDecoder(chat.contentTopic, chat.symmetricKey)],
          this.client.handleWakuMessage
        )

        this.#chatUnobserveFns.set(chat.contentTopic, unobserveFn)
      }
    )

    await Promise.all(chatPromises)
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

    contentTopics.forEach(contentTopic =>
      this.#chatUnobserveFns.get(contentTopic)?.()
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
    this.addMembers(this.description.members)

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
    const payload = new CommunityRequestToJoin({
      clock: this.setClock(this.#clock),
      chatId,
      communityId: hexToBytes(this.id),
      ensName: '',
    }).toBinary()

    await this.client.sendWakuMessage(
      ApplicationMetadataMessage_Type.COMMUNITY_REQUEST_TO_JOIN,
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
