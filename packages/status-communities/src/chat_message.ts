import { Reader } from "protobufjs";

import * as proto from "./proto/communities/v2/chat_message";
import { ChatMessage_ContentType } from "./proto/communities/v2/chat_message";
import { MessageType } from "./proto/communities/v2/enums";

export class ChatMessage {
  private constructor(public proto: proto.ChatMessage) {}

  /**
   * Create a chat message to be sent to an Open (permission = no membership) community
   */
  public static createMessage(
    clock: number,
    timestamp: number,
    text: string,
    chatId: string
  ) {
    const proto = {
      clock, // ms?
      timestamp, //ms?
      text,
      /** Id of the message that we are replying to */
      responseTo: "",
      /** Ens name of the sender */
      ensName: "",
      /** Public Key of the community (TBC) **/
      chatId,
      /** The type of message (public/one-to-one/private-group-chat) */
      messageType: MessageType.MESSAGE_TYPE_COMMUNITY_CHAT,
      /** The type of the content of the message */
      contentType: ChatMessage_ContentType.CONTENT_TYPE_COMMUNITY,
      sticker: undefined,
      image: undefined,
      audio: undefined,
      community: undefined, // Used to share a community
      grant: undefined,
    };

    return new ChatMessage(proto);
  }

  static decode(bytes: Uint8Array): ChatMessage {
    const protoBuf = proto.ChatMessage.decode(Reader.create(bytes));

    return new ChatMessage(protoBuf);
  }

  encode(): Uint8Array {
    return proto.ChatMessage.encode(this.proto).finish();
  }

  public get clock() {
    return this.proto.clock;
  }

  get text(): string | undefined {
    return this.proto.text;
  }
}
