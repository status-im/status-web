/* eslint-disable */
import Long from 'long'
import _m0 from 'protobufjs/minimal'
import {
  ImageType,
  MessageType,
  imageTypeFromJSON,
  imageTypeToJSON,
  messageTypeFromJSON,
  messageTypeToJSON,
} from './enums'

export const protobufPackage = 'communities.v1'

export interface StickerMessage {
  hash: string
  pack: number
}

export interface ImageMessage {
  payload: Uint8Array
  type: ImageType
}

export interface AudioMessage {
  payload: Uint8Array
  type: AudioMessage_AudioType
  durationMs: number
}

export enum AudioMessage_AudioType {
  AUDIO_TYPE_UNKNOWN_UNSPECIFIED = 0,
  AUDIO_TYPE_AAC = 1,
  AUDIO_TYPE_AMR = 2,
  UNRECOGNIZED = -1,
}

export function audioMessage_AudioTypeFromJSON(
  object: any
): AudioMessage_AudioType {
  switch (object) {
    case 0:
    case 'AUDIO_TYPE_UNKNOWN_UNSPECIFIED':
      return AudioMessage_AudioType.AUDIO_TYPE_UNKNOWN_UNSPECIFIED
    case 1:
    case 'AUDIO_TYPE_AAC':
      return AudioMessage_AudioType.AUDIO_TYPE_AAC
    case 2:
    case 'AUDIO_TYPE_AMR':
      return AudioMessage_AudioType.AUDIO_TYPE_AMR
    case -1:
    case 'UNRECOGNIZED':
    default:
      return AudioMessage_AudioType.UNRECOGNIZED
  }
}

export function audioMessage_AudioTypeToJSON(
  object: AudioMessage_AudioType
): string {
  switch (object) {
    case AudioMessage_AudioType.AUDIO_TYPE_UNKNOWN_UNSPECIFIED:
      return 'AUDIO_TYPE_UNKNOWN_UNSPECIFIED'
    case AudioMessage_AudioType.AUDIO_TYPE_AAC:
      return 'AUDIO_TYPE_AAC'
    case AudioMessage_AudioType.AUDIO_TYPE_AMR:
      return 'AUDIO_TYPE_AMR'
    default:
      return 'UNKNOWN'
  }
}

export interface EditMessage {
  clock: number
  /** Text of the message */
  text: string
  chatId: string
  messageId: string
  /** Grant for community edit messages */
  grant: Uint8Array
  /** The type of message (public/one-to-one/private-group-chat) */
  messageType: MessageType
}

export interface DeleteMessage {
  clock: number
  chatId: string
  messageId: string
  /** Grant for community delete messages */
  grant: Uint8Array
  /** The type of message (public/one-to-one/private-group-chat) */
  messageType: MessageType
}

export interface ChatMessage {
  /** Lamport timestamp of the chat message */
  clock: number
  /**
   * Unix timestamps in milliseconds, currently not used as we use whisper as more reliable, but here
   * so that we don't rely on it
   */
  timestamp: number
  /** Text of the message */
  text: string
  /** Id of the message that we are replying to */
  responseTo: string
  /** Ens name of the sender */
  ensName: string
  /**
   * Chat id, this field is symmetric for public-chats and private group chats,
   * but asymmetric in case of one-to-ones, as the sender will use the chat-id
   * of the received, while the receiver will use the chat-id of the sender.
   * Probably should be the concatenation of sender-pk & receiver-pk in alphabetical order
   */
  chatId: string
  /** The type of message (public/one-to-one/private-group-chat) */
  messageType: MessageType
  /** The type of the content of the message */
  contentType: ChatMessage_ContentType
  sticker: StickerMessage | undefined
  image: ImageMessage | undefined
  audio: AudioMessage | undefined
  community: Uint8Array | undefined
  /** Grant for community chat messages */
  grant?: Uint8Array | undefined
}

