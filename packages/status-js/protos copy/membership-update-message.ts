/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-namespace */

import {
  enumeration,
  encodeMessage,
  decodeMessage,
  message,
  uint64,
  string,
  bytes,
  int32,
  bool,
} from 'protons-runtime'
import type { Codec } from 'protons-runtime'

export interface MembershipUpdateEvent {
  clock: bigint
  members: string[]
  name: string
  type: MembershipUpdateEvent.EventType
}

export namespace MembershipUpdateEvent {
  export enum EventType {
    UNKNOWN = 'UNKNOWN',
    CHAT_CREATED = 'CHAT_CREATED',
    NAME_CHANGED = 'NAME_CHANGED',
    MEMBERS_ADDED = 'MEMBERS_ADDED',
    MEMBER_JOINED = 'MEMBER_JOINED',
    MEMBER_REMOVED = 'MEMBER_REMOVED',
    ADMINS_ADDED = 'ADMINS_ADDED',
    ADMIN_REMOVED = 'ADMIN_REMOVED',
  }

  enum __EventTypeValues {
    UNKNOWN = 0,
    CHAT_CREATED = 1,
    NAME_CHANGED = 2,
    MEMBERS_ADDED = 3,
    MEMBER_JOINED = 4,
    MEMBER_REMOVED = 5,
    ADMINS_ADDED = 6,
    ADMIN_REMOVED = 7,
  }

  export namespace EventType {
    export const codec = () => {
      return enumeration<typeof EventType>(__EventTypeValues)
    }
  }

  export const codec = (): Codec<MembershipUpdateEvent> => {
    return message<MembershipUpdateEvent>({
      1: { name: 'clock', codec: uint64 },
      2: { name: 'members', codec: string, repeats: true },
      3: { name: 'name', codec: string },
      4: { name: 'type', codec: MembershipUpdateEvent.EventType.codec() },
    })
  }

  export const encode = (obj: MembershipUpdateEvent): Uint8Array => {
    return encodeMessage(obj, MembershipUpdateEvent.codec())
  }

  export const decode = (buf: Uint8Array): MembershipUpdateEvent => {
    return decodeMessage(buf, MembershipUpdateEvent.codec())
  }
}

export interface MembershipUpdateMessage {
  chatId: string
  events: Uint8Array[]
  message: ChatMessage
  emojiReaction: EmojiReaction
}

export namespace MembershipUpdateMessage {
  export const codec = (): Codec<MembershipUpdateMessage> => {
    return message<MembershipUpdateMessage>({
      1: { name: 'chatId', codec: string },
      2: { name: 'events', codec: bytes, repeats: true },
      3: { name: 'message', codec: ChatMessage.codec() },
      4: { name: 'emojiReaction', codec: EmojiReaction.codec() },
    })
  }

  export const encode = (obj: MembershipUpdateMessage): Uint8Array => {
    return encodeMessage(obj, MembershipUpdateMessage.codec())
  }

  export const decode = (buf: Uint8Array): MembershipUpdateMessage => {
    return decodeMessage(buf, MembershipUpdateMessage.codec())
  }
}

export interface StickerMessage {
  hash: string
  pack: number
}

export namespace StickerMessage {
  export const codec = (): Codec<StickerMessage> => {
    return message<StickerMessage>({
      1: { name: 'hash', codec: string },
      2: { name: 'pack', codec: int32 },
    })
  }

  export const encode = (obj: StickerMessage): Uint8Array => {
    return encodeMessage(obj, StickerMessage.codec())
  }

  export const decode = (buf: Uint8Array): StickerMessage => {
    return decodeMessage(buf, StickerMessage.codec())
  }
}

export interface ImageMessage {
  payload: Uint8Array
  type: ImageType
}

export namespace ImageMessage {
  export const codec = (): Codec<ImageMessage> => {
    return message<ImageMessage>({
      1: { name: 'payload', codec: bytes },
      2: { name: 'type', codec: ImageType.codec() },
    })
  }

  export const encode = (obj: ImageMessage): Uint8Array => {
    return encodeMessage(obj, ImageMessage.codec())
  }

  export const decode = (buf: Uint8Array): ImageMessage => {
    return decodeMessage(buf, ImageMessage.codec())
  }
}

export interface AudioMessage {
  payload: Uint8Array
  type: AudioMessage.AudioType
  durationMs: bigint
}

export namespace AudioMessage {
  export enum AudioType {
    UNKNOWN_AUDIO_TYPE = 'UNKNOWN_AUDIO_TYPE',
    AAC = 'AAC',
    AMR = 'AMR',
  }

