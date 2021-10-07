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

export type MediaContent = StickerContent | ImageContent | AudioContent;

export enum ContentType {
  Sticker,
  Image,
  Audio,
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

function isSticker(content: MediaContent): content is StickerContent {
  return content.contentType === ContentType.Sticker;
}

function isImage(content: MediaContent): content is ImageContent {
  return content.contentType === ContentType.Image;
}

function isAudio(content: MediaContent): content is AudioContent {
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
    text: string,
    chatId: string,
    mediaContent?: MediaContent
  ): ChatMessage {
    let sticker, image, audio;
    let contentType = ChatMessage_ContentType.CONTENT_TYPE_TEXT_PLAIN;

    if (mediaContent) {
      if (isSticker(mediaContent)) {
        if (!mediaContent.hash || !mediaContent.pack)
          throw "Malformed Sticker Content";
        sticker = {
          hash: mediaContent.hash,
          pack: mediaContent.pack,
        };
        contentType = ChatMessage_ContentType.CONTENT_TYPE_STICKER;
      } else if (isImage(mediaContent)) {
        if (!mediaContent.image || !mediaContent.imageType)
          throw "Malformed Image Content";
        image = {
          payload: mediaContent.image,
          type: mediaContent.imageType,
        };
        contentType = ChatMessage_ContentType.CONTENT_TYPE_IMAGE;
      } else if (isAudio(mediaContent)) {
        if (
          !mediaContent.audio ||
          !mediaContent.audioType ||
          !mediaContent.durationMs
        )
          throw "Malformed Audio Content";
        audio = {
          payload: mediaContent.audio,
          type: mediaContent.audioType,
          durationMs: mediaContent.durationMs,
        };
        contentType = ChatMessage_ContentType.CONTENT_TYPE_AUDIO;
      }
    }

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