export enum ChatMessage_ContentType {
  CONTENT_TYPE_UNKNOWN_UNSPECIFIED = 0,
  CONTENT_TYPE_TEXT_PLAIN = 1,
  CONTENT_TYPE_STICKER = 2,
  CONTENT_TYPE_STATUS = 3,
  CONTENT_TYPE_EMOJI = 4,
  CONTENT_TYPE_TRANSACTION_COMMAND = 5,
  /** CONTENT_TYPE_SYSTEM_MESSAGE_CONTENT_PRIVATE_GROUP - Only local */
  CONTENT_TYPE_SYSTEM_MESSAGE_CONTENT_PRIVATE_GROUP = 6,
  CONTENT_TYPE_IMAGE = 7,
  CONTENT_TYPE_AUDIO = 8,
  CONTENT_TYPE_COMMUNITY = 9,
  /** CONTENT_TYPE_SYSTEM_MESSAGE_GAP - Only local */
  CONTENT_TYPE_SYSTEM_MESSAGE_GAP = 10,
  UNRECOGNIZED = -1,
}

export function chatMessage_ContentTypeFromJSON(
  object: any
): ChatMessage_ContentType {
  switch (object) {
    case 0:
    case 'CONTENT_TYPE_UNKNOWN_UNSPECIFIED':
      return ChatMessage_ContentType.CONTENT_TYPE_UNKNOWN_UNSPECIFIED
    case 1:
    case 'CONTENT_TYPE_TEXT_PLAIN':
      return ChatMessage_ContentType.CONTENT_TYPE_TEXT_PLAIN
    case 2:
    case 'CONTENT_TYPE_STICKER':
      return ChatMessage_ContentType.CONTENT_TYPE_STICKER
    case 3:
    case 'CONTENT_TYPE_STATUS':
      return ChatMessage_ContentType.CONTENT_TYPE_STATUS
    case 4:
    case 'CONTENT_TYPE_EMOJI':
      return ChatMessage_ContentType.CONTENT_TYPE_EMOJI
    case 5:
    case 'CONTENT_TYPE_TRANSACTION_COMMAND':
      return ChatMessage_ContentType.CONTENT_TYPE_TRANSACTION_COMMAND
    case 6:
    case 'CONTENT_TYPE_SYSTEM_MESSAGE_CONTENT_PRIVATE_GROUP':
      return ChatMessage_ContentType.CONTENT_TYPE_SYSTEM_MESSAGE_CONTENT_PRIVATE_GROUP
    case 7:
    case 'CONTENT_TYPE_IMAGE':
      return ChatMessage_ContentType.CONTENT_TYPE_IMAGE
    case 8:
    case 'CONTENT_TYPE_AUDIO':
      return ChatMessage_ContentType.CONTENT_TYPE_AUDIO
    case 9:
    case 'CONTENT_TYPE_COMMUNITY':
      return ChatMessage_ContentType.CONTENT_TYPE_COMMUNITY
    case 10:
    case 'CONTENT_TYPE_SYSTEM_MESSAGE_GAP':
      return ChatMessage_ContentType.CONTENT_TYPE_SYSTEM_MESSAGE_GAP
    case -1:
    case 'UNRECOGNIZED':
    default:
      return ChatMessage_ContentType.UNRECOGNIZED
  }
}

export function chatMessage_ContentTypeToJSON(
  object: ChatMessage_ContentType
): string {
  switch (object) {
    case ChatMessage_ContentType.CONTENT_TYPE_UNKNOWN_UNSPECIFIED:
      return 'CONTENT_TYPE_UNKNOWN_UNSPECIFIED'
    case ChatMessage_ContentType.CONTENT_TYPE_TEXT_PLAIN:
      return 'CONTENT_TYPE_TEXT_PLAIN'
    case ChatMessage_ContentType.CONTENT_TYPE_STICKER:
      return 'CONTENT_TYPE_STICKER'
    case ChatMessage_ContentType.CONTENT_TYPE_STATUS:
      return 'CONTENT_TYPE_STATUS'
    case ChatMessage_ContentType.CONTENT_TYPE_EMOJI:
      return 'CONTENT_TYPE_EMOJI'
    case ChatMessage_ContentType.CONTENT_TYPE_TRANSACTION_COMMAND:
      return 'CONTENT_TYPE_TRANSACTION_COMMAND'
    case ChatMessage_ContentType.CONTENT_TYPE_SYSTEM_MESSAGE_CONTENT_PRIVATE_GROUP:
      return 'CONTENT_TYPE_SYSTEM_MESSAGE_CONTENT_PRIVATE_GROUP'
    case ChatMessage_ContentType.CONTENT_TYPE_IMAGE:
      return 'CONTENT_TYPE_IMAGE'
    case ChatMessage_ContentType.CONTENT_TYPE_AUDIO:
      return 'CONTENT_TYPE_AUDIO'
    case ChatMessage_ContentType.CONTENT_TYPE_COMMUNITY:
      return 'CONTENT_TYPE_COMMUNITY'
    case ChatMessage_ContentType.CONTENT_TYPE_SYSTEM_MESSAGE_GAP:
      return 'CONTENT_TYPE_SYSTEM_MESSAGE_GAP'
    default:
      return 'UNKNOWN'
  }
}

