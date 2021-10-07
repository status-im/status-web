import { Reader } from "protobufjs";

import * as proto from "./proto/communities/v1/chat_message";
import {
  AudioMessage,
  AudioMessage_AudioType,
  ChatMessage_ContentType,
  ImageMessage,
  StickerMessage,
} from "./proto/communities/v1/chat_message";
import { ImageType, MessageType } from "./proto/communities/v1/enums";

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
  ): ChatMessage {
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
      contentType: ChatMessage_ContentType.CONTENT_TYPE_TEXT_PLAIN,
      sticker: undefined,
      image: undefined,
      audio: undefined,
      community: undefined, // Used to share a community
      grant: undefined,
    };

    return new ChatMessage(proto);
  }

  /**
   * Create a an image chat message to be sent to an Open (permission = no membership) community
   */
  public static createImageMessage(
    clock: number,
    timestamp: number,
    text: string,
    chatId: string,
    image: Uint8Array,
    imageType: ImageType
  ): ChatMessage {
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
      contentType: ChatMessage_ContentType.CONTENT_TYPE_IMAGE,
      sticker: undefined,
      image: {
        payload: image,
        type: imageType,
      },
      audio: undefined,
      community: undefined, // Used to share a community
      grant: undefined,
    };

    return new ChatMessage(proto);
  }

  /**
   * Create a a sticker chat message to be sent to an Open (permission = no membership) community
   */
  public static createStickerMessage(
    clock: number,
    timestamp: number,
    text: string,
    chatId: string,
    stickerHash: string,
    stickerPack: number
  ): ChatMessage {
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
      contentType: ChatMessage_ContentType.CONTENT_TYPE_STICKER,
      sticker: {
        hash: stickerHash,
        pack: stickerPack,
      },
      image: undefined,
      audio: undefined,
      community: undefined, // Used to share a community
      grant: undefined,
    };

    return new ChatMessage(proto);
  }

  /**
   * Create a a sticker chat message to be sent to an Open (permission = no membership) community
   */
  public static createAudioMessage(
    clock: number,
    timestamp: number,
    text: string,
    chatId: string,
    audio: Uint8Array,
    audioType: AudioMessage_AudioType,
    audioDurationMs: number
  ): ChatMessage {
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
      contentType: ChatMessage_ContentType.CONTENT_TYPE_AUDIO,
      sticker: undefined,
      image: undefined,
      audio: {
        payload: audio,
        type: audioType,
        durationMs: audioDurationMs,
      },
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

  /** Lamport timestamp of the chat message */
  public get clock(): number | undefined {
    return this.proto.clock;
  }

  /**
   * Unix timestamps in milliseconds, currently not used as we use whisper as more reliable, but here
   * so that we don't rely on it
   */
  public get timestamp(): number | undefined {
    return this.proto.timestamp;
  }

  /**
   * Text of the message
   */
  public get text(): string | undefined {
    return this.proto.text;
  }

  /**
   * Id of the message that we are replying to
   */
  public get responseTo(): string | undefined {
    return this.proto.responseTo;
  }

  /**
   * Ens name of the sender
   */
  public get ensName(): string | undefined {
    return this.proto.ensName;
  }

  /**
   * Chat id, this field is symmetric for public-chats and private group chats,
   * but asymmetric in case of one-to-ones, as the sender will use the chat-id
   * of the received, while the receiver will use the chat-id of the sender.
   * Probably should be the concatenation of sender-pk & receiver-pk in alphabetical order
   */
  public get chatId(): string {
    return this.proto.chatId;
  }

  /**
   * The type of message (public/one-to-one/private-group-chat)
   */
  public get messageType(): MessageType | undefined {
    return this.proto.messageType;
  }

  /**
   * The type of the content of the message
   */
  public get contentType(): ChatMessage_ContentType | undefined {
    return this.proto.contentType;
  }

  public get sticker(): StickerMessage | undefined {
    return this.proto.sticker;
  }

  public get image(): ImageMessage | undefined {
    return this.proto.image;
  }

  public get audio(): AudioMessage | undefined {
    return this.proto.audio;
  }

  /**
   * Used when sharing a community via a chat message.
   */
  public get community(): Uint8Array | undefined {
    return this.proto.community;
  }
}
