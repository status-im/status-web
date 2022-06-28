/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-namespace */

import { enumeration, encodeMessage, decodeMessage, message, uint64, string, bool, bytes } from 'protons-runtime'
import type { Codec } from 'protons-runtime'

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
    ANGRY = 'ANGRY'
  }

  enum __TypeValues {
    UNKNOWN_EMOJI_REACTION_TYPE = 0,
    LOVE = 1,
    THUMBS_UP = 2,
    THUMBS_DOWN = 3,
    LAUGH = 4,
    SAD = 5,
    ANGRY = 6
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
      7: { name: 'grant', codec: bytes }
    })
  }

  export const encode = (obj: EmojiReaction): Uint8Array => {
    return encodeMessage(obj, EmojiReaction.codec())
  }

  export const decode = (buf: Uint8Array): EmojiReaction => {
    return decodeMessage(buf, EmojiReaction.codec())
  }
}

export enum MessageType {
  UNKNOWN_MESSAGE_TYPE = 'UNKNOWN_MESSAGE_TYPE',
  ONE_TO_ONE = 'ONE_TO_ONE',
  PUBLIC_GROUP = 'PUBLIC_GROUP',
  PRIVATE_GROUP = 'PRIVATE_GROUP',
  SYSTEM_MESSAGE_PRIVATE_GROUP = 'SYSTEM_MESSAGE_PRIVATE_GROUP',
  COMMUNITY_CHAT = 'COMMUNITY_CHAT',
  SYSTEM_MESSAGE_GAP = 'SYSTEM_MESSAGE_GAP'
}

enum __MessageTypeValues {
  UNKNOWN_MESSAGE_TYPE = 0,
  ONE_TO_ONE = 1,
  PUBLIC_GROUP = 2,
  PRIVATE_GROUP = 3,
  SYSTEM_MESSAGE_PRIVATE_GROUP = 4,
  COMMUNITY_CHAT = 5,
  SYSTEM_MESSAGE_GAP = 6
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
  GIF = 'GIF'
}

enum __ImageTypeValues {
  UNKNOWN_IMAGE_TYPE = 0,
  PNG = 1,
  JPEG = 2,
  WEBP = 3,
  GIF = 4
}

export namespace ImageType {
  export const codec = () => {
    return enumeration<typeof ImageType>(__ImageTypeValues)
  }
}
