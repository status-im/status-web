/* eslint-disable import/export */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { encodeMessage, decodeMessage, message, enumeration } from 'protons-runtime'
import type { Codec } from 'protons-runtime'
import type { Uint8ArrayList } from 'uint8arraylist'

export interface StickerMessage {
  hash: string
  pack: number
}

export namespace StickerMessage {
  let _codec: Codec<StickerMessage>

  export const codec = (): Codec<StickerMessage> => {
    if (_codec == null) {
      _codec = message<StickerMessage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.hash != null && obj.hash !== '')) {
          w.uint32(10)
          w.string(obj.hash ?? '')
        }

        if (opts.writeDefaults === true || (obj.pack != null && obj.pack !== 0)) {
          w.uint32(16)
          w.int32(obj.pack ?? 0)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          hash: '',
          pack: 0
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.hash = reader.string()
              break
            case 2:
              obj.pack = reader.int32()
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

  export const encode = (obj: Partial<StickerMessage>): Uint8Array => {
    return encodeMessage(obj, StickerMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): StickerMessage => {
    return decodeMessage(buf, StickerMessage.codec())
  }
}

export interface ImageMessage {
  payload: Uint8Array
  type: ImageType
}

export namespace ImageMessage {
  let _codec: Codec<ImageMessage>

  export const codec = (): Codec<ImageMessage> => {
    if (_codec == null) {
      _codec = message<ImageMessage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.payload != null && obj.payload.byteLength > 0)) {
          w.uint32(10)
          w.bytes(obj.payload ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.type != null && __ImageTypeValues[obj.type] !== 0)) {
          w.uint32(16)
          ImageType.codec().encode(obj.type ?? ImageType.UNKNOWN_IMAGE_TYPE, w)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          payload: new Uint8Array(0),
          type: ImageType.UNKNOWN_IMAGE_TYPE
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.payload = reader.bytes()
              break
            case 2:
              obj.type = ImageType.codec().decode(reader)
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

  export const encode = (obj: Partial<ImageMessage>): Uint8Array => {
    return encodeMessage(obj, ImageMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): ImageMessage => {
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
    AMR = 'AMR'
  }

  enum __AudioTypeValues {
    UNKNOWN_AUDIO_TYPE = 0,
    AAC = 1,
    AMR = 2
  }

  export namespace AudioType {
    export const codec = (): Codec<AudioType> => {
      return enumeration<AudioType>(__AudioTypeValues)
    }
  }

  let _codec: Codec<AudioMessage>

  export const codec = (): Codec<AudioMessage> => {
    if (_codec == null) {
      _codec = message<AudioMessage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.payload != null && obj.payload.byteLength > 0)) {
          w.uint32(10)
          w.bytes(obj.payload ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.type != null && __AudioTypeValues[obj.type] !== 0)) {
          w.uint32(16)
          AudioMessage.AudioType.codec().encode(obj.type ?? AudioMessage.AudioType.UNKNOWN_AUDIO_TYPE, w)
        }

        if (opts.writeDefaults === true || (obj.durationMs != null && obj.durationMs !== 0n)) {
          w.uint32(24)
          w.uint64(obj.durationMs ?? 0n)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          payload: new Uint8Array(0),
          type: AudioType.UNKNOWN_AUDIO_TYPE,
          durationMs: 0n
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.payload = reader.bytes()
              break
            case 2:
              obj.type = AudioMessage.AudioType.codec().decode(reader)
              break
            case 3:
              obj.durationMs = reader.uint64()
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

  export const encode = (obj: Partial<AudioMessage>): Uint8Array => {
    return encodeMessage(obj, AudioMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): AudioMessage => {
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
  let _codec: Codec<EditMessage>

  export const codec = (): Codec<EditMessage> => {
    if (_codec == null) {
      _codec = message<EditMessage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.clock != null && obj.clock !== 0n)) {
          w.uint32(8)
          w.uint64(obj.clock ?? 0n)
        }

        if (opts.writeDefaults === true || (obj.text != null && obj.text !== '')) {
          w.uint32(18)
          w.string(obj.text ?? '')
        }

        if (opts.writeDefaults === true || (obj.chatId != null && obj.chatId !== '')) {
          w.uint32(26)
          w.string(obj.chatId ?? '')
        }

        if (opts.writeDefaults === true || (obj.messageId != null && obj.messageId !== '')) {
          w.uint32(34)
          w.string(obj.messageId ?? '')
        }

        if (opts.writeDefaults === true || (obj.grant != null && obj.grant.byteLength > 0)) {
          w.uint32(42)
          w.bytes(obj.grant ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.messageType != null && __MessageTypeValues[obj.messageType] !== 0)) {
          w.uint32(48)
          MessageType.codec().encode(obj.messageType ?? MessageType.UNKNOWN_MESSAGE_TYPE, w)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          clock: 0n,
          text: '',
          chatId: '',
          messageId: '',
          grant: new Uint8Array(0),
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
              obj.text = reader.string()
              break
            case 3:
              obj.chatId = reader.string()
              break
            case 4:
              obj.messageId = reader.string()
              break
            case 5:
              obj.grant = reader.bytes()
              break
            case 6:
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

  export const encode = (obj: Partial<EditMessage>): Uint8Array => {
    return encodeMessage(obj, EditMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): EditMessage => {
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
  let _codec: Codec<DeleteMessage>

  export const codec = (): Codec<DeleteMessage> => {
    if (_codec == null) {
      _codec = message<DeleteMessage>((obj, w, opts = {}) => {
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

        if (opts.writeDefaults === true || (obj.grant != null && obj.grant.byteLength > 0)) {
          w.uint32(34)
          w.bytes(obj.grant ?? new Uint8Array(0))
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
          chatId: '',
          messageId: '',
          grant: new Uint8Array(0),
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
              obj.chatId = reader.string()
              break
            case 3:
              obj.messageId = reader.string()
              break
            case 4:
              obj.grant = reader.bytes()
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

  export const encode = (obj: Partial<DeleteMessage>): Uint8Array => {
    return encodeMessage(obj, DeleteMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): DeleteMessage => {
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
  sticker?: StickerMessage
  image?: ImageMessage
  audio?: AudioMessage
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
    SYSTEM_MESSAGE_GAP = 'SYSTEM_MESSAGE_GAP'
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
    SYSTEM_MESSAGE_GAP = 10
  }

  export namespace ContentType {
    export const codec = (): Codec<ContentType> => {
      return enumeration<ContentType>(__ContentTypeValues)
    }
  }

  let _codec: Codec<ChatMessage>

  export const codec = (): Codec<ChatMessage> => {
    if (_codec == null) {
      _codec = message<ChatMessage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.clock != null && obj.clock !== 0n)) {
          w.uint32(8)
          w.uint64(obj.clock ?? 0n)
        }

        if (opts.writeDefaults === true || (obj.timestamp != null && obj.timestamp !== 0n)) {
          w.uint32(16)
          w.uint64(obj.timestamp ?? 0n)
        }

        if (opts.writeDefaults === true || (obj.text != null && obj.text !== '')) {
          w.uint32(26)
          w.string(obj.text ?? '')
        }

        if (opts.writeDefaults === true || (obj.responseTo != null && obj.responseTo !== '')) {
          w.uint32(34)
          w.string(obj.responseTo ?? '')
        }

        if (opts.writeDefaults === true || (obj.ensName != null && obj.ensName !== '')) {
          w.uint32(42)
          w.string(obj.ensName ?? '')
        }

        if (opts.writeDefaults === true || (obj.chatId != null && obj.chatId !== '')) {
          w.uint32(50)
          w.string(obj.chatId ?? '')
        }

        if (opts.writeDefaults === true || (obj.messageType != null && __MessageTypeValues[obj.messageType] !== 0)) {
          w.uint32(56)
          MessageType.codec().encode(obj.messageType ?? MessageType.UNKNOWN_MESSAGE_TYPE, w)
        }

        if (opts.writeDefaults === true || (obj.contentType != null && __ContentTypeValues[obj.contentType] !== 0)) {
          w.uint32(64)
          ChatMessage.ContentType.codec().encode(obj.contentType ?? ChatMessage.ContentType.UNKNOWN_CONTENT_TYPE, w)
        }

        if (obj.sticker != null) {
          w.uint32(74)
          StickerMessage.codec().encode(obj.sticker, w, {
            writeDefaults: false
          })
        }

        if (obj.image != null) {
          w.uint32(82)
          ImageMessage.codec().encode(obj.image, w, {
            writeDefaults: false
          })
        }

        if (obj.audio != null) {
          w.uint32(90)
          AudioMessage.codec().encode(obj.audio, w, {
            writeDefaults: false
          })
        }

        if (opts.writeDefaults === true || (obj.community != null && obj.community.byteLength > 0)) {
          w.uint32(98)
          w.bytes(obj.community ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.grant != null && obj.grant.byteLength > 0)) {
          w.uint32(106)
          w.bytes(obj.grant ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.displayName != null && obj.displayName !== '')) {
          w.uint32(114)
          w.string(obj.displayName ?? '')
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          clock: 0n,
          timestamp: 0n,
          text: '',
          responseTo: '',
          ensName: '',
          chatId: '',
          messageType: MessageType.UNKNOWN_MESSAGE_TYPE,
          contentType: ContentType.UNKNOWN_CONTENT_TYPE,
          community: new Uint8Array(0),
          grant: new Uint8Array(0),
          displayName: ''
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.clock = reader.uint64()
              break
            case 2:
              obj.timestamp = reader.uint64()
              break
            case 3:
              obj.text = reader.string()
              break
            case 4:
              obj.responseTo = reader.string()
              break
            case 5:
              obj.ensName = reader.string()
              break
            case 6:
              obj.chatId = reader.string()
              break
            case 7:
              obj.messageType = MessageType.codec().decode(reader)
              break
            case 8:
              obj.contentType = ChatMessage.ContentType.codec().decode(reader)
              break
            case 9:
              obj.sticker = StickerMessage.codec().decode(reader, reader.uint32())
              break
            case 10:
              obj.image = ImageMessage.codec().decode(reader, reader.uint32())
              break
            case 11:
              obj.audio = AudioMessage.codec().decode(reader, reader.uint32())
              break
            case 12:
              obj.community = reader.bytes()
              break
            case 13:
              obj.grant = reader.bytes()
              break
            case 14:
              obj.displayName = reader.string()
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

  export const encode = (obj: Partial<ChatMessage>): Uint8Array => {
    return encodeMessage(obj, ChatMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): ChatMessage => {
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