const baseStickerMessage: object = { hash: '', pack: 0 }

export const StickerMessage = {
  encode(
    message: StickerMessage,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.hash !== '') {
      writer.uint32(10).string(message.hash)
    }
    if (message.pack !== 0) {
      writer.uint32(16).int32(message.pack)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StickerMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseStickerMessage } as StickerMessage
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.hash = reader.string()
          break
        case 2:
          message.pack = reader.int32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): StickerMessage {
    const message = { ...baseStickerMessage } as StickerMessage
    if (object.hash !== undefined && object.hash !== null) {
      message.hash = String(object.hash)
    } else {
      message.hash = ''
    }
    if (object.pack !== undefined && object.pack !== null) {
      message.pack = Number(object.pack)
    } else {
      message.pack = 0
    }
    return message
  },

  toJSON(message: StickerMessage): unknown {
    const obj: any = {}
    message.hash !== undefined && (obj.hash = message.hash)
    message.pack !== undefined && (obj.pack = message.pack)
    return obj
  },

  fromPartial(object: DeepPartial<StickerMessage>): StickerMessage {
    const message = { ...baseStickerMessage } as StickerMessage
    if (object.hash !== undefined && object.hash !== null) {
      message.hash = object.hash
    } else {
      message.hash = ''
    }
    if (object.pack !== undefined && object.pack !== null) {
      message.pack = object.pack
    } else {
      message.pack = 0
    }
    return message
  },
}

const baseImageMessage: object = { type: 0 }

export const ImageMessage = {
  encode(
    message: ImageMessage,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.payload.length !== 0) {
      writer.uint32(10).bytes(message.payload)
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ImageMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseImageMessage } as ImageMessage
    message.payload = new Uint8Array()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.payload = reader.bytes()
          break
        case 2:
          message.type = reader.int32() as any
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ImageMessage {
    const message = { ...baseImageMessage } as ImageMessage
    message.payload = new Uint8Array()
    if (object.payload !== undefined && object.payload !== null) {
      message.payload = bytesFromBase64(object.payload)
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = imageTypeFromJSON(object.type)
    } else {
      message.type = 0
    }
    return message
  },

  toJSON(message: ImageMessage): unknown {
    const obj: any = {}
    message.payload !== undefined &&
      (obj.payload = base64FromBytes(
        message.payload !== undefined ? message.payload : new Uint8Array()
      ))
    message.type !== undefined && (obj.type = imageTypeToJSON(message.type))
    return obj
  },

  fromPartial(object: DeepPartial<ImageMessage>): ImageMessage {
    const message = { ...baseImageMessage } as ImageMessage
    if (object.payload !== undefined && object.payload !== null) {
      message.payload = object.payload
    } else {
      message.payload = new Uint8Array()
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type
    } else {
      message.type = 0
    }
    return message
  },
}

const baseAudioMessage: object = { type: 0, durationMs: 0 }

