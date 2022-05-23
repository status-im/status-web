import { WakuMessage } from 'js-waku'
import { DecryptionMethod } from 'js-waku/build/main/lib/waku_message'

import { ChatMessage } from '.'
import { createSymKeyFromPassword } from './encryption'
import { MembershipUpdateEvent_EventType } from './proto/communities/v1/membership_update_message'
import { getNegotiatedTopic, getPartitionedTopic } from './topics'
import { bufToHex, compressPublicKey } from './utils'
import { MembershipUpdateMessage } from './wire/membership_update_message'

import type { Content } from '.'
import type { Identity } from './identity'
import type { MembershipSignedEvent } from './wire/membership_update_message'
import type { Waku } from 'js-waku'

type GroupMember = {
  id: string
  topic: string
  symKey: Uint8Array
  partitionedTopic: string
}

export type GroupChat = {
  chatId: string
  members: GroupMember[]
  admins?: string[]
  name?: string
  removed: boolean
}

export type GroupChatsType = {
  [id: string]: GroupChat
}
/* TODO: add chat messages encryption */

class GroupChatUsers {
  private users: { [id: string]: GroupMember } = {}
  private identity: Identity

  public constructor(_identity: Identity) {
    this.identity = _identity
  }

  public async getUser(id: string): Promise<GroupMember> {
    if (this.users[id]) {
      return this.users[id]
    }
    const topic = await getNegotiatedTopic(this.identity, id)
    const symKey = await createSymKeyFromPassword(topic)
    const partitionedTopic = getPartitionedTopic(id)
    const groupUser: GroupMember = { topic, symKey, id, partitionedTopic }
    this.users[id] = groupUser
    return groupUser
  }
}

export class GroupChats {
  waku: Waku
  identity: Identity
  private callback: (chats: GroupChat) => void
  private removeCallback: (chats: GroupChat) => void
  private addMessage: (message: ChatMessage, sender: string) => void
  private groupChatUsers

  public chats: GroupChatsType = {}
  /**
   * GroupChats holds a list of private chats and listens to their status broadcast
   *
   * @param identity identity of user
   *
   * @param waku waku class used to listen to broadcast and broadcast status
   *
   * @param callback callback function called when new private group chat is ceated
   *
   * @param removeCallback callback function when private group chat is to be removed
   *
   * @param addMessage callback function when
   */
  public constructor(
    identity: Identity,
    waku: Waku,
    callback: (chat: GroupChat) => void,
    removeCallback: (chat: GroupChat) => void,
    addMessage: (message: ChatMessage, sender: string) => void
  ) {
    this.waku = waku
    this.identity = identity
    this.groupChatUsers = new GroupChatUsers(identity)
    this.callback = callback
    this.removeCallback = removeCallback
    this.addMessage = addMessage
    this.listen()
  }

  /**
   * Send chat message on given private chat
   *
   * @param chatId chat id of private group chat
   *
   * @param text text message to send
   */
  public async sendMessage(
    chatId: string,
    content: Content,
    responseTo?: string
  ): Promise<void> {
    const now = Date.now()
    const chat = this.chats[chatId]
    if (chat) {
      await Promise.all(
        chat.members.map(async member => {
          const chatMessage = ChatMessage.createMessage(
            now,
            now,
            chatId,
            content,
            responseTo
          )
          const wakuMessage = await WakuMessage.fromBytes(
            chatMessage.encode(),
            member.topic,
            { sigPrivKey: this.identity.privateKey, symKey: member.symKey }
          )
          this.waku.relay.send(wakuMessage)
        })
      )
    }
  }

