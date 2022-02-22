/* eslint-disable */
import Long from 'long'
import _m0 from 'protobufjs/minimal'

export const protobufPackage = 'status.v1'

export interface ApplicationMetadataMessage {
  /** Signature of the payload field */
  signature: Uint8Array
  /** This is the encoded protobuf of the application level message, i.e ChatMessage */
  payload: Uint8Array
  /** The type of protobuf message sent */
  type: ApplicationMetadataMessage_Type
}

export enum ApplicationMetadataMessage_Type {
  TYPE_UNKNOWN_UNSPECIFIED = 0,
  TYPE_CHAT_MESSAGE = 1,
  TYPE_CONTACT_UPDATE = 2,
  TYPE_MEMBERSHIP_UPDATE_MESSAGE = 3,
  TYPE_PAIR_INSTALLATION = 4,
  TYPE_SYNC_INSTALLATION = 5,
  TYPE_REQUEST_ADDRESS_FOR_TRANSACTION = 6,
  TYPE_ACCEPT_REQUEST_ADDRESS_FOR_TRANSACTION = 7,
  TYPE_DECLINE_REQUEST_ADDRESS_FOR_TRANSACTION = 8,
  TYPE_REQUEST_TRANSACTION = 9,
  TYPE_SEND_TRANSACTION = 10,
  TYPE_DECLINE_REQUEST_TRANSACTION = 11,
  TYPE_SYNC_INSTALLATION_CONTACT = 12,
  TYPE_SYNC_INSTALLATION_ACCOUNT = 13,
  TYPE_SYNC_INSTALLATION_PUBLIC_CHAT = 14,
  TYPE_CONTACT_CODE_ADVERTISEMENT = 15,
  TYPE_PUSH_NOTIFICATION_REGISTRATION = 16,
  TYPE_PUSH_NOTIFICATION_REGISTRATION_RESPONSE = 17,
  TYPE_PUSH_NOTIFICATION_QUERY = 18,
  TYPE_PUSH_NOTIFICATION_QUERY_RESPONSE = 19,
  TYPE_PUSH_NOTIFICATION_REQUEST = 20,
  TYPE_PUSH_NOTIFICATION_RESPONSE = 21,
  TYPE_EMOJI_REACTION = 22,
  TYPE_GROUP_CHAT_INVITATION = 23,
  TYPE_CHAT_IDENTITY = 24,
  TYPE_COMMUNITY_DESCRIPTION = 25,
  TYPE_COMMUNITY_INVITATION = 26,
  TYPE_COMMUNITY_REQUEST_TO_JOIN = 27,
  TYPE_PIN_MESSAGE = 28,
  TYPE_EDIT_MESSAGE = 29,
  TYPE_STATUS_UPDATE = 30,
  TYPE_DELETE_MESSAGE = 31,
  TYPE_SYNC_INSTALLATION_COMMUNITY = 32,
  TYPE_ANONYMOUS_METRIC_BATCH = 33,
  UNRECOGNIZED = -1,
}