export const AudioMessage = {
  encode(
    message: AudioMessage,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.payload.length !== 0) {
      writer.uint32(10).bytes(message.payload)
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type)
    }
    if (message.durationMs !== 0) {
      writer.uint32(24).uint64(message.durationMs)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AudioMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseAudioMessage } as AudioMessage
    message.payload = new Uint8Array()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.payload = reader.bytes()
          break
        case 2:
          message.type = reader.int32() as any
          break
        case 3:
          message.durationMs = longToNumber(reader.uint64() as Long)
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): AudioMessage {
    const message = { ...baseAudioMessage } as AudioMessage
    message.payload = new Uint8Array()
    if (object.payload !== undefined && object.payload !== null) {
      message.payload = bytesFromBase64(object.payload)
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = audioMessage_AudioTypeFromJSON(object.type)
    } else {
      message.type = 0
    }
    if (object.durationMs !== undefined && object.durationMs !== null) {
      message.durationMs = Number(object.durationMs)
    } else {
      message.durationMs = 0
    }
    return message
  },

  toJSON(message: AudioMessage): unknown {
    const obj: any = {}
    message.payload !== undefined &&
      (obj.payload = base64FromBytes(
        message.payload !== undefined ? message.payload : new Uint8Array()
      ))
    message.type !== undefined &&
      (obj.type = audioMessage_AudioTypeToJSON(message.type))
    message.durationMs !== undefined && (obj.durationMs = message.durationMs)
    return obj
  },

  fromPartial(object: DeepPartial<AudioMessage>): AudioMessage {
    const message = { ...baseAudioMessage } as AudioMessage
    if (object.payload !== undefined && object.payload !== null) {
      message.payload = object.payload
    } else {
      message.payload = new Uint8Array()
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type
    } else {
      message.type = 0
    }
    if (object.durationMs !== undefined && object.durationMs !== null) {
      message.durationMs = object.durationMs
    } else {
      message.durationMs = 0
    }
    return message
  },
}

const baseEditMessage: object = {
  clock: 0,
  text: '',
  chatId: '',
  messageId: '',
  messageType: 0,
}

export const EditMessage = {
  encode(
    message: EditMessage,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.clock !== 0) {
      writer.uint32(8).uint64(message.clock)
    }
    if (message.text !== '') {
      writer.uint32(18).string(message.text)
    }
    if (message.chatId !== '') {
      writer.uint32(26).string(message.chatId)
    }
    if (message.messageId !== '') {
      writer.uint32(34).string(message.messageId)
    }
    if (message.grant.length !== 0) {
      writer.uint32(42).bytes(message.grant)
    }
    if (message.messageType !== 0) {
      writer.uint32(48).int32(message.messageType)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EditMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseEditMessage } as EditMessage
    message.grant = new Uint8Array()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.clock = longToNumber(reader.uint64() as Long)
          break
        case 2:
          message.text = reader.string()
          break
        case 3:
          message.chatId = reader.string()
          break
        case 4:
          message.messageId = reader.string()
          break
        case 5:
          message.grant = reader.bytes()
          break
        case 6:
          message.messageType = reader.int32() as any
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): EditMessage {
    const message = { ...baseEditMessage } as EditMessage
    message.grant = new Uint8Array()
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = Number(object.clock)
    } else {
      message.clock = 0
    }
    if (object.text !== undefined && object.text !== null) {
      message.text = String(object.text)
    } else {
      message.text = ''
    }
    if (object.chatId !== undefined && object.chatId !== null) {
      message.chatId = String(object.chatId)
    } else {
      message.chatId = ''
    }
    if (object.messageId !== undefined && object.messageId !== null) {
      message.messageId = String(object.messageId)
    } else {
      message.messageId = ''
    }
    if (object.grant !== undefined && object.grant !== null) {
      message.grant = bytesFromBase64(object.grant)
    }
    if (object.messageType !== undefined && object.messageType !== null) {
      message.messageType = messageTypeFromJSON(object.messageType)
    } else {
      message.messageType = 0
    }
    return message
  },

  toJSON(message: EditMessage): unknown {
    const obj: any = {}
    message.clock !== undefined && (obj.clock = message.clock)
    message.text !== undefined && (obj.text = message.text)
    message.chatId !== undefined && (obj.chatId = message.chatId)
    message.messageId !== undefined && (obj.messageId = message.messageId)
    message.grant !== undefined &&
      (obj.grant = base64FromBytes(
        message.grant !== undefined ? message.grant : new Uint8Array()
      ))
    message.messageType !== undefined &&
      (obj.messageType = messageTypeToJSON(message.messageType))
    return obj
  },

  fromPartial(object: DeepPartial<EditMessage>): EditMessage {
    const message = { ...baseEditMessage } as EditMessage
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = object.clock
    } else {
      message.clock = 0
    }
    if (object.text !== undefined && object.text !== null) {
      message.text = object.text
    } else {
      message.text = ''
    }
    if (object.chatId !== undefined && object.chatId !== null) {
      message.chatId = object.chatId
    } else {
      message.chatId = ''
    }
    if (object.messageId !== undefined && object.messageId !== null) {
      message.messageId = object.messageId
    } else {
      message.messageId = ''
    }
    if (object.grant !== undefined && object.grant !== null) {
      message.grant = object.grant
    } else {
      message.grant = new Uint8Array()
    }
    if (object.messageType !== undefined && object.messageType !== null) {
      message.messageType = object.messageType
    } else {
      message.messageType = 0
    }
    return message
  },
}

