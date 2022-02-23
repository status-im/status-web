/* eslint-disable */
import Long from 'long'
import _m0 from 'protobufjs/minimal'

export const protobufPackage = 'communities.v1'

/**
 * Specs:
 * :AUTOMATIC
 * To Send - "AUTOMATIC" status ping every 5 minutes
 * Display - Online for up to 5 minutes from the last clock, after that Offline
 * :ALWAYS_ONLINE
 * To Send - "ALWAYS_ONLINE" status ping every 5 minutes
 * Display - Online for up to 2 weeks from the last clock, after that Offline
 * :INACTIVE
 * To Send - A single "INACTIVE" status ping
 * Display - Offline forever
 * Note: Only send pings if the user interacted with the app in the last x minutes.
 */
export interface StatusUpdate {
  clock: number
  statusType: StatusUpdate_StatusType
  customText: string
}

export enum StatusUpdate_StatusType {
  UNKNOWN_STATUS_TYPE = 0,
  AUTOMATIC = 1,
  DO_NOT_DISTURB = 2,
  ALWAYS_ONLINE = 3,
  INACTIVE = 4,
  UNRECOGNIZED = -1,
}

export function statusUpdate_StatusTypeFromJSON(
  object: any
): StatusUpdate_StatusType {
  switch (object) {
    case 0:
    case 'UNKNOWN_STATUS_TYPE':
      return StatusUpdate_StatusType.UNKNOWN_STATUS_TYPE
    case 1:
    case 'AUTOMATIC':
      return StatusUpdate_StatusType.AUTOMATIC
    case 2:
    case 'DO_NOT_DISTURB':
      return StatusUpdate_StatusType.DO_NOT_DISTURB
    case 3:
    case 'ALWAYS_ONLINE':
      return StatusUpdate_StatusType.ALWAYS_ONLINE
    case 4:
    case 'INACTIVE':
      return StatusUpdate_StatusType.INACTIVE
    case -1:
    case 'UNRECOGNIZED':
    default:
      return StatusUpdate_StatusType.UNRECOGNIZED
  }
}

export function statusUpdate_StatusTypeToJSON(
  object: StatusUpdate_StatusType
): string {
  switch (object) {
    case StatusUpdate_StatusType.UNKNOWN_STATUS_TYPE:
      return 'UNKNOWN_STATUS_TYPE'
    case StatusUpdate_StatusType.AUTOMATIC:
      return 'AUTOMATIC'
    case StatusUpdate_StatusType.DO_NOT_DISTURB:
      return 'DO_NOT_DISTURB'
    case StatusUpdate_StatusType.ALWAYS_ONLINE:
      return 'ALWAYS_ONLINE'
    case StatusUpdate_StatusType.INACTIVE:
      return 'INACTIVE'
    default:
      return 'UNKNOWN'
  }
}

const baseStatusUpdate: object = { clock: 0, statusType: 0, customText: '' }

export const StatusUpdate = {
  encode(
    message: StatusUpdate,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.clock !== 0) {
      writer.uint32(8).uint64(message.clock)
    }
    if (message.statusType !== 0) {
      writer.uint32(16).int32(message.statusType)
    }
    if (message.customText !== '') {
      writer.uint32(26).string(message.customText)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StatusUpdate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseStatusUpdate } as StatusUpdate
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.clock = longToNumber(reader.uint64() as Long)
          break
        case 2:
          message.statusType = reader.int32() as any
          break
        case 3:
          message.customText = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): StatusUpdate {
    const message = { ...baseStatusUpdate } as StatusUpdate
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = Number(object.clock)
    } else {
      message.clock = 0
    }
    if (object.statusType !== undefined && object.statusType !== null) {
      message.statusType = statusUpdate_StatusTypeFromJSON(object.statusType)
    } else {
      message.statusType = 0
    }
    if (object.customText !== undefined && object.customText !== null) {
      message.customText = String(object.customText)
    } else {
      message.customText = ''
    }
    return message
  },

  toJSON(message: StatusUpdate): unknown {
    const obj: any = {}
    message.clock !== undefined && (obj.clock = message.clock)
    message.statusType !== undefined &&
      (obj.statusType = statusUpdate_StatusTypeToJSON(message.statusType))
    message.customText !== undefined && (obj.customText = message.customText)
    return obj
  },

  fromPartial(object: DeepPartial<StatusUpdate>): StatusUpdate {
    const message = { ...baseStatusUpdate } as StatusUpdate
    if (object.clock !== undefined && object.clock !== null) {
      message.clock = object.clock
    } else {
      message.clock = 0
    }
    if (object.statusType !== undefined && object.statusType !== null) {
      message.statusType = object.statusType
    } else {
      message.statusType = 0
    }
    if (object.customText !== undefined && object.customText !== null) {
      message.customText = object.customText
    } else {
      message.customText = ''
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