export function applicationMetadataMessage_TypeFromJSON(
  object: any
): ApplicationMetadataMessage_Type {
  switch (object) {
    case 0:
    case 'TYPE_UNKNOWN_UNSPECIFIED':
      return ApplicationMetadataMessage_Type.TYPE_UNKNOWN_UNSPECIFIED
    case 1:
    case 'TYPE_CHAT_MESSAGE':
      return ApplicationMetadataMessage_Type.TYPE_CHAT_MESSAGE
    case 2:
    case 'TYPE_CONTACT_UPDATE':
      return ApplicationMetadataMessage_Type.TYPE_CONTACT_UPDATE
    case 3:
    case 'TYPE_MEMBERSHIP_UPDATE_MESSAGE':
      return ApplicationMetadataMessage_Type.TYPE_MEMBERSHIP_UPDATE_MESSAGE
    case 4:
    case 'TYPE_PAIR_INSTALLATION':
      return ApplicationMetadataMessage_Type.TYPE_PAIR_INSTALLATION
    case 5:
    case 'TYPE_SYNC_INSTALLATION':
      return ApplicationMetadataMessage_Type.TYPE_SYNC_INSTALLATION
    case 6:
    case 'TYPE_REQUEST_ADDRESS_FOR_TRANSACTION':
      return ApplicationMetadataMessage_Type.TYPE_REQUEST_ADDRESS_FOR_TRANSACTION
    case 7:
    case 'TYPE_ACCEPT_REQUEST_ADDRESS_FOR_TRANSACTION':
      return ApplicationMetadataMessage_Type.TYPE_ACCEPT_REQUEST_ADDRESS_FOR_TRANSACTION
    case 8:
    case 'TYPE_DECLINE_REQUEST_ADDRESS_FOR_TRANSACTION':
      return ApplicationMetadataMessage_Type.TYPE_DECLINE_REQUEST_ADDRESS_FOR_TRANSACTION
    case 9:
    case 'TYPE_REQUEST_TRANSACTION':
      return ApplicationMetadataMessage_Type.TYPE_REQUEST_TRANSACTION
    case 10:
    case 'TYPE_SEND_TRANSACTION':
      return ApplicationMetadataMessage_Type.TYPE_SEND_TRANSACTION
    case 11:
    case 'TYPE_DECLINE_REQUEST_TRANSACTION':
      return ApplicationMetadataMessage_Type.TYPE_DECLINE_REQUEST_TRANSACTION
    case 12:
    case 'TYPE_SYNC_INSTALLATION_CONTACT':
      return ApplicationMetadataMessage_Type.TYPE_SYNC_INSTALLATION_CONTACT
    case 13:
    case 'TYPE_SYNC_INSTALLATION_ACCOUNT':
      return ApplicationMetadataMessage_Type.TYPE_SYNC_INSTALLATION_ACCOUNT
    case 14:
    case 'TYPE_SYNC_INSTALLATION_PUBLIC_CHAT':
      return ApplicationMetadataMessage_Type.TYPE_SYNC_INSTALLATION_PUBLIC_CHAT
    case 15:
    case 'TYPE_CONTACT_CODE_ADVERTISEMENT':
      return ApplicationMetadataMessage_Type.TYPE_CONTACT_CODE_ADVERTISEMENT
    case 16:
    case 'TYPE_PUSH_NOTIFICATION_REGISTRATION':
      return ApplicationMetadataMessage_Type.TYPE_PUSH_NOTIFICATION_REGISTRATION
    case 17:
    case 'TYPE_PUSH_NOTIFICATION_REGISTRATION_RESPONSE':
      return ApplicationMetadataMessage_Type.TYPE_PUSH_NOTIFICATION_REGISTRATION_RESPONSE
    case 18:
    case 'TYPE_PUSH_NOTIFICATION_QUERY':
      return ApplicationMetadataMessage_Type.TYPE_PUSH_NOTIFICATION_QUERY
    case 19:
    case 'TYPE_PUSH_NOTIFICATION_QUERY_RESPONSE':
      return ApplicationMetadataMessage_Type.TYPE_PUSH_NOTIFICATION_QUERY_RESPONSE
    case 20:
    case 'TYPE_PUSH_NOTIFICATION_REQUEST':
      return ApplicationMetadataMessage_Type.TYPE_PUSH_NOTIFICATION_REQUEST
    case 21:
    case 'TYPE_PUSH_NOTIFICATION_RESPONSE':
      return ApplicationMetadataMessage_Type.TYPE_PUSH_NOTIFICATION_RESPONSE
    case 22:
    case 'TYPE_EMOJI_REACTION':
      return ApplicationMetadataMessage_Type.TYPE_EMOJI_REACTION
    case 23:
    case 'TYPE_GROUP_CHAT_INVITATION':
      return ApplicationMetadataMessage_Type.TYPE_GROUP_CHAT_INVITATION
    case 24:
    case 'TYPE_CHAT_IDENTITY':
      return ApplicationMetadataMessage_Type.TYPE_CHAT_IDENTITY
    case 25:
    case 'TYPE_COMMUNITY_DESCRIPTION':
      return ApplicationMetadataMessage_Type.TYPE_COMMUNITY_DESCRIPTION
    case 26:
    case 'TYPE_COMMUNITY_INVITATION':
      return ApplicationMetadataMessage_Type.TYPE_COMMUNITY_INVITATION
    case 27:
    case 'TYPE_COMMUNITY_REQUEST_TO_JOIN':
      return ApplicationMetadataMessage_Type.TYPE_COMMUNITY_REQUEST_TO_JOIN
    case 28:
    case 'TYPE_PIN_MESSAGE':
      return ApplicationMetadataMessage_Type.TYPE_PIN_MESSAGE
    case 29:
    case 'TYPE_EDIT_MESSAGE':
      return ApplicationMetadataMessage_Type.TYPE_EDIT_MESSAGE
    case 30:
    case 'TYPE_STATUS_UPDATE':
      return ApplicationMetadataMessage_Type.TYPE_STATUS_UPDATE
    case 31:
    case 'TYPE_DELETE_MESSAGE':
      return ApplicationMetadataMessage_Type.TYPE_DELETE_MESSAGE
    case 32:
    case 'TYPE_SYNC_INSTALLATION_COMMUNITY':
      return ApplicationMetadataMessage_Type.TYPE_SYNC_INSTALLATION_COMMUNITY
    case 33:
    case 'TYPE_ANONYMOUS_METRIC_BATCH':
      return ApplicationMetadataMessage_Type.TYPE_ANONYMOUS_METRIC_BATCH
    case -1:
    case 'UNRECOGNIZED':
    default:
      return ApplicationMetadataMessage_Type.UNRECOGNIZED
  }
}

