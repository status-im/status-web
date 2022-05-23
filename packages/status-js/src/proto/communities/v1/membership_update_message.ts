/* eslint-disable */
import Long from 'long'
import _m0 from 'protobufjs/minimal'
import { ChatMessage } from './chat_message'
import { EmojiReaction } from './emoji_reaction'

export const protobufPackage = 'communities.v1'

export interface MembershipUpdateEvent {
  /** Lamport timestamp of the event */
  clock: number
  /** List of public keys of objects of the action */
  members: string[]
  /** Name of the chat for the CHAT_CREATED/NAME_CHANGED event types */
  name: string
  /** The type of the event */
  type: MembershipUpdateEvent_EventType
}

export enum MembershipUpdateEvent_EventType {
  UNKNOWN = 0,
  CHAT_CREATED = 1,
  NAME_CHANGED = 2,
  MEMBERS_ADDED = 3,
  MEMBER_JOINED = 4,
  MEMBER_REMOVED = 5,
  ADMINS_ADDED = 6,
  ADMIN_REMOVED = 7,
  UNRECOGNIZED = -1,
}

export function membershipUpdateEvent_EventTypeFromJSON(
  object: any
): MembershipUpdateEvent_EventType {
  switch (object) {
    case 0:
    case 'UNKNOWN':
      return MembershipUpdateEvent_EventType.UNKNOWN
    case 1:
    case 'CHAT_CREATED':
      return MembershipUpdateEvent_EventType.CHAT_CREATED
    case 2:
    case 'NAME_CHANGED':
      return MembershipUpdateEvent_EventType.NAME_CHANGED
    case 3:
    case 'MEMBERS_ADDED':
      return MembershipUpdateEvent_EventType.MEMBERS_ADDED
    case 4:
    case 'MEMBER_JOINED':
      return MembershipUpdateEvent_EventType.MEMBER_JOINED
    case 5:
    case 'MEMBER_REMOVED':
      return MembershipUpdateEvent_EventType.MEMBER_REMOVED
    case 6:
    case 'ADMINS_ADDED':
      return MembershipUpdateEvent_EventType.ADMINS_ADDED
    case 7:
    case 'ADMIN_REMOVED':
      return MembershipUpdateEvent_EventType.ADMIN_REMOVED
    case -1:
    case 'UNRECOGNIZED':
    default:
      return MembershipUpdateEvent_EventType.UNRECOGNIZED
  }
}

export function membershipUpdateEvent_EventTypeToJSON(
  object: MembershipUpdateEvent_EventType
): string {
  switch (object) {
    case MembershipUpdateEvent_EventType.UNKNOWN:
      return 'UNKNOWN'
    case MembershipUpdateEvent_EventType.CHAT_CREATED:
      return 'CHAT_CREATED'
    case MembershipUpdateEvent_EventType.NAME_CHANGED:
      return 'NAME_CHANGED'
    case MembershipUpdateEvent_EventType.MEMBERS_ADDED:
      return 'MEMBERS_ADDED'
    case MembershipUpdateEvent_EventType.MEMBER_JOINED:
      return 'MEMBER_JOINED'
    case MembershipUpdateEvent_EventType.MEMBER_REMOVED:
      return 'MEMBER_REMOVED'
    case MembershipUpdateEvent_EventType.ADMINS_ADDED:
      return 'ADMINS_ADDED'
    case MembershipUpdateEvent_EventType.ADMIN_REMOVED:
      return 'ADMIN_REMOVED'
    default:
      return 'UNKNOWN'
  }
}

/**
 * MembershipUpdateMessage is a message used to propagate information
 * about group membership changes.
 * For more information, see https://github.com/status-im/specs/blob/master/status-group-chats-spec.md.
 */
export interface MembershipUpdateMessage {
  /** The chat id of the private group chat */
  chatId: string
  /**
   * A list of events for this group chat, first x bytes are the signature, then is a
   * protobuf encoded MembershipUpdateEvent
   */
  events: Uint8Array[]
  message: ChatMessage | undefined
  emojiReaction: EmojiReaction | undefined
}

const baseMembershipUpdateEvent: object = {
  clock: 0,
  members: '',
  name: '',
  type: 0,
}