  enum __AudioTypeValues {
    UNKNOWN_AUDIO_TYPE = 0,
    AAC = 1,
    AMR = 2,
  }

  export namespace AudioType {
    export const codec = () => {
      return enumeration<typeof AudioType>(__AudioTypeValues)
    }
  }

  export const codec = (): Codec<AudioMessage> => {
    return message<AudioMessage>({
      1: { name: 'payload', codec: bytes },
      2: { name: 'type', codec: AudioMessage.AudioType.codec() },
      3: { name: 'durationMs', codec: uint64 },
    })
  }

  export const encode = (obj: AudioMessage): Uint8Array => {
    return encodeMessage(obj, AudioMessage.codec())
  }

  export const decode = (buf: Uint8Array): AudioMessage => {
    return decodeMessage(buf, AudioMessage.codec())
  }
}

export interface EditMessage {
  clock: bigint
  text: string
  chatId: string
  messageId: string
  grant: Uint8Array
  messageType: MessageType
}

export namespace EditMessage {
  export const codec = (): Codec<EditMessage> => {
    return message<EditMessage>({
      1: { name: 'clock', codec: uint64 },
      2: { name: 'text', codec: string },
      3: { name: 'chatId', codec: string },
      4: { name: 'messageId', codec: string },
      5: { name: 'grant', codec: bytes },
      6: { name: 'messageType', codec: MessageType.codec() },
    })
  }

  export const encode = (obj: EditMessage): Uint8Array => {
    return encodeMessage(obj, EditMessage.codec())
  }

  export const decode = (buf: Uint8Array): EditMessage => {
    return decodeMessage(buf, EditMessage.codec())
  }
}

export interface DeleteMessage {
  clock: bigint
  chatId: string
  messageId: string
  grant: Uint8Array
  messageType: MessageType
}

export namespace DeleteMessage {
  export const codec = (): Codec<DeleteMessage> => {
    return message<DeleteMessage>({
      1: { name: 'clock', codec: uint64 },
      2: { name: 'chatId', codec: string },
      3: { name: 'messageId', codec: string },
      4: { name: 'grant', codec: bytes },
      5: { name: 'messageType', codec: MessageType.codec() },
    })
  }

  export const encode = (obj: DeleteMessage): Uint8Array => {
    return encodeMessage(obj, DeleteMessage.codec())
  }

  export const decode = (buf: Uint8Array): DeleteMessage => {
    return decodeMessage(buf, DeleteMessage.codec())
  }
}

export interface ChatMessage {
  clock: bigint
  timestamp: bigint
  text: string
  responseTo: string
  ensName: string
  chatId: string
  messageType: MessageType
  contentType: ChatMessage.ContentType
  sticker: StickerMessage
  image: ImageMessage
  audio: AudioMessage
  community: Uint8Array
  grant: Uint8Array
  displayName: string
}

export namespace ChatMessage {
  export enum ContentType {
    UNKNOWN_CONTENT_TYPE = 'UNKNOWN_CONTENT_TYPE',
    TEXT_PLAIN = 'TEXT_PLAIN',
    STICKER = 'STICKER',
    STATUS = 'STATUS',
    EMOJI = 'EMOJI',
    TRANSACTION_COMMAND = 'TRANSACTION_COMMAND',
    SYSTEM_MESSAGE_CONTENT_PRIVATE_GROUP = 'SYSTEM_MESSAGE_CONTENT_PRIVATE_GROUP',
    IMAGE = 'IMAGE',
    AUDIO = 'AUDIO',
    COMMUNITY = 'COMMUNITY',
    SYSTEM_MESSAGE_GAP = 'SYSTEM_MESSAGE_GAP',
  }

  enum __ContentTypeValues {
    UNKNOWN_CONTENT_TYPE = 0,
    TEXT_PLAIN = 1,
    STICKER = 2,
    STATUS = 3,
    EMOJI = 4,
    TRANSACTION_COMMAND = 5,
    SYSTEM_MESSAGE_CONTENT_PRIVATE_GROUP = 6,
    IMAGE = 7,
    AUDIO = 8,
    COMMUNITY = 9,
    SYSTEM_MESSAGE_GAP = 10,
  }

  export namespace ContentType {
    export const codec = () => {
      return enumeration<typeof ContentType>(__ContentTypeValues)
    }
  }

