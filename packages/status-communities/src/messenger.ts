import { Waku, WakuMessage } from "js-waku";
import { CreateOptions as WakuCreateOptions } from "js-waku/build/main/lib/waku";

import { Chat } from "./chat";
import { ChatMessage } from "./chat_message";

export class Messenger {
  waku: Waku;
  chatsById: Map<string, Chat>;
  observers: {
    [chatId: string]: Set<(chatMessage: ChatMessage) => void>;
  };

  private constructor(waku: Waku) {
    this.waku = waku;
    this.chatsById = new Map();
    this.observers = {};
  }

  public static async create(wakuOptions?: WakuCreateOptions) {
    const _wakuOptions = Object.assign({ bootstrap: true }, wakuOptions);
    const waku = await Waku.create(_wakuOptions);
    return new Messenger(waku);
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

        const chatMessage = ChatMessage.decode(wakuMessage.payload);

        chat.handleNewMessage(chatMessage);

        if (this.observers[chatId]) {
          this.observers[chatId].forEach((observer) => {
            observer(chatMessage);
          });
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

    const message = chat.createMessage(text);

    const wakuMessage = await WakuMessage.fromBytes(
      message.encode(),
      chat.contentTopic
    );

    await this.waku.relay.send(wakuMessage);
  }

  /**
   * Add an observer of new messages received on the chat.
   *
   * @throws string If the chat has not been joined first using [joinChat].
   */
  public addObserver(
    observer: (chatMessage: ChatMessage) => void,
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
   * Add an observer of new messages received on the chat.
   *
   * @throws string If the chat has not been joined first using [joinChat].
   */

  deleteObserver(
    observer: (chatMessage: ChatMessage) => void,
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
}
