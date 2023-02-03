/* eslint-disable import/export */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { encodeMessage, decodeMessage, message, enumeration } from 'protons-runtime'
import type { Codec } from 'protons-runtime'
import type { Uint8ArrayList } from 'uint8arraylist'

export interface PinMessage {
  clock: bigint
  messageId: string
  chatId: string
  pinned: boolean
  messageType: MessageType
}

export namespace PinMessage {
  let _codec: Codec<PinMessage>

  export const codec = (): Codec<PinMessage> => {
    if (_codec == null) {
      _codec = message<PinMessage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.clock != null && obj.clock !== 0n)) {
          w.uint32(8)
          w.uint64(obj.clock ?? 0n)
        }

        if (opts.writeDefaults === true || (obj.messageId != null && obj.messageId !== '')) {
          w.uint32(18)
          w.string(obj.messageId ?? '')
        }

        if (opts.writeDefaults === true || (obj.chatId != null && obj.chatId !== '')) {
          w.uint32(26)
          w.string(obj.chatId ?? '')
        }

        if (opts.writeDefaults === true || (obj.pinned != null && obj.pinned !== false)) {
          w.uint32(32)
          w.bool(obj.pinned ?? false)
        }

        if (opts.writeDefaults === true || (obj.messageType != null && __MessageTypeValues[obj.messageType] !== 0)) {
          w.uint32(40)
          MessageType.codec().encode(obj.messageType ?? MessageType.UNKNOWN_MESSAGE_TYPE, w)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          clock: 0n,
          messageId: '',
          chatId: '',
          pinned: false,
          messageType: MessageType.UNKNOWN_MESSAGE_TYPE
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.clock = reader.uint64()
              break
            case 2:
              obj.messageId = reader.string()
              break
            case 3:
              obj.chatId = reader.string()
              break
            case 4:
              obj.pinned = reader.bool()
              break
            case 5:
              obj.messageType = MessageType.codec().decode(reader)
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

  export const encode = (obj: Partial<PinMessage>): Uint8Array => {
    return encodeMessage(obj, PinMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): PinMessage => {
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