export const MembershipUpdateEvent = {
  encode(
    message: MembershipUpdateEvent,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.clock !== 0) {
      writer.uint32(8).uint64(message.clock)
    }
    for (const v of message.members) {
      writer.uint32(18).string(v!)
    }
    if (message.name !== '') {
      writer.uint32(26).string(message.name)
    }
    if (message.type !== 0) {
      writer.uint32(32).int32(message.type)
    }
    return writer
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MembershipUpdateEvent {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseMembershipUpdateEvent } as MembershipUpdateEvent
    message.members = []
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.clock = longToNumber(reader.uint64() as Long)
          break
        case 2:
          message.members.push(reader.string())
          break
        case 3:
          message.name = reader.string()
          break
        case 4:
          message.type = reader.int32() as any
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): MembershipUpdateEvent {
    const message = { ...baseMembershipUpdateEvent } as MembershipUpdateEvent
    message.members = []
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = Number(object.clock)
    } else {
      message.clock = 0
    }
    if (object.members !== undefined && object.members !== null) {
      for (const e of object.members) {
        message.members.push(String(e))
      }
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name)
    } else {
      message.name = ''
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = membershipUpdateEvent_EventTypeFromJSON(object.type)
    } else {
      message.type = 0
    }
    return message
  },

  toJSON(message: MembershipUpdateEvent): unknown {
    const obj: any = {}
    message.clock !== undefined && (obj.clock = message.clock)
    if (message.members) {
      obj.members = message.members.map(e => e)
    } else {
      obj.members = []
    }
    message.name !== undefined && (obj.name = message.name)
    message.type !== undefined &&
      (obj.type = membershipUpdateEvent_EventTypeToJSON(message.type))
    return obj
  },

  fromPartial(
    object: DeepPartial<MembershipUpdateEvent>
  ): MembershipUpdateEvent {
    const message = { ...baseMembershipUpdateEvent } as MembershipUpdateEvent
    message.members = []
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = object.clock
    } else {
      message.clock = 0
    }
    if (object.members !== undefined && object.members !== null) {
      for (const e of object.members) {
        message.members.push(e)
      }
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name
    } else {
      message.name = ''
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type
    } else {
      message.type = 0
    }
    return message
  },
}

const baseMembershipUpdateMessage: object = { chatId: '' }

export const MembershipUpdateMessage = {
  encode(
    message: MembershipUpdateMessage,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.chatId !== '') {
      writer.uint32(10).string(message.chatId)
    }
    for (const v of message.events) {
      writer.uint32(18).bytes(v!)
    }
    if (message.message !== undefined) {
      ChatMessage.encode(message.message, writer.uint32(26).fork()).ldelim()
    }
    if (message.emojiReaction !== undefined) {
      EmojiReaction.encode(
        message.emojiReaction,
        writer.uint32(34).fork()
      ).ldelim()
    }
    return writer
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MembershipUpdateMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {
      ...baseMembershipUpdateMessage,
    } as MembershipUpdateMessage
    message.events = []
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.chatId = reader.string()
          break
        case 2:
          message.events.push(reader.bytes())
          break
        case 3:
          message.message = ChatMessage.decode(reader, reader.uint32())
          break
        case 4:
          message.emojiReaction = EmojiReaction.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): MembershipUpdateMessage {
    const message = {
      ...baseMembershipUpdateMessage,
    } as MembershipUpdateMessage
    message.events = []
    if (object.chatId !== undefined && object.chatId !== null) {
      message.chatId = String(object.chatId)
    } else {
      message.chatId = ''
    }
    if (object.events !== undefined && object.events !== null) {
      for (const e of object.events) {
        message.events.push(bytesFromBase64(e))
      }
    }
    if (object.message !== undefined && object.message !== null) {
      message.message = ChatMessage.fromJSON(object.message)
    } else {
      message.message = undefined
    }
    if (object.emojiReaction !== undefined && object.emojiReaction !== null) {
      message.emojiReaction = EmojiReaction.fromJSON(object.emojiReaction)
    } else {
      message.emojiReaction = undefined
    }
    return message
  },

  toJSON(message: MembershipUpdateMessage): unknown {
    const obj: any = {}
    message.chatId !== undefined && (obj.chatId = message.chatId)
    if (message.events) {
      obj.events = message.events.map(e =>
        base64FromBytes(e !== undefined ? e : new Uint8Array())
      )
    } else {
      obj.events = []
    }
    message.message !== undefined &&
      (obj.message = message.message
        ? ChatMessage.toJSON(message.message)
        : undefined)
    message.emojiReaction !== undefined &&
      (obj.emojiReaction = message.emojiReaction
        ? EmojiReaction.toJSON(message.emojiReaction)
        : undefined)
    return obj
  },

  fromPartial(
    object: DeepPartial<MembershipUpdateMessage>
  ): MembershipUpdateMessage {
    const message = {
      ...baseMembershipUpdateMessage,
    } as MembershipUpdateMessage
    message.events = []
    if (object.chatId !== undefined && object.chatId !== null) {
      message.chatId = object.chatId
    } else {
      message.chatId = ''
    }
    if (object.events !== undefined && object.events !== null) {
      for (const e of object.events) {
        message.events.push(e)
      }
    }
    if (object.message !== undefined && object.message !== null) {
      message.message = ChatMessage.fromPartial(object.message)
    } else {
      message.message = undefined
    }
    if (object.emojiReaction !== undefined && object.emojiReaction !== null) {
      message.emojiReaction = EmojiReaction.fromPartial(object.emojiReaction)
    } else {
      message.emojiReaction = undefined
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
