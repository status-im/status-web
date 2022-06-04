/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-namespace */

import {
  encodeMessage,
  decodeMessage,
  message,
  uint64,
  string,
  bool,
  enumeration,
} from 'protons-runtime'
import type { Codec } from 'protons-runtime'

export interface PinMessage {
  clock: bigint
  messageId: string
  chatId: string
  pinned: boolean
  messageType: MessageType
}

export namespace PinMessage {
  export const codec = (): Codec<PinMessage> => {
    return message<PinMessage>({
      1: { name: 'clock', codec: uint64 },
      2: { name: 'messageId', codec: string },
      3: { name: 'chatId', codec: string },
      4: { name: 'pinned', codec: bool },
      5: { name: 'messageType', codec: MessageType.codec() },
    })
  }

  export const encode = (obj: PinMessage): Uint8Array => {
    return encodeMessage(obj, PinMessage.codec())
  }

  export const decode = (buf: Uint8Array): PinMessage => {
    return decodeMessage(buf, PinMessage.codec())
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
