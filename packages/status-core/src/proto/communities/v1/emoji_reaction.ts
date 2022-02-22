/* eslint-disable */
import Long from 'long'
import _m0 from 'protobufjs/minimal'
import {
  MessageType,
  messageTypeFromJSON,
  messageTypeToJSON,
} from '../../communities/v1/enums'

export const protobufPackage = 'communities.v1'

export interface EmojiReaction {
  /** clock Lamport timestamp of the chat message */
  clock: number
  /**
   * chat_id the ID of the chat the message belongs to, for query efficiency the chat_id is stored in the db even though the
   * target message also stores the chat_id
   */
  chatId: string
  /** message_id the ID of the target message that the user wishes to react to */
  messageId: string
  /** message_type is (somewhat confusingly) the ID of the type of chat the message belongs to */
  messageType: MessageType
  /** type the ID of the emoji the user wishes to react with */
  type: EmojiReaction_Type
  /** whether this is a rectraction of a previously sent emoji */
  retracted: boolean
  /** Grant for organisation chat messages */
  grant: Uint8Array
}

export enum EmojiReaction_Type {
  UNKNOWN_EMOJI_REACTION_TYPE = 0,
  LOVE = 1,
  THUMBS_UP = 2,
  THUMBS_DOWN = 3,
  LAUGH = 4,
  SAD = 5,
  ANGRY = 6,
  UNRECOGNIZED = -1,
}

export function emojiReaction_TypeFromJSON(object: any): EmojiReaction_Type {
  switch (object) {
    case 0:
    case 'UNKNOWN_EMOJI_REACTION_TYPE':
      return EmojiReaction_Type.UNKNOWN_EMOJI_REACTION_TYPE
    case 1:
    case 'LOVE':
      return EmojiReaction_Type.LOVE
    case 2:
    case 'THUMBS_UP':
      return EmojiReaction_Type.THUMBS_UP
    case 3:
    case 'THUMBS_DOWN':
      return EmojiReaction_Type.THUMBS_DOWN
    case 4:
    case 'LAUGH':
      return EmojiReaction_Type.LAUGH
    case 5:
    case 'SAD':
      return EmojiReaction_Type.SAD
    case 6:
    case 'ANGRY':
      return EmojiReaction_Type.ANGRY
    case -1:
    case 'UNRECOGNIZED':
    default:
      return EmojiReaction_Type.UNRECOGNIZED
  }
}

export function emojiReaction_TypeToJSON(object: EmojiReaction_Type): string {
  switch (object) {
    case EmojiReaction_Type.UNKNOWN_EMOJI_REACTION_TYPE:
      return 'UNKNOWN_EMOJI_REACTION_TYPE'
    case EmojiReaction_Type.LOVE:
      return 'LOVE'
    case EmojiReaction_Type.THUMBS_UP:
      return 'THUMBS_UP'
    case EmojiReaction_Type.THUMBS_DOWN:
      return 'THUMBS_DOWN'
    case EmojiReaction_Type.LAUGH:
      return 'LAUGH'
    case EmojiReaction_Type.SAD:
      return 'SAD'
    case EmojiReaction_Type.ANGRY:
      return 'ANGRY'
    default:
      return 'UNKNOWN'
  }
}

const baseEmojiReaction: object = {
  clock: 0,
  chatId: '',
  messageId: '',
  messageType: 0,
  type: 0,
  retracted: false,
}

export const EmojiReaction = {
  encode(
    message: EmojiReaction,
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
    if (message.messageType !== 0) {
      writer.uint32(32).int32(message.messageType)
    }
    if (message.type !== 0) {
      writer.uint32(40).int32(message.type)
    }
    if (message.retracted === true) {
      writer.uint32(48).bool(message.retracted)
    }
    if (message.grant.length !== 0) {
      writer.uint32(58).bytes(message.grant)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EmojiReaction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseEmojiReaction } as EmojiReaction
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
          message.messageType = reader.int32() as any
          break
        case 5:
          message.type = reader.int32() as any
          break
        case 6:
          message.retracted = reader.bool()
          break
        case 7:
          message.grant = reader.bytes()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): EmojiReaction {
    const message = { ...baseEmojiReaction } as EmojiReaction
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
    if (object.messageType !== undefined && object.messageType !== null) {
      message.messageType = messageTypeFromJSON(object.messageType)
    } else {
      message.messageType = 0
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = emojiReaction_TypeFromJSON(object.type)
    } else {
      message.type = 0
    }
    if (object.retracted !== undefined && object.retracted !== null) {
      message.retracted = Boolean(object.retracted)
    } else {
      message.retracted = false
    }
    if (object.grant !== undefined && object.grant !== null) {
      message.grant = bytesFromBase64(object.grant)
    }
    return message
  },

  toJSON(message: EmojiReaction): unknown {
    const obj: any = {}
    message.clock !== undefined && (obj.clock = message.clock)
    message.chatId !== undefined && (obj.chatId = message.chatId)
    message.messageId !== undefined && (obj.messageId = message.messageId)
    message.messageType !== undefined &&
      (obj.messageType = messageTypeToJSON(message.messageType))
    message.type !== undefined &&
      (obj.type = emojiReaction_TypeToJSON(message.type))
    message.retracted !== undefined && (obj.retracted = message.retracted)
    message.grant !== undefined &&
      (obj.grant = base64FromBytes(
        message.grant !== undefined ? message.grant : new Uint8Array()
      ))
    return obj
  },

  fromPartial(object: DeepPartial<EmojiReaction>): EmojiReaction {
    const message = { ...baseEmojiReaction } as EmojiReaction
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
    if (object.messageType !== undefined && object.messageType !== null) {
      message.messageType = object.messageType
    } else {
      message.messageType = 0
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type
    } else {
      message.type = 0
    }
    if (object.retracted !== undefined && object.retracted !== null) {
      message.retracted = object.retracted
    } else {
      message.retracted = false
    }
    if (object.grant !== undefined && object.grant !== null) {
      message.grant = object.grant
    } else {
      message.grant = new Uint8Array()
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
