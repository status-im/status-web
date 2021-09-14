import waku, { Waku, WakuMessage } from "js-waku";

import { Chat } from "./chat";
import { ChatMessage } from "./chat_message";

export class Messenger {
  waku: Waku;

  chatsById: Map<string, Chat>;

  private constructor(waku: Waku) {
    this.waku = waku;
    this.chatsById = new Map();
  }

  public static async create(wakuOptions?: waku.CreateOptions) {
    const _wakuOptions = Object.assign({ bootstrap: true }, wakuOptions);
    const waku = await Waku.create(_wakuOptions);
    const messenger = new Messenger(waku);
    return messenger;
  }

  public joinChat(chatId: string) {
    if (this.chatsById.has(chatId)) throw "Chat already joined";

    const chat = new Chat(chatId);

    this.waku.relay.addObserver(
      (wakuMessage: WakuMessage) => {
        if (!wakuMessage.payload) return;

        const chatMessage = ChatMessage.decode(wakuMessage.payload);

        chat.handleNewMessage(chatMessage);
      },
      [chat.contentTopic]
    );

    this.chatsById.set(chatId, chat);
  }

  public async stop(): Promise<void> {
    await this.waku.stop();
  }
}