const baseDeleteMessage: object = {
  clock: 0,
  chatId: '',
  messageId: '',
  messageType: 0,
}

export const DeleteMessage = {
  encode(
    message: DeleteMessage,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.clock !== 0) {
      writer.uint32(8).uint64(message.clock)
    }
    if (message.chatId !== '') {
      writer.uint32(18).string(message.chatId)
    }
    if (message.messageId !== '') {
      writer.uint32(26).string(message.messageId)
    }
    if (message.grant.length !== 0) {
      writer.uint32(34).bytes(message.grant)
    }
    if (message.messageType !== 0) {
      writer.uint32(40).int32(message.messageType)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseDeleteMessage } as DeleteMessage
    message.grant = new Uint8Array()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.clock = longToNumber(reader.uint64() as Long)
          break
        case 2:
          message.chatId = reader.string()
          break
        case 3:
          message.messageId = reader.string()
          break
        case 4:
          message.grant = reader.bytes()
          break
        case 5:
          message.messageType = reader.int32() as any
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): DeleteMessage {
    const message = { ...baseDeleteMessage } as DeleteMessage
    message.grant = new Uint8Array()
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = Number(object.clock)
    } else {
      message.clock = 0
    }
    if (object.chatId !== undefined && object.chatId !== null) {
      message.chatId = String(object.chatId)
    } else {
      message.chatId = ''
    }
    if (object.messageId !== undefined && object.messageId !== null) {
      message.messageId = String(object.messageId)
    } else {
      message.messageId = ''
    }
    if (object.grant !== undefined && object.grant !== null) {
      message.grant = bytesFromBase64(object.grant)
    }
    if (object.messageType !== undefined && object.messageType !== null) {
      message.messageType = messageTypeFromJSON(object.messageType)
    } else {
      message.messageType = 0
    }
    return message
  },

  toJSON(message: DeleteMessage): unknown {
    const obj: any = {}
    message.clock !== undefined && (obj.clock = message.clock)
    message.chatId !== undefined && (obj.chatId = message.chatId)
    message.messageId !== undefined && (obj.messageId = message.messageId)
    message.grant !== undefined &&
      (obj.grant = base64FromBytes(
        message.grant !== undefined ? message.grant : new Uint8Array()
      ))
    message.messageType !== undefined &&
      (obj.messageType = messageTypeToJSON(message.messageType))
    return obj
  },

  fromPartial(object: DeepPartial<DeleteMessage>): DeleteMessage {
    const message = { ...baseDeleteMessage } as DeleteMessage
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = object.clock
    } else {
      message.clock = 0
    }
    if (object.chatId !== undefined && object.chatId !== null) {
      message.chatId = object.chatId
    } else {
      message.chatId = ''
    }
    if (object.messageId !== undefined && object.messageId !== null) {
      message.messageId = object.messageId
    } else {
      message.messageId = ''
    }
    if (object.grant !== undefined && object.grant !== null) {
      message.grant = object.grant
    } else {
      message.grant = new Uint8Array()
    }
    if (object.messageType !== undefined && object.messageType !== null) {
      message.messageType = object.messageType
    } else {
      message.messageType = 0
    }
    return message
  },
}

const baseChatMessage: object = {
  clock: 0,
  timestamp: 0,
  text: '',
  responseTo: '',
  ensName: '',
  chatId: '',
  messageType: 0,
  contentType: 0,
}