export function applicationMetadataMessage_TypeToJSON(
  object: ApplicationMetadataMessage_Type
): string {
  switch (object) {
    case ApplicationMetadataMessage_Type.TYPE_UNKNOWN_UNSPECIFIED:
      return 'TYPE_UNKNOWN_UNSPECIFIED'
    case ApplicationMetadataMessage_Type.TYPE_CHAT_MESSAGE:
      return 'TYPE_CHAT_MESSAGE'
    case ApplicationMetadataMessage_Type.TYPE_CONTACT_UPDATE:
      return 'TYPE_CONTACT_UPDATE'
    case ApplicationMetadataMessage_Type.TYPE_MEMBERSHIP_UPDATE_MESSAGE:
      return 'TYPE_MEMBERSHIP_UPDATE_MESSAGE'
    case ApplicationMetadataMessage_Type.TYPE_PAIR_INSTALLATION:
      return 'TYPE_PAIR_INSTALLATION'
    case ApplicationMetadataMessage_Type.TYPE_SYNC_INSTALLATION:
      return 'TYPE_SYNC_INSTALLATION'
    case ApplicationMetadataMessage_Type.TYPE_REQUEST_ADDRESS_FOR_TRANSACTION:
      return 'TYPE_REQUEST_ADDRESS_FOR_TRANSACTION'
    case ApplicationMetadataMessage_Type.TYPE_ACCEPT_REQUEST_ADDRESS_FOR_TRANSACTION:
      return 'TYPE_ACCEPT_REQUEST_ADDRESS_FOR_TRANSACTION'
    case ApplicationMetadataMessage_Type.TYPE_DECLINE_REQUEST_ADDRESS_FOR_TRANSACTION:
      return 'TYPE_DECLINE_REQUEST_ADDRESS_FOR_TRANSACTION'
    case ApplicationMetadataMessage_Type.TYPE_REQUEST_TRANSACTION:
      return 'TYPE_REQUEST_TRANSACTION'
    case ApplicationMetadataMessage_Type.TYPE_SEND_TRANSACTION:
      return 'TYPE_SEND_TRANSACTION'
    case ApplicationMetadataMessage_Type.TYPE_DECLINE_REQUEST_TRANSACTION:
      return 'TYPE_DECLINE_REQUEST_TRANSACTION'
    case ApplicationMetadataMessage_Type.TYPE_SYNC_INSTALLATION_CONTACT:
      return 'TYPE_SYNC_INSTALLATION_CONTACT'
    case ApplicationMetadataMessage_Type.TYPE_SYNC_INSTALLATION_ACCOUNT:
      return 'TYPE_SYNC_INSTALLATION_ACCOUNT'
    case ApplicationMetadataMessage_Type.TYPE_SYNC_INSTALLATION_PUBLIC_CHAT:
      return 'TYPE_SYNC_INSTALLATION_PUBLIC_CHAT'
    case ApplicationMetadataMessage_Type.TYPE_CONTACT_CODE_ADVERTISEMENT:
      return 'TYPE_CONTACT_CODE_ADVERTISEMENT'
    case ApplicationMetadataMessage_Type.TYPE_PUSH_NOTIFICATION_REGISTRATION:
      return 'TYPE_PUSH_NOTIFICATION_REGISTRATION'
    case ApplicationMetadataMessage_Type.TYPE_PUSH_NOTIFICATION_REGISTRATION_RESPONSE:
      return 'TYPE_PUSH_NOTIFICATION_REGISTRATION_RESPONSE'
    case ApplicationMetadataMessage_Type.TYPE_PUSH_NOTIFICATION_QUERY:
      return 'TYPE_PUSH_NOTIFICATION_QUERY'
    case ApplicationMetadataMessage_Type.TYPE_PUSH_NOTIFICATION_QUERY_RESPONSE:
      return 'TYPE_PUSH_NOTIFICATION_QUERY_RESPONSE'
    case ApplicationMetadataMessage_Type.TYPE_PUSH_NOTIFICATION_REQUEST:
      return 'TYPE_PUSH_NOTIFICATION_REQUEST'
    case ApplicationMetadataMessage_Type.TYPE_PUSH_NOTIFICATION_RESPONSE:
      return 'TYPE_PUSH_NOTIFICATION_RESPONSE'
    case ApplicationMetadataMessage_Type.TYPE_EMOJI_REACTION:
      return 'TYPE_EMOJI_REACTION'
    case ApplicationMetadataMessage_Type.TYPE_GROUP_CHAT_INVITATION:
      return 'TYPE_GROUP_CHAT_INVITATION'
    case ApplicationMetadataMessage_Type.TYPE_CHAT_IDENTITY:
      return 'TYPE_CHAT_IDENTITY'
    case ApplicationMetadataMessage_Type.TYPE_COMMUNITY_DESCRIPTION:
      return 'TYPE_COMMUNITY_DESCRIPTION'
    case ApplicationMetadataMessage_Type.TYPE_COMMUNITY_INVITATION:
      return 'TYPE_COMMUNITY_INVITATION'
    case ApplicationMetadataMessage_Type.TYPE_COMMUNITY_REQUEST_TO_JOIN:
      return 'TYPE_COMMUNITY_REQUEST_TO_JOIN'
    case ApplicationMetadataMessage_Type.TYPE_PIN_MESSAGE:
      return 'TYPE_PIN_MESSAGE'
    case ApplicationMetadataMessage_Type.TYPE_EDIT_MESSAGE:
      return 'TYPE_EDIT_MESSAGE'
    case ApplicationMetadataMessage_Type.TYPE_STATUS_UPDATE:
      return 'TYPE_STATUS_UPDATE'
    case ApplicationMetadataMessage_Type.TYPE_DELETE_MESSAGE:
      return 'TYPE_DELETE_MESSAGE'
    case ApplicationMetadataMessage_Type.TYPE_SYNC_INSTALLATION_COMMUNITY:
      return 'TYPE_SYNC_INSTALLATION_COMMUNITY'
    case ApplicationMetadataMessage_Type.TYPE_ANONYMOUS_METRIC_BATCH:
      return 'TYPE_ANONYMOUS_METRIC_BATCH'
    default:
      return 'UNKNOWN'
  }
}

