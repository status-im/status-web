import debug from "debug";
import { Waku, WakuMessage } from "js-waku";
import { CreateOptions as WakuCreateOptions } from "js-waku/build/main/lib/waku";

import { ApplicationMetadataMessage } from "./application_metadata_message";
import { Chat } from "./chat";
import { ChatMessage } from "./chat_message";
import { Identity } from "./identity";
import { ApplicationMetadataMessage_Type } from "./proto/status/v1/application_metadata_message";

const dbg = debug("communities:messenger");

export class Messenger {
  waku: Waku;
  chatsById: Map<string, Chat>;
  observers: {
    [chatId: string]: Set<(message: ApplicationMetadataMessage) => void>;
  };
  identity: Identity;

  private constructor(identity: Identity, waku: Waku) {
    this.identity = identity;
    this.waku = waku;
    this.chatsById = new Map();
    this.observers = {};
  }

  public static async create(
    identity: Identity,
    wakuOptions?: WakuCreateOptions
  ) {
    const _wakuOptions = Object.assign({ bootstrap: true }, wakuOptions);
    const waku = await Waku.create(_wakuOptions);
    return new Messenger(identity, waku);
  }

  /**
   * Joins a public chat.
   *
   * Use `addListener` to get messages received on this chat.
   */
  public joinChat(chatId: string) {
    if (this.chatsById.has(chatId)) throw "Chat already joined";

    const chat = new Chat(chatId);

    this.waku.relay.addObserver(
      (wakuMessage: WakuMessage) => {
        if (!wakuMessage.payload) return;

        const message = ApplicationMetadataMessage.decode(wakuMessage.payload);

        switch (message.type) {
          case ApplicationMetadataMessage_Type.TYPE_CHAT_MESSAGE:
            this._handleNewChatMessage(chat, message);
            break;
          default:
            dbg("Received unsupported message type", message.type);
        }
      },
      [chat.contentTopic]
    );

    this.chatsById.set(chatId, chat);
  }

  /**
   * Sends a message on the given chat Id.
   *
   * @param text
   * @param chatId
   */
  public async sendMessage(text: string, chatId: string): Promise<void> {
    const chat = this.chatsById.get(chatId);
    if (!chat) throw `Chat not joined: ${chatId}`;

    const chatMessage = chat.createMessage(text);

    const appMetadataMessage = ApplicationMetadataMessage.create(
      chatMessage.encode(),
      ApplicationMetadataMessage_Type.TYPE_CHAT_MESSAGE,
      this.identity
    );

    // TODO: Use version 1 with signature
    const wakuMessage = await WakuMessage.fromBytes(
      appMetadataMessage.encode(),
      chat.contentTopic
    );

    await this.waku.relay.send(wakuMessage);
  }

  /**
   * Add an observer of new messages received on the given chat id.
   *
   * @throws string If the chat has not been joined first using [joinChat].
   */
  public addObserver(
    observer: (message: ApplicationMetadataMessage) => void,
    chatId: string
  ) {
    // Not sure this is the best design here. Maybe `addObserver` and `joinChat` should be merged.

    if (!this.chatsById.has(chatId))
      throw "Cannot add observer on a chat that is not joined.";
    if (!this.observers[chatId]) {
      this.observers[chatId] = new Set();
    }

    this.observers[chatId].add(observer);
  }

  /**
   * Delete an observer of new messages received on the given chat id.
   *
   * @throws string If the chat has not been joined first using [joinChat].
   */

  deleteObserver(
    observer: (message: ApplicationMetadataMessage) => void,
    chatId: string
  ): void {
    if (this.observers[chatId]) {
      this.observers[chatId].delete(observer);
    }
  }

  /**
   * Stops the messenger.
   */
  public async stop(): Promise<void> {
    await this.waku.stop();
  }

  private _handleNewChatMessage(
    chat: Chat,
    message: ApplicationMetadataMessage
  ) {
    if (!message.payload || !message.type || !message.signature) return;

    const chatMessage = ChatMessage.decode(message.payload);
    chat.handleNewMessage(chatMessage);

    if (this.observers[chat.id]) {
      this.observers[chat.id].forEach((observer) => {
        observer(message);
      });
    }
  }
}
