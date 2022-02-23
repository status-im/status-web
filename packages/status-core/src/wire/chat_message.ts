import { Reader } from "protobufjs";

import * as proto from "../proto/communities/v1/chat_message";
import {
  AudioMessage,
  AudioMessage_AudioType,
  ChatMessage_ContentType,
  ImageMessage,
  StickerMessage,
} from "../proto/communities/v1/chat_message";
import { ImageType, MessageType } from "../proto/communities/v1/enums";

export type Content =
  | TextContent
  | StickerContent
  | ImageContent
  | AudioContent;

export enum ContentType {
  Text,
  Sticker,
  Image,
  Audio,
}

export interface TextContent {
  text: string;
  contentType: ContentType.Text;
}

export interface StickerContent {
  hash: string;
  pack: number;
  contentType: ContentType.Sticker;
}

export interface ImageContent {
  image: Uint8Array;
  imageType: ImageType;
  contentType: ContentType.Image;
}

export interface AudioContent {
  audio: Uint8Array;
  audioType: AudioMessage_AudioType;
  durationMs: number;
  contentType: ContentType.Audio;
}

function isText(content: Content): content is TextContent {
  return content.contentType === ContentType.Text;
}

function isSticker(content: Content): content is StickerContent {
  return content.contentType === ContentType.Sticker;
}

function isImage(content: Content): content is ImageContent {
  return content.contentType === ContentType.Image;
}

function isAudio(content: Content): content is AudioContent {
  return content.contentType === ContentType.Audio;
}

export class ChatMessage {
  private constructor(public proto: proto.ChatMessage) {}

  /**
   * Create a chat message to be sent to an Open (permission = no membership) community.
   *
   * @throws string If mediaContent is malformed
   */
  public static createMessage(
    clock: number,
    timestamp: number,
    chatId: string,
    content: Content,
    responseTo?: string
  ): ChatMessage {
    let sticker,
      image,
      audio,
      text = "Upgrade to the latest version to see this media content.";
    let contentType = ChatMessage_ContentType.CONTENT_TYPE_TEXT_PLAIN;

    if (isText(content)) {
      if (!content.text) throw "Malformed Text Content";
      text = content.text;
      contentType = ChatMessage_ContentType.CONTENT_TYPE_TEXT_PLAIN;
    } else if (isSticker(content)) {
      if (!content.hash || !content.pack) throw "Malformed Sticker Content";
      sticker = {
        hash: content.hash,
        pack: content.pack,
      };
      contentType = ChatMessage_ContentType.CONTENT_TYPE_STICKER;
    } else if (isImage(content)) {
      if (!content.image || !content.imageType) throw "Malformed Image Content";
      image = {
        payload: content.image,
        type: content.imageType,
      };
      contentType = ChatMessage_ContentType.CONTENT_TYPE_IMAGE;
    } else if (isAudio(content)) {
      if (!content.audio || !content.audioType || !content.durationMs)
        throw "Malformed Audio Content";
      audio = {
        payload: content.audio,
        type: content.audioType,
        durationMs: content.durationMs,
      };
      contentType = ChatMessage_ContentType.CONTENT_TYPE_AUDIO;
    }

    const proto = {
      clock, // ms?
      timestamp, //ms?
      text,
      /** Id of the message that we are replying to */
      responseTo: responseTo ?? "",
      /** Ens name of the sender */
      ensName: "",
      /** Public Key of the community (TBC) **/
      chatId,
      /** The type of message (public/one-to-one/private-group-chat) */
      messageType: MessageType.MESSAGE_TYPE_COMMUNITY_CHAT,
      /** The type of the content of the message */
      contentType,
      sticker,
      image,
      audio,
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