  private async handleUpdateEvent(
    chatId: string,
    event: MembershipSignedEvent,
    useCallback: boolean
  ): Promise<void> {
    const signer = event.signer ? bufToHex(event.signer) : ''
    const thisUser = bufToHex(this.identity.publicKey)
    const chat: GroupChat | undefined = this.chats[chatId]
    if (signer) {
      switch (event.event.type) {
        case MembershipUpdateEvent_EventType.CHAT_CREATED: {
          const members: GroupMember[] = []
          await Promise.all(
            event.event.members.map(async member => {
              members.push(await this.groupChatUsers.getUser(member))
            })
          )
          await this.addChat(
            {
              chatId: chatId,
              members,
              admins: [signer],
              removed: false,
            },
            useCallback
          )
          break
        }
        case MembershipUpdateEvent_EventType.MEMBER_REMOVED: {
          if (chat) {
            chat.members = chat.members.filter(
              member => !event.event.members.includes(member.id)
            )
            if (event.event.members.includes(thisUser)) {
              await this.removeChat(
                {
                  ...chat,
                  removed: true,
                },
                useCallback
              )
            } else {
              if (!chat.removed && useCallback) {
                this.callback(this.chats[chatId])
              }
            }
          }
          break
        }
        case MembershipUpdateEvent_EventType.MEMBERS_ADDED: {
          if (chat && chat.admins?.includes(signer)) {
            const members: GroupMember[] = []
            await Promise.all(
              event.event.members.map(async member => {
                members.push(await this.groupChatUsers.getUser(member))
              })
            )
            chat.members.push(...members)
            if (chat.members.findIndex(member => member.id === thisUser) > -1) {
              chat.removed = false
              await this.addChat(chat, useCallback)
            }
          }
          break
        }
        case MembershipUpdateEvent_EventType.NAME_CHANGED: {
          if (chat) {
            if (chat.admins?.includes(signer)) {
              chat.name = event.event.name
              this.callback(chat)
            }
          }
          break
        }
      }
    }
  }

  private async decodeUpdateMessage(
    message: WakuMessage,
    useCallback: boolean
  ): Promise<void> {
    try {
      if (message?.payload) {
        const membershipUpdate = MembershipUpdateMessage.decode(message.payload)
        await Promise.all(
          membershipUpdate.events.map(
            async event =>
              await this.handleUpdateEvent(
                membershipUpdate.chatId,
                event,
                useCallback
              )
          )
        )
      }
    } catch {
      return
    }
  }

  private handleWakuChatMessage(
    message: WakuMessage,
    chat: GroupChat,
    member: string
  ): void {
    try {
      if (message.payload) {
        const chatMessage = ChatMessage.decode(message.payload)
        if (chatMessage) {
          if (chatMessage.chatId === chat.chatId) {
            let sender = member
            if (message.signaturePublicKey) {
              sender = compressPublicKey(message.signaturePublicKey)
            }
            this.addMessage(chatMessage, sender)
          }
        }
      }
    } catch {
      return
    }
  }

  private async handleChatObserver(
    chat: GroupChat,
    removeObserver?: boolean
  ): Promise<void> {
    const observerFunction = removeObserver ? 'deleteObserver' : 'addObserver'
    await Promise.all(
      chat.members.map(async member => {
        if (!removeObserver) {
          this.waku.relay.addDecryptionKey(member.symKey, {
            method: DecryptionMethod.Symmetric,
            contentTopics: [member.topic],
          })
        }
        this.waku.relay[observerFunction](
          message => this.handleWakuChatMessage(message, chat, member.id),
          [member.topic]
        )
      })
    )
  }

  private async addChat(chat: GroupChat, useCallback: boolean): Promise<void> {
    if (this.chats[chat.chatId]) {
      this.chats[chat.chatId] = chat
      if (useCallback) {
        this.callback(chat)
      }
    } else {
      this.chats[chat.chatId] = chat
      if (useCallback) {
        await this.handleChatObserver(chat)
        this.callback(chat)
      }
    }
  }

  private async removeChat(
    chat: GroupChat,
    useCallback: boolean
  ): Promise<void> {
    this.chats[chat.chatId] = chat
    if (useCallback) {
      await this.handleChatObserver(chat, true)
      this.removeCallback(chat)
    }
  }

