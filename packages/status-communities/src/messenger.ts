import debug from "debug";
import { Waku, WakuMessage } from "js-waku";
import { CreateOptions as WakuCreateOptions } from "js-waku/build/main/lib/waku";

import { Chat } from "./chat";
import { Identity } from "./identity";
import { ApplicationMetadataMessage_Type } from "./proto/status/v1/application_metadata_message";
import { ApplicationMetadataMessage } from "./wire/application_metadata_message";
import { ChatMessage, Content } from "./wire/chat_message";

const dbg = debug("communities:messenger");

export class Messenger {
  waku: Waku;
  chatsById: Map<string, Chat>;
  observers: {
    [chatId: string]: Set<
      (message: ApplicationMetadataMessage, timestamp: Date) => void
    >;
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
  ): Promise<Messenger> {
    const _wakuOptions = Object.assign({ bootstrap: true }, wakuOptions);
    const waku = await Waku.create(_wakuOptions);
    return new Messenger(identity, waku);
  }

  /**
   * Joins a public chat.
   *
   * Use `addListener` to get messages received on this chat.
   */
  public async joinChat(chatId: string): Promise<void> {
    if (this.chatsById.has(chatId))
      throw `Failed to join chat, it is already joined: ${chatId}`;

    const chat = await Chat.create(chatId);

    this.waku.addDecryptionKey(chat.symKey);

    this.waku.relay.addObserver(
      (wakuMessage: WakuMessage) => {
        if (!wakuMessage.payload || !wakuMessage.timestamp) return;

        const message = ApplicationMetadataMessage.decode(wakuMessage.payload);

        switch (message.type) {
          case ApplicationMetadataMessage_Type.TYPE_CHAT_MESSAGE:
            this._handleNewChatMessage(chat, message, wakuMessage.timestamp);
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
   */
  public async sendMessage(chatId: string, content: Content): Promise<void> {
    const chat = this.chatsById.get(chatId);
    if (!chat) throw `Failed to send message, chat not joined: ${chatId}`;

    const chatMessage = chat.createMessage(content);

    const appMetadataMessage = ApplicationMetadataMessage.create(
      chatMessage.encode(),
      ApplicationMetadataMessage_Type.TYPE_CHAT_MESSAGE,
      this.identity
    );

    const wakuMessage = await WakuMessage.fromBytes(
      appMetadataMessage.encode(),
      chat.contentTopic,
      { symKey: chat.symKey, sigPrivKey: this.identity.privateKey }
    );

    await this.waku.relay.send(wakuMessage);
  }

  /**
   * Add an observer of new messages received on the given chat id.
   *
   * @throws string If the chat has not been joined first using [joinChat].
   */
  public addObserver(
    observer: (message: ApplicationMetadataMessage, timestamp: Date) => void,
    chatId: string
  ): void {
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

  /**
   * Retrieve previous messages from a Waku Store node for the given chat Id.
   *
   * Note: note sure what is the preferred interface: callback or returning all messages
   * Callback is more flexible and allow processing messages as they are retrieved instead of waiting for the
   * full retrieval via paging to be done.
   */
  public async retrievePreviousMessages(
    chatId: string,
    startTime: Date,
    endTime: Date,
    callback: (messages: ApplicationMetadataMessage[]) => void
  ): Promise<void> {
    const chat = this.chatsById.get(chatId);
    if (!chat)
      throw `Failed to retrieve messages, chat is not joined: ${chatId}`;

    const _callback = (wakuMessages: WakuMessage[]): void => {
      const isDefined = (
        msg: ApplicationMetadataMessage | undefined
      ): msg is ApplicationMetadataMessage => {
        return !!msg;
      };

      const messages = wakuMessages.map((wakuMessage: WakuMessage) => {
        if (!wakuMessage.payload || !wakuMessage.timestamp) return;

        const message = ApplicationMetadataMessage.decode(wakuMessage.payload);

        switch (message.type) {
          case ApplicationMetadataMessage_Type.TYPE_CHAT_MESSAGE:
            this._handleNewChatMessage(chat, message, wakuMessage.timestamp);
            return message;
          default:
            dbg("Retrieved unsupported message type", message.type);
            return;
        }
      });

      callback(messages.filter(isDefined));
    };

    await this.waku.store.queryHistory([chat.contentTopic], {
      timeFilter: { startTime, endTime },
      callback: _callback,
    });
  }

  private _handleNewChatMessage(
    chat: Chat,
    message: ApplicationMetadataMessage,
    timestamp: Date
  ): void {
    if (!message.payload || !message.type || !message.signature) return;

    const chatMessage = ChatMessage.decode(message.payload);
    chat.handleNewMessage(chatMessage);

    if (this.observers[chat.id]) {
      this.observers[chat.id].forEach((observer) => {
        observer(message, timestamp);
      });
    }
  }
}