export const ChatMessage = {
  encode(
    message: ChatMessage,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.clock !== 0) {
      writer.uint32(8).uint64(message.clock)
    }
    if (message.timestamp !== 0) {
      writer.uint32(16).uint64(message.timestamp)
    }
    if (message.text !== '') {
      writer.uint32(26).string(message.text)
    }
    if (message.responseTo !== '') {
      writer.uint32(34).string(message.responseTo)
    }
    if (message.ensName !== '') {
      writer.uint32(42).string(message.ensName)
    }
    if (message.chatId !== '') {
      writer.uint32(50).string(message.chatId)
    }
    if (message.messageType !== 0) {
      writer.uint32(56).int32(message.messageType)
    }
    if (message.contentType !== 0) {
      writer.uint32(64).int32(message.contentType)
    }
    if (message.sticker !== undefined) {
      StickerMessage.encode(message.sticker, writer.uint32(74).fork()).ldelim()
    }
    if (message.image !== undefined) {
      ImageMessage.encode(message.image, writer.uint32(82).fork()).ldelim()
    }
    if (message.audio !== undefined) {
      AudioMessage.encode(message.audio, writer.uint32(90).fork()).ldelim()
    }
    if (message.community !== undefined) {
      writer.uint32(98).bytes(message.community)
    }
    if (message.grant !== undefined) {
      writer.uint32(106).bytes(message.grant)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChatMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseChatMessage } as ChatMessage
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.clock = longToNumber(reader.uint64() as Long)
          break
        case 2:
          message.timestamp = longToNumber(reader.uint64() as Long)
          break
        case 3:
          message.text = reader.string()
          break
        case 4:
          message.responseTo = reader.string()
          break
        case 5:
          message.ensName = reader.string()
          break
        case 6:
          message.chatId = reader.string()
          break
        case 7:
          message.messageType = reader.int32() as any
          break
        case 8:
          message.contentType = reader.int32() as any
          break
        case 9:
          message.sticker = StickerMessage.decode(reader, reader.uint32())
          break
        case 10:
          message.image = ImageMessage.decode(reader, reader.uint32())
          break
        case 11:
          message.audio = AudioMessage.decode(reader, reader.uint32())
          break
        case 12:
          message.community = reader.bytes()
          break
        case 13:
          message.grant = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ChatMessage {
    const message = { ...baseChatMessage } as ChatMessage
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = Number(object.clock)
    } else {
      message.clock = 0
    }
    if (object.timestamp !== undefined && object.timestamp !== null) {
      message.timestamp = Number(object.timestamp)
    } else {
      message.timestamp = 0
    }
    if (object.text !== undefined && object.text !== null) {
      message.text = String(object.text)
    } else {
      message.text = ''
    }
    if (object.responseTo !== undefined && object.responseTo !== null) {
      message.responseTo = String(object.responseTo)
    } else {
      message.responseTo = ''
    }
    if (object.ensName !== undefined && object.ensName !== null) {
      message.ensName = String(object.ensName)
    } else {
      message.ensName = ''
    }
    if (object.chatId !== undefined && object.chatId !== null) {
      message.chatId = String(object.chatId)
    } else {
      message.chatId = ''
    }
    if (object.messageType !== undefined && object.messageType !== null) {
      message.messageType = messageTypeFromJSON(object.messageType)
    } else {
      message.messageType = 0
    }
    if (object.contentType !== undefined && object.contentType !== null) {
      message.contentType = chatMessage_ContentTypeFromJSON(object.contentType)
    } else {
      message.contentType = 0
    }
    if (object.sticker !== undefined && object.sticker !== null) {
      message.sticker = StickerMessage.fromJSON(object.sticker)
    } else {
      message.sticker = undefined
    }
    if (object.image !== undefined && object.image !== null) {
      message.image = ImageMessage.fromJSON(object.image)
    } else {
      message.image = undefined
    }
    if (object.audio !== undefined && object.audio !== null) {
      message.audio = AudioMessage.fromJSON(object.audio)
    } else {
      message.audio = undefined
    }
    if (object.community !== undefined && object.community !== null) {
      message.community = bytesFromBase64(object.community)
    }
    if (object.grant !== undefined && object.grant !== null) {
      message.grant = bytesFromBase64(object.grant)
    }
    return message
  },

  toJSON(message: ChatMessage): unknown {
    const obj: any = {}
    message.clock !== undefined && (obj.clock = message.clock)
    message.timestamp !== undefined && (obj.timestamp = message.timestamp)
    message.text !== undefined && (obj.text = message.text)
    message.responseTo !== undefined && (obj.responseTo = message.responseTo)
    message.ensName !== undefined && (obj.ensName = message.ensName)
    message.chatId !== undefined && (obj.chatId = message.chatId)
    message.messageType !== undefined &&
      (obj.messageType = messageTypeToJSON(message.messageType))
    message.contentType !== undefined &&
      (obj.contentType = chatMessage_ContentTypeToJSON(message.contentType))
    message.sticker !== undefined &&
      (obj.sticker = message.sticker
        ? StickerMessage.toJSON(message.sticker)
        : undefined)
    message.image !== undefined &&
      (obj.image = message.image
        ? ImageMessage.toJSON(message.image)
        : undefined)
    message.audio !== undefined &&
      (obj.audio = message.audio
        ? AudioMessage.toJSON(message.audio)
        : undefined)
    message.community !== undefined &&
      (obj.community =
        message.community !== undefined
          ? base64FromBytes(message.community)
          : undefined)
    message.grant !== undefined &&
      (obj.grant =
        message.grant !== undefined
          ? base64FromBytes(message.grant)
          : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<ChatMessage>): ChatMessage {
    const message = { ...baseChatMessage } as ChatMessage
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = object.clock
    } else {
      message.clock = 0
    }
    if (object.timestamp !== undefined && object.timestamp !== null) {
      message.timestamp = object.timestamp
    } else {
      message.timestamp = 0
    }
    if (object.text !== undefined && object.text !== null) {
      message.text = object.text
    } else {
      message.text = ''
    }
    if (object.responseTo !== undefined && object.responseTo !== null) {
      message.responseTo = object.responseTo
    } else {
      message.responseTo = ''
    }
    if (object.ensName !== undefined && object.ensName !== null) {
      message.ensName = object.ensName
    } else {
      message.ensName = ''
    }
    if (object.chatId !== undefined && object.chatId !== null) {
      message.chatId = object.chatId
    } else {
      message.chatId = ''
    }
    if (object.messageType !== undefined && object.messageType !== null) {
      message.messageType = object.messageType
    } else {
      message.messageType = 0
    }
    if (object.contentType !== undefined && object.contentType !== null) {
      message.contentType = object.contentType
    } else {
      message.contentType = 0
    }
    if (object.sticker !== undefined && object.sticker !== null) {
      message.sticker = StickerMessage.fromPartial(object.sticker)
    } else {
      message.sticker = undefined
    }
    if (object.image !== undefined && object.image !== null) {
      message.image = ImageMessage.fromPartial(object.image)
    } else {
      message.image = undefined
    }
    if (object.audio !== undefined && object.audio !== null) {
      message.audio = AudioMessage.fromPartial(object.audio)
    } else {
      message.audio = undefined
    }
    if (object.community !== undefined && object.community !== null) {
      message.community = object.community
    } else {
      message.community = undefined
    }
    if (object.grant !== undefined && object.grant !== null) {
      message.grant = object.grant
    } else {
      message.grant = undefined
    }
    return message
  },
}

declare var self: any | undefined
declare var window: any | undefined
declare var global: any | undefined
var globalThis: any = (() => {
  if (typeof globalThis !== 'undefined') return globalThis
  if (typeof self !== 'undefined') return self
  if (typeof window !== 'undefined') return window
  if (typeof global !== 'undefined') return global
  throw 'Unable to locate global object'
})()

const atob: (b64: string) => string =
  globalThis.atob ||
  (b64 => globalThis.Buffer.from(b64, 'base64').toString('binary'))
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64)
  const arr = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i)
  }
  return arr
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  (bin => globalThis.Buffer.from(bin, 'binary').toString('base64'))
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = []
  for (const byte of arr) {
    bin.push(String.fromCharCode(byte))
  }
  return btoa(bin.join(''))
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error('Value is larger than Number.MAX_SAFE_INTEGER')
  }
  return long.toNumber()
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any
  _m0.configure()
}
