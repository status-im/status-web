/* eslint-disable import/export */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { enumeration, encodeMessage, decodeMessage, message } from 'protons-runtime'
import type { Codec } from 'protons-runtime'
import type { Uint8ArrayList } from 'uint8arraylist'

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
    export const codec = (): Codec<Type> => {
      return enumeration<Type>(__TypeValues)
    }
  }

  let _codec: Codec<EmojiReaction>

  export const codec = (): Codec<EmojiReaction> => {
    if (_codec == null) {
      _codec = message<EmojiReaction>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.clock != null && obj.clock !== 0n)) {
          w.uint32(8)
          w.uint64(obj.clock ?? 0n)
        }

        if (opts.writeDefaults === true || (obj.chatId != null && obj.chatId !== '')) {
          w.uint32(18)
          w.string(obj.chatId ?? '')
        }

        if (opts.writeDefaults === true || (obj.messageId != null && obj.messageId !== '')) {
          w.uint32(26)
          w.string(obj.messageId ?? '')
        }

        if (opts.writeDefaults === true || (obj.messageType != null && __MessageTypeValues[obj.messageType] !== 0)) {
          w.uint32(32)
          MessageType.codec().encode(obj.messageType ?? MessageType.UNKNOWN_MESSAGE_TYPE, w)
        }

        if (opts.writeDefaults === true || (obj.type != null && __TypeValues[obj.type] !== 0)) {
          w.uint32(40)
          EmojiReaction.Type.codec().encode(obj.type ?? EmojiReaction.Type.UNKNOWN_EMOJI_REACTION_TYPE, w)
        }

        if (opts.writeDefaults === true || (obj.retracted != null && obj.retracted !== false)) {
          w.uint32(48)
          w.bool(obj.retracted ?? false)
        }

        if (opts.writeDefaults === true || (obj.grant != null && obj.grant.byteLength > 0)) {
          w.uint32(58)
          w.bytes(obj.grant ?? new Uint8Array(0))
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          clock: 0n,
          chatId: '',
          messageId: '',
          messageType: MessageType.UNKNOWN_MESSAGE_TYPE,
          type: Type.UNKNOWN_EMOJI_REACTION_TYPE,
          retracted: false,
          grant: new Uint8Array(0)
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.clock = reader.uint64()
              break
            case 2:
              obj.chatId = reader.string()
              break
            case 3:
              obj.messageId = reader.string()
              break
            case 4:
              obj.messageType = MessageType.codec().decode(reader)
              break
            case 5:
              obj.type = EmojiReaction.Type.codec().decode(reader)
              break
            case 6:
              obj.retracted = reader.bool()
              break
            case 7:
              obj.grant = reader.bytes()
              break
            default:
              reader.skipType(tag & 7)
              break
          }
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Partial<EmojiReaction>): Uint8Array => {
    return encodeMessage(obj, EmojiReaction.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): EmojiReaction => {
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
  export const codec = (): Codec<MessageType> => {
    return enumeration<MessageType>(__MessageTypeValues)
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
  export const codec = (): Codec<ImageType> => {
    return enumeration<ImageType>(__ImageTypeValues)
  }
}
