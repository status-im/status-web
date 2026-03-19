/* eslint-disable import/export */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable import/consistent-type-specifier-style */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { decodeMessage, encodeMessage, message } from 'protons-runtime'
import { alloc as uint8ArrayAlloc } from 'uint8arrays/alloc'
import type { Codec, DecodeOptions } from 'protons-runtime'
import type { Uint8ArrayList } from 'uint8arraylist'

export interface WakuVote {
  address: string
  vote: string
  sntAmount: Uint8Array
  sign: string
  timestamp: number
  roomID: bigint
}

export namespace WakuVote {
  let _codec: Codec<WakuVote>

  export const codec = (): Codec<WakuVote> => {
    if (_codec == null) {
      _codec = message<WakuVote>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if ((obj.address != null && obj.address !== '')) {
          w.uint32(10)
          w.string(obj.address)
        }

        if ((obj.vote != null && obj.vote !== '')) {
          w.uint32(18)
          w.string(obj.vote)
        }

        if ((obj.sntAmount != null && obj.sntAmount.byteLength > 0)) {
          w.uint32(26)
          w.bytes(obj.sntAmount)
        }

        if ((obj.sign != null && obj.sign !== '')) {
          w.uint32(34)
          w.string(obj.sign)
        }

        if ((obj.timestamp != null && obj.timestamp !== 0)) {
          w.uint32(40)
          w.uint32(obj.timestamp)
        }

        if ((obj.roomID != null && obj.roomID !== 0n)) {
          w.uint32(48)
          w.uint64(obj.roomID)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length, opts = {}) => {
        const obj: any = {
          address: '',
          vote: '',
          sntAmount: uint8ArrayAlloc(0),
          sign: '',
          timestamp: 0,
          roomID: 0n
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1: {
              obj.address = reader.string()
              break
            }
            case 2: {
              obj.vote = reader.string()
              break
            }
            case 3: {
              obj.sntAmount = reader.bytes()
              break
            }
            case 4: {
              obj.sign = reader.string()
              break
            }
            case 5: {
              obj.timestamp = reader.uint32()
              break
            }
            case 6: {
              obj.roomID = reader.uint64()
              break
            }
            default: {
              reader.skipType(tag & 7)
              break
            }
          }
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Partial<WakuVote>): Uint8Array => {
    return encodeMessage(obj, WakuVote.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<WakuVote>): WakuVote => {
    return decodeMessage(buf, WakuVote.codec(), opts)
  }
}

export interface WakuFeature {
  voter: string
  sntAmount: Uint8Array
  community: string
  timestamp: number
  sign: string
}

export namespace WakuFeature {
  let _codec: Codec<WakuFeature>

  export const codec = (): Codec<WakuFeature> => {
    if (_codec == null) {
      _codec = message<WakuFeature>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if ((obj.voter != null && obj.voter !== '')) {
          w.uint32(10)
          w.string(obj.voter)
        }

        if ((obj.sntAmount != null && obj.sntAmount.byteLength > 0)) {
          w.uint32(18)
          w.bytes(obj.sntAmount)
        }

        if ((obj.community != null && obj.community !== '')) {
          w.uint32(26)
          w.string(obj.community)
        }

        if ((obj.timestamp != null && obj.timestamp !== 0)) {
          w.uint32(32)
          w.uint32(obj.timestamp)
        }

        if ((obj.sign != null && obj.sign !== '')) {
          w.uint32(42)
          w.string(obj.sign)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length, opts = {}) => {
        const obj: any = {
          voter: '',
          sntAmount: uint8ArrayAlloc(0),
          community: '',
          timestamp: 0,
          sign: ''
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1: {
              obj.voter = reader.string()
              break
            }
            case 2: {
              obj.sntAmount = reader.bytes()
              break
            }
            case 3: {
              obj.community = reader.string()
              break
            }
            case 4: {
              obj.timestamp = reader.uint32()
              break
            }
            case 5: {
              obj.sign = reader.string()
              break
            }
            default: {
              reader.skipType(tag & 7)
              break
            }
          }
        }

        return obj
      })
    }

    return _codec
  }

  export const encode = (obj: Partial<WakuFeature>): Uint8Array => {
    return encodeMessage(obj, WakuFeature.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<WakuFeature>): WakuFeature => {
    return decodeMessage(buf, WakuFeature.codec(), opts)
  }
}
