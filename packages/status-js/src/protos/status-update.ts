/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-namespace */

import {
  enumeration,
  encodeMessage,
  decodeMessage,
  message,
  uint64,
  string,
} from 'protons-runtime'
import type { Codec } from 'protons-runtime'

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
    INACTIVE = 'INACTIVE',
  }

  enum __StatusTypeValues {
    UNKNOWN_STATUS_TYPE = 0,
    AUTOMATIC = 1,
    DO_NOT_DISTURB = 2,
    ALWAYS_ONLINE = 3,
    INACTIVE = 4,
  }

  export namespace StatusType {
    export const codec = () => {
      return enumeration<typeof StatusType>(__StatusTypeValues)
    }
  }

  export const codec = (): Codec<StatusUpdate> => {
    return message<StatusUpdate>({
      1: { name: 'clock', codec: uint64 },
      2: { name: 'statusType', codec: StatusUpdate.StatusType.codec() },
      3: { name: 'customText', codec: string },
    })
  }

  export const encode = (obj: StatusUpdate): Uint8Array => {
    return encodeMessage(obj, StatusUpdate.codec())
  }

  export const decode = (buf: Uint8Array): StatusUpdate => {
    return decodeMessage(buf, StatusUpdate.codec())
  }
}