const baseApplicationMetadataMessage: object = { type: 0 }

export const ApplicationMetadataMessage = {
  encode(
    message: ApplicationMetadataMessage,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.signature.length !== 0) {
      writer.uint32(10).bytes(message.signature)
    }
    if (message.payload.length !== 0) {
      writer.uint32(18).bytes(message.payload)
    }
    if (message.type !== 0) {
      writer.uint32(24).int32(message.type)
    }
    return writer
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): ApplicationMetadataMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = {
      ...baseApplicationMetadataMessage,
    } as ApplicationMetadataMessage
    message.signature = new Uint8Array()
    message.payload = new Uint8Array()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.signature = reader.bytes()
          break
        case 2:
          message.payload = reader.bytes()
          break
        case 3:
          message.type = reader.int32() as any
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ApplicationMetadataMessage {
    const message = {
      ...baseApplicationMetadataMessage,
    } as ApplicationMetadataMessage
    message.signature = new Uint8Array()
    message.payload = new Uint8Array()
    if (object.signature !== undefined && object.signature !== null) {
      message.signature = bytesFromBase64(object.signature)
    }
    if (object.payload !== undefined && object.payload !== null) {
      message.payload = bytesFromBase64(object.payload)
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = applicationMetadataMessage_TypeFromJSON(object.type)
    } else {
      message.type = 0
    }
    return message
  },

  toJSON(message: ApplicationMetadataMessage): unknown {
    const obj: any = {}
    message.signature !== undefined &&
      (obj.signature = base64FromBytes(
        message.signature !== undefined ? message.signature : new Uint8Array()
      ))
    message.payload !== undefined &&
      (obj.payload = base64FromBytes(
        message.payload !== undefined ? message.payload : new Uint8Array()
      ))
    message.type !== undefined &&
      (obj.type = applicationMetadataMessage_TypeToJSON(message.type))
    return obj
  },

  fromPartial(
    object: DeepPartial<ApplicationMetadataMessage>
  ): ApplicationMetadataMessage {
    const message = {
      ...baseApplicationMetadataMessage,
    } as ApplicationMetadataMessage
    if (object.signature !== undefined && object.signature !== null) {
      message.signature = object.signature
    } else {
      message.signature = new Uint8Array()
    }
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

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any
  _m0.configure()
}