  private async listen(): Promise<void> {
    const topic = getPartitionedTopic(bufToHex(this.identity.publicKey))
    const messages = await this.waku.store.queryHistory([topic])
    messages.sort((a, b) =>
      (a?.timestamp?.getTime() ?? 0) < (b?.timestamp?.getTime() ?? 0) ? -1 : 1
    )
    for (let i = 0; i < messages.length; i++) {
      await this.decodeUpdateMessage(messages[i], false)
    }
    this.waku.relay.addObserver(
      message => this.decodeUpdateMessage(message, true),
      [topic]
    )
    await Promise.all(
      Object.values(this.chats).map(async chat => {
        if (!chat?.removed) {
          await this.handleChatObserver(chat)
          this.callback(chat)
        }
      })
    )
  }

  private async sendUpdateMessage(
    payload: Uint8Array,
    members: GroupMember[]
  ): Promise<void> {
    const wakuMessages = await Promise.all(
      members.map(
        async member =>
          await WakuMessage.fromBytes(payload, member.partitionedTopic)
      )
    )
    wakuMessages.forEach(msg => this.waku.relay.send(msg))
  }

  /**
   * Sends a change chat name chat membership update message
   *
   * @param chatId a chat id to which message is to be sent
   *
   * @param name a name which chat should be changed to
   */
  public async changeChatName(chatId: string, name: string): Promise<void> {
    const payload = MembershipUpdateMessage.create(chatId, this.identity)
    const chat = this.chats[chatId]
    if (chat && payload) {
      payload.addNameChangeEvent(name)
      await this.sendUpdateMessage(payload.encode(), chat.members)
    }
  }

  /**
   * Sends a add members group chat membership update message with given members
   *
   * @param chatId a chat id to which message is to be sent
   *
   * @param members a list of members to be added
   */
  public async addMembers(chatId: string, members: string[]): Promise<void> {
    const payload = MembershipUpdateMessage.create(chatId, this.identity)
    const chat = this.chats[chatId]
    if (chat && payload) {
      const newMembers: GroupMember[] = []

      await Promise.all(
        members
          .filter(
            member =>
              !chat.members.map(chatMember => chatMember.id).includes(member)
          )
          .map(async member => {
            newMembers.push(await this.groupChatUsers.getUser(member))
          })
      )

      payload.addMembersAddedEvent(newMembers.map(member => member.id))
      await this.sendUpdateMessage(payload.encode(), [
        ...chat.members,
        ...newMembers,
      ])
    }
  }

  /**
   * Sends a create group chat membership update message with given members
   *
   * @param members a list of public keys of members to be included in private group chat
   */
  public async createGroupChat(members: string[]): Promise<void> {
    const payload = MembershipUpdateMessage.createChat(
      this.identity,
      members
    ).encode()

    const newMembers: GroupMember[] = []

    await Promise.all(
      members.map(async member => {
        newMembers.push(await this.groupChatUsers.getUser(member))
      })
    )

    await this.sendUpdateMessage(payload, newMembers)
  }

  /**
   * Sends a remove member to private group chat
   *
   * @param chatId id of private group chat
   */
  public async quitChat(chatId: string): Promise<void> {
    const payload = MembershipUpdateMessage.create(chatId, this.identity)
    const chat = this.chats[chatId]
    payload.addMemberRemovedEvent(bufToHex(this.identity.publicKey))
    await this.sendUpdateMessage(payload.encode(), chat.members)
  }

  /**
   * Retrieve previous messages from a Waku Store node for the given chat Id.
   *
   */
  public async retrievePreviousMessages(
    chatId: string,
    startTime: Date,
    endTime: Date
  ): Promise<number> {
    const chat = this.chats[chatId]

    if (!chat)
      throw `Failed to retrieve messages, chat is not joined: ${chatId}`

    const _callback = (wakuMessages: WakuMessage[], member: string): void => {
      wakuMessages.forEach((wakuMessage: WakuMessage) =>
        this.handleWakuChatMessage(wakuMessage, chat, member)
      )
    }

    const amountOfMessages: number[] = []

    await Promise.all(
      chat.members.map(async member => {
        const msgLength = (
          await this.waku.store.queryHistory([member.topic], {
            timeFilter: { startTime, endTime },
            callback: msg => _callback(msg, member.id),
            decryptionKeys: [member.symKey],
          })
        ).length
        amountOfMessages.push(msgLength)
      })
    )
    return amountOfMessages.reduce((a, b) => a + b)
  }
}
