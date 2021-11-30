import { Waku, WakuMessage } from "js-waku";

import { Identity } from "./identity";
import { MembershipUpdateEvent_EventType } from "./proto/communities/v1/membership_update_message";
import { getNegotiatedTopic, getPartitionedTopic } from "./topics";
import { bufToHex } from "./utils";
import { MembershipUpdateMessage } from "./wire/membership_update_message";

import { ChatMessage, ContentType } from ".";

export type GroupChat = {
  chatId: string;
  members: string[];
  admins?: string[];
  name?: string;
};

export type GroupChatsType = {
  [id: string]: GroupChat;
};
/* TODO: add chat messages encryption */

export class GroupChats {
  waku: Waku;
  identity: Identity;
  private callback: (chats: GroupChat) => void;
  private removeCallback: (chats: GroupChat) => void;
  private addMessage: (message: ChatMessage, sender: string) => void;

  public chats: GroupChatsType = {};

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
    this.waku = waku;
    this.identity = identity;
    this.callback = callback;
    this.removeCallback = removeCallback;
    this.addMessage = addMessage;
    this.listen();
  }

  /**
   * Send chat message on given private chat
   *
   * @param chatId chat id of private group chat
   *
   * @param text text message to send
   */
  public async sendMessage(chatId: string, text: string): Promise<void> {
    const now = Date.now();
    const chat = this.chats[chatId];
    if (chat) {
      await Promise.all(
        chat.members.map(async (member) => {
          const chatMessage = ChatMessage.createMessage(now, now, chatId, {
            text,
            contentType: ContentType.Text,
          });
          const wakuMessage = await WakuMessage.fromBytes(
            chatMessage.encode(),
            await getNegotiatedTopic(this.identity, member)
          );
          this.waku.relay.send(wakuMessage);
        })
      );
    }
  }

  private async decodeUpdateMessage(
    message: WakuMessage,
    useCallback: boolean
  ): Promise<void> {
    try {
      if (message.payload) {
        const membershipUpdate = MembershipUpdateMessage.decode(
          message?.payload
        );
        await Promise.all(
          membershipUpdate.events.map(async (event) => {
            const bufSigner = event.signer;
            const signer = bufSigner ? bufToHex(bufSigner) : "";
            const chatId = membershipUpdate.chatId;
            if (signer) {
              switch (event.event.type) {
                case MembershipUpdateEvent_EventType.CHAT_CREATED: {
                  await this.addChat(
                    {
                      chatId: chatId,
                      members: event.event.members,
                      admins: [signer],
                    },
                    useCallback
                  );
                  break;
                }
                case MembershipUpdateEvent_EventType.MEMBER_REMOVED: {
                  if (
                    event.event.members[0] == bufToHex(this.identity.publicKey)
                  ) {
                    await this.removeChat(
                      {
                        chatId: chatId,
                        members: event.event.members,
                      },
                      useCallback
                    );
                  }
                  break;
                }
                case MembershipUpdateEvent_EventType.NAME_CHANGED: {
                  const chat = this.chats[chatId];
                  if (chat) {
                    if (chat.admins?.includes(signer)) {
                      chat.name = event.event.name;
                      this.callback(chat);
                    }
                  }
                  break;
                }
              }
            }
          })
        );
      }
    } catch {
      return;
    }
  }

  private handleWakuChatMessage(
    message: WakuMessage,
    chat: GroupChat,
    member: string
  ): void {
    try {
      if (message.payload) {
        const chatMessage = ChatMessage.decode(message.payload);
        if (chatMessage) {
          if (chatMessage.chatId === chat.chatId) {
            this.addMessage(chatMessage, member);
          }
        }
      }
    } catch {
      return;
    }
  }

  private async handleChatObserver(
    chat: GroupChat,
    removeObserver?: boolean
  ): Promise<void> {
    const observerFunction = removeObserver ? "deleteObserver" : "addObserver";
    await Promise.all(
      chat.members.map(async (member) => {
        const topic = await getNegotiatedTopic(this.identity, member);
        this.waku.relay[observerFunction](
          (message) => this.handleWakuChatMessage(message, chat, member),
          [topic]
        );
      })
    );
  }

  private async addChat(chat: GroupChat, useCallback: boolean): Promise<void> {
    this.chats[chat.chatId] = chat;
    if (useCallback) {
      await this.handleChatObserver(chat);
      this.callback(chat);
    }
  }

  private async removeChat(
    chat: GroupChat,
    useCallback: boolean
  ): Promise<void> {
    delete this.chats[chat.chatId];
    if (useCallback) {
      await this.handleChatObserver(chat, true);
      this.removeCallback(chat);
    }
  }

  private async listen(): Promise<void> {
    const messages = await this.waku.store.queryHistory([
      getPartitionedTopic(bufToHex(this.identity.publicKey)),
    ]);
    messages.sort((a, b) =>
      (a?.timestamp?.getTime() ?? 0) < (b?.timestamp?.getTime() ?? 0) ? -1 : 1
    );

    await Promise.all(
      messages.map(
        async (message) => await this.decodeUpdateMessage(message, false)
      )
    );
    await Promise.all(
      Object.values(this.chats).map(async (chat) => {
        await this.handleChatObserver(chat);
        this.callback(chat);
      })
    );
    this.waku.relay.addObserver(
      (message) => this.decodeUpdateMessage(message, true),
      [getPartitionedTopic(bufToHex(this.identity.publicKey))]
    );
  }

  private async sendUpdateMessage(
    payload: Uint8Array,
    members: string[]
  ): Promise<void> {
    const wakuMessages = await Promise.all(
      members.map(
        async (member) =>
          await WakuMessage.fromBytes(payload, getPartitionedTopic(member))
      )
    );
    wakuMessages.forEach((msg) => this.waku.relay.send(msg));
  }

  public async changeChatName(chatId: string, name: string): Promise<void> {
    const payload = MembershipUpdateMessage.create(chatId, this.identity);
    const chat = this.chats[chatId];
    if (chat && payload) {
      payload.addNameChangeEvent(name);
      await this.sendUpdateMessage(payload.encode(), chat.members);
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
    ).encode();
    await this.sendUpdateMessage(payload, members);
  }

  /**
   * Sends a remove member to private group chat
   *
   * @param chatId id of private group chat
   */
  public async quitChat(chatId: string): Promise<void> {
    const payload = MembershipUpdateMessage.create(chatId, this.identity);
    const chat = this.chats[chatId];
    payload.addMemberRemovedEvent(bufToHex(this.identity.publicKey));
    await this.sendUpdateMessage(payload.encode(), chat.members);
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
    const chat = this.chats[chatId];

    if (!chat)
      throw `Failed to retrieve messages, chat is not joined: ${chatId}`;

    const _callback = (wakuMessages: WakuMessage[], member: string): void => {
      wakuMessages.forEach((wakuMessage: WakuMessage) =>
        this.handleWakuChatMessage(wakuMessage, chat, member)
      );
    };

    const amountOfMessages: number[] = [];

    await Promise.all(
      chat.members.map(async (member) => {
        const topic = await getNegotiatedTopic(this.identity, member);
        const msgLength = (
          await this.waku.store.queryHistory([topic], {
            timeFilter: { startTime, endTime },
            callback: (msg) => _callback(msg, member),
          })
        ).length;
        amountOfMessages.push(msgLength);
      })
    );
    return amountOfMessages.reduce((a, b) => a + b);
  }
}