  export const codec = (): Codec<ChatMessage> => {
    return message<ChatMessage>({
      1: { name: 'clock', codec: uint64 },
      2: { name: 'timestamp', codec: uint64 },
      3: { name: 'text', codec: string },
      4: { name: 'responseTo', codec: string },
      5: { name: 'ensName', codec: string },
      6: { name: 'chatId', codec: string },
      7: { name: 'messageType', codec: MessageType.codec() },
      8: { name: 'contentType', codec: ChatMessage.ContentType.codec() },
      9: { name: 'sticker', codec: StickerMessage.codec() },
      10: { name: 'image', codec: ImageMessage.codec() },
      11: { name: 'audio', codec: AudioMessage.codec() },
      12: { name: 'community', codec: bytes },
      13: { name: 'grant', codec: bytes },
      14: { name: 'displayName', codec: string },
    })
  }

  export const encode = (obj: ChatMessage): Uint8Array => {
    return encodeMessage(obj, ChatMessage.codec())
  }

  export const decode = (buf: Uint8Array): ChatMessage => {
    return decodeMessage(buf, ChatMessage.codec())
  }
}

export enum MessageType {
  UNKNOWN_MESSAGE_TYPE = 'UNKNOWN_MESSAGE_TYPE',
  ONE_TO_ONE = 'ONE_TO_ONE',
  PUBLIC_GROUP = 'PUBLIC_GROUP',
  PRIVATE_GROUP = 'PRIVATE_GROUP',
  SYSTEM_MESSAGE_PRIVATE_GROUP = 'SYSTEM_MESSAGE_PRIVATE_GROUP',
  COMMUNITY_CHAT = 'COMMUNITY_CHAT',
  SYSTEM_MESSAGE_GAP = 'SYSTEM_MESSAGE_GAP',
}

enum __MessageTypeValues {
  UNKNOWN_MESSAGE_TYPE = 0,
  ONE_TO_ONE = 1,
  PUBLIC_GROUP = 2,
  PRIVATE_GROUP = 3,
  SYSTEM_MESSAGE_PRIVATE_GROUP = 4,
  COMMUNITY_CHAT = 5,
  SYSTEM_MESSAGE_GAP = 6,
}

export namespace MessageType {
  export const codec = () => {
    return enumeration<typeof MessageType>(__MessageTypeValues)
  }
}
export enum ImageType {
  UNKNOWN_IMAGE_TYPE = 'UNKNOWN_IMAGE_TYPE',
  PNG = 'PNG',
  JPEG = 'JPEG',
  WEBP = 'WEBP',
  GIF = 'GIF',
}

enum __ImageTypeValues {
  UNKNOWN_IMAGE_TYPE = 0,
  PNG = 1,
  JPEG = 2,
  WEBP = 3,
  GIF = 4,
}

export namespace ImageType {
  export const codec = () => {
    return enumeration<typeof ImageType>(__ImageTypeValues)
  }
}
export interface EmojiReaction {
  clock: bigint
  chatId: string
  messageId: string
  messageType: MessageType
  type: EmojiReaction.Type
  retracted: boolean
  grant: Uint8Array
}

export namespace EmojiReaction {
  export enum Type {
    UNKNOWN_EMOJI_REACTION_TYPE = 'UNKNOWN_EMOJI_REACTION_TYPE',
    LOVE = 'LOVE',
    THUMBS_UP = 'THUMBS_UP',
    THUMBS_DOWN = 'THUMBS_DOWN',
    LAUGH = 'LAUGH',
    SAD = 'SAD',
    ANGRY = 'ANGRY',
  }

  enum __TypeValues {
    UNKNOWN_EMOJI_REACTION_TYPE = 0,
    LOVE = 1,
    THUMBS_UP = 2,
    THUMBS_DOWN = 3,
    LAUGH = 4,
    SAD = 5,
    ANGRY = 6,
  }

  export namespace Type {
    export const codec = () => {
      return enumeration<typeof Type>(__TypeValues)
    }
  }

  export const codec = (): Codec<EmojiReaction> => {
    return message<EmojiReaction>({
      1: { name: 'clock', codec: uint64 },
      2: { name: 'chatId', codec: string },
      3: { name: 'messageId', codec: string },
      4: { name: 'messageType', codec: MessageType.codec() },
      5: { name: 'type', codec: EmojiReaction.Type.codec() },
      6: { name: 'retracted', codec: bool },
      7: { name: 'grant', codec: bytes },
    })
  }

  export const encode = (obj: EmojiReaction): Uint8Array => {
    return encodeMessage(obj, EmojiReaction.codec())
  }

  export const decode = (buf: Uint8Array): EmojiReaction => {
    return decodeMessage(buf, EmojiReaction.codec())
  }
}
