/* eslint-disable import/export */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { enumeration, encodeMessage, decodeMessage, message } from 'protons-runtime'
import type { Codec } from 'protons-runtime'
import type { Uint8ArrayList } from 'uint8arraylist'

export interface StatusUpdate {
  clock: bigint
  statusType: StatusUpdate.StatusType
  customText: string
}

export namespace StatusUpdate {
  export enum StatusType {
    UNKNOWN_STATUS_TYPE = 'UNKNOWN_STATUS_TYPE',
    AUTOMATIC = 'AUTOMATIC',
    DO_NOT_DISTURB = 'DO_NOT_DISTURB',
    ALWAYS_ONLINE = 'ALWAYS_ONLINE',
    INACTIVE = 'INACTIVE'
  }

  enum __StatusTypeValues {
    UNKNOWN_STATUS_TYPE = 0,
    AUTOMATIC = 1,
    DO_NOT_DISTURB = 2,
    ALWAYS_ONLINE = 3,
    INACTIVE = 4
  }

  export namespace StatusType {
    export const codec = (): Codec<StatusType> => {
      return enumeration<StatusType>(__StatusTypeValues)
    }
  }

  let _codec: Codec<StatusUpdate>

  export const codec = (): Codec<StatusUpdate> => {
    if (_codec == null) {
      _codec = message<StatusUpdate>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.clock != null && obj.clock !== 0n)) {
          w.uint32(8)
          w.uint64(obj.clock ?? 0n)
        }

        if (opts.writeDefaults === true || (obj.statusType != null && __StatusTypeValues[obj.statusType] !== 0)) {
          w.uint32(16)
          StatusUpdate.StatusType.codec().encode(obj.statusType ?? StatusUpdate.StatusType.UNKNOWN_STATUS_TYPE, w)
        }

        if (opts.writeDefaults === true || (obj.customText != null && obj.customText !== '')) {
          w.uint32(26)
          w.string(obj.customText ?? '')
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          clock: 0n,
          statusType: StatusType.UNKNOWN_STATUS_TYPE,
          customText: ''
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.clock = reader.uint64()
              break
            case 2:
              obj.statusType = StatusUpdate.StatusType.codec().decode(reader)
              break
            case 3:
              obj.customText = reader.string()
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

  export const encode = (obj: Partial<StatusUpdate>): Uint8Array => {
    return encodeMessage(obj, StatusUpdate.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): StatusUpdate => {
    return decodeMessage(buf, StatusUpdate.codec())
  }
}
