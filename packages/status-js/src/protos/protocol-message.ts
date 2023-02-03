/* eslint-disable import/export */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { encodeMessage, decodeMessage, message } from 'protons-runtime'
import type { Codec } from 'protons-runtime'
import type { Uint8ArrayList } from 'uint8arraylist'

export interface SignedPreKey {
  signedPreKey: Uint8Array
  version: number
  protocolVersion: number
}

export namespace SignedPreKey {
  let _codec: Codec<SignedPreKey>

  export const codec = (): Codec<SignedPreKey> => {
    if (_codec == null) {
      _codec = message<SignedPreKey>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.signedPreKey != null && obj.signedPreKey.byteLength > 0)) {
          w.uint32(10)
          w.bytes(obj.signedPreKey ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.version != null && obj.version !== 0)) {
          w.uint32(16)
          w.uint32(obj.version ?? 0)
        }

        if (opts.writeDefaults === true || (obj.protocolVersion != null && obj.protocolVersion !== 0)) {
          w.uint32(24)
          w.uint32(obj.protocolVersion ?? 0)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          signedPreKey: new Uint8Array(0),
          version: 0,
          protocolVersion: 0
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.signedPreKey = reader.bytes()
              break
            case 2:
              obj.version = reader.uint32()
              break
            case 3:
              obj.protocolVersion = reader.uint32()
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

  export const encode = (obj: Partial<SignedPreKey>): Uint8Array => {
    return encodeMessage(obj, SignedPreKey.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): SignedPreKey => {
    return decodeMessage(buf, SignedPreKey.codec())
  }
}

export interface Bundle {
  identity: Uint8Array
  signedPreKeys: Map<string, SignedPreKey>
  signature: Uint8Array
  timestamp: bigint
}

export namespace Bundle {
  export interface Bundle$signedPreKeysEntry {
    key: string
    value: SignedPreKey
  }

  export namespace Bundle$signedPreKeysEntry {
    let _codec: Codec<Bundle$signedPreKeysEntry>

    export const codec = (): Codec<Bundle$signedPreKeysEntry> => {
      if (_codec == null) {
        _codec = message<Bundle$signedPreKeysEntry>((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork()
          }

          if (opts.writeDefaults === true || (obj.key != null && obj.key !== '')) {
            w.uint32(10)
            w.string(obj.key ?? '')
          }

          if (obj.value != null) {
            w.uint32(18)
            SignedPreKey.codec().encode(obj.value, w, {
              writeDefaults: false
            })
          }

          if (opts.lengthDelimited !== false) {
            w.ldelim()
          }
        }, (reader, length) => {
          const obj: any = {
            key: '',
            value: undefined
          }

          const end = length == null ? reader.len : reader.pos + length

          while (reader.pos < end) {
            const tag = reader.uint32()

            switch (tag >>> 3) {
              case 1:
                obj.key = reader.string()
                break
              case 2:
                obj.value = SignedPreKey.codec().decode(reader, reader.uint32())
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

    export const encode = (obj: Partial<Bundle$signedPreKeysEntry>): Uint8Array => {
      return encodeMessage(obj, Bundle$signedPreKeysEntry.codec())
    }

    export const decode = (buf: Uint8Array | Uint8ArrayList): Bundle$signedPreKeysEntry => {
      return decodeMessage(buf, Bundle$signedPreKeysEntry.codec())
    }
  }

  let _codec: Codec<Bundle>

  export const codec = (): Codec<Bundle> => {
    if (_codec == null) {
      _codec = message<Bundle>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.identity != null && obj.identity.byteLength > 0)) {
          w.uint32(10)
          w.bytes(obj.identity ?? new Uint8Array(0))
        }

        if (obj.signedPreKeys != null && obj.signedPreKeys.size !== 0) {
          for (const [key, value] of obj.signedPreKeys.entries()) {
            w.uint32(18)
            Bundle.Bundle$signedPreKeysEntry.codec().encode({ key, value }, w, {
              writeDefaults: true
            })
          }
        }

        if (opts.writeDefaults === true || (obj.signature != null && obj.signature.byteLength > 0)) {
          w.uint32(34)
          w.bytes(obj.signature ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.timestamp != null && obj.timestamp !== 0n)) {
          w.uint32(40)
          w.int64(obj.timestamp ?? 0n)
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          identity: new Uint8Array(0),
          signedPreKeys: new Map<string, undefined>(),
          signature: new Uint8Array(0),
          timestamp: 0n
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.identity = reader.bytes()
              break
            case 2: {
              const entry = Bundle.Bundle$signedPreKeysEntry.codec().decode(reader, reader.uint32())
              obj.signedPreKeys.set(entry.key, entry.value)
              break
            }
            case 4:
              obj.signature = reader.bytes()
              break
            case 5:
              obj.timestamp = reader.int64()
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

  export const encode = (obj: Partial<Bundle>): Uint8Array => {
    return encodeMessage(obj, Bundle.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): Bundle => {
    return decodeMessage(buf, Bundle.codec())
  }
}

export interface BundleContainer {
  bundle?: Bundle
  privateSignedPreKey: Uint8Array
}

export namespace BundleContainer {
  let _codec: Codec<BundleContainer>

  export const codec = (): Codec<BundleContainer> => {
    if (_codec == null) {
      _codec = message<BundleContainer>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (obj.bundle != null) {
          w.uint32(10)
          Bundle.codec().encode(obj.bundle, w, {
            writeDefaults: false
          })
        }

        if (opts.writeDefaults === true || (obj.privateSignedPreKey != null && obj.privateSignedPreKey.byteLength > 0)) {
          w.uint32(18)
          w.bytes(obj.privateSignedPreKey ?? new Uint8Array(0))
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          privateSignedPreKey: new Uint8Array(0)
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.bundle = Bundle.codec().decode(reader, reader.uint32())
              break
            case 2:
              obj.privateSignedPreKey = reader.bytes()
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

  export const encode = (obj: Partial<BundleContainer>): Uint8Array => {
    return encodeMessage(obj, BundleContainer.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): BundleContainer => {
    return decodeMessage(buf, BundleContainer.codec())
  }
}

export interface DRHeader {
  key: Uint8Array
  n: number
  pn: number
  id: Uint8Array
}

export namespace DRHeader {
  let _codec: Codec<DRHeader>

  export const codec = (): Codec<DRHeader> => {
    if (_codec == null) {
      _codec = message<DRHeader>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.key != null && obj.key.byteLength > 0)) {
          w.uint32(10)
          w.bytes(obj.key ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.n != null && obj.n !== 0)) {
          w.uint32(16)
          w.uint32(obj.n ?? 0)
        }

        if (opts.writeDefaults === true || (obj.pn != null && obj.pn !== 0)) {
          w.uint32(24)
          w.uint32(obj.pn ?? 0)
        }

        if (opts.writeDefaults === true || (obj.id != null && obj.id.byteLength > 0)) {
          w.uint32(34)
          w.bytes(obj.id ?? new Uint8Array(0))
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          key: new Uint8Array(0),
          n: 0,
          pn: 0,
          id: new Uint8Array(0)
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.key = reader.bytes()
              break
            case 2:
              obj.n = reader.uint32()
              break
            case 3:
              obj.pn = reader.uint32()
              break
            case 4:
              obj.id = reader.bytes()
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

  export const encode = (obj: Partial<DRHeader>): Uint8Array => {
    return encodeMessage(obj, DRHeader.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): DRHeader => {
    return decodeMessage(buf, DRHeader.codec())
  }
}

export interface DHHeader {
  key: Uint8Array
}

export namespace DHHeader {
  let _codec: Codec<DHHeader>

  export const codec = (): Codec<DHHeader> => {
    if (_codec == null) {
      _codec = message<DHHeader>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.key != null && obj.key.byteLength > 0)) {
          w.uint32(10)
          w.bytes(obj.key ?? new Uint8Array(0))
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          key: new Uint8Array(0)
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.key = reader.bytes()
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

  export const encode = (obj: Partial<DHHeader>): Uint8Array => {
    return encodeMessage(obj, DHHeader.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): DHHeader => {
    return decodeMessage(buf, DHHeader.codec())
  }
}

export interface X3DHHeader {
  key: Uint8Array
  id: Uint8Array
}

export namespace X3DHHeader {
  let _codec: Codec<X3DHHeader>

  export const codec = (): Codec<X3DHHeader> => {
    if (_codec == null) {
      _codec = message<X3DHHeader>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.key != null && obj.key.byteLength > 0)) {
          w.uint32(10)
          w.bytes(obj.key ?? new Uint8Array(0))
        }

        if (opts.writeDefaults === true || (obj.id != null && obj.id.byteLength > 0)) {
          w.uint32(34)
          w.bytes(obj.id ?? new Uint8Array(0))
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          key: new Uint8Array(0),
          id: new Uint8Array(0)
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.key = reader.bytes()
              break
            case 4:
              obj.id = reader.bytes()
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

  export const encode = (obj: Partial<X3DHHeader>): Uint8Array => {
    return encodeMessage(obj, X3DHHeader.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): X3DHHeader => {
    return decodeMessage(buf, X3DHHeader.codec())
  }
}

export interface HRHeader {
  keyId: number
  seqNo: number
  groupId: string
}

export namespace HRHeader {
  let _codec: Codec<HRHeader>

  export const codec = (): Codec<HRHeader> => {
    if (_codec == null) {
      _codec = message<HRHeader>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.keyId != null && obj.keyId !== 0)) {
          w.uint32(8)
          w.uint32(obj.keyId ?? 0)
        }

        if (opts.writeDefaults === true || (obj.seqNo != null && obj.seqNo !== 0)) {
          w.uint32(16)
          w.uint32(obj.seqNo ?? 0)
        }

        if (opts.writeDefaults === true || (obj.groupId != null && obj.groupId !== '')) {
          w.uint32(26)
          w.string(obj.groupId ?? '')
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          keyId: 0,
          seqNo: 0,
          groupId: ''
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.keyId = reader.uint32()
              break
            case 2:
              obj.seqNo = reader.uint32()
              break
            case 3:
              obj.groupId = reader.string()
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

  export const encode = (obj: Partial<HRHeader>): Uint8Array => {
    return encodeMessage(obj, HRHeader.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): HRHeader => {
    return decodeMessage(buf, HRHeader.codec())
  }
}

export interface EncryptedMessageProtocol {
  X3DHHeader?: X3DHHeader
  DRHeader?: DRHeader
  DHHeader?: DHHeader
  HRHeader?: HRHeader
  payload: Uint8Array
}

export namespace EncryptedMessageProtocol {
  let _codec: Codec<EncryptedMessageProtocol>

  export const codec = (): Codec<EncryptedMessageProtocol> => {
    if (_codec == null) {
      _codec = message<EncryptedMessageProtocol>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (obj.X3DHHeader != null) {
          w.uint32(10)
          X3DHHeader.codec().encode(obj.X3DHHeader, w, {
            writeDefaults: false
          })
        }

        if (obj.DRHeader != null) {
          w.uint32(18)
          DRHeader.codec().encode(obj.DRHeader, w, {
            writeDefaults: false
          })
        }

        if (obj.DHHeader != null) {
          w.uint32(810)
          DHHeader.codec().encode(obj.DHHeader, w, {
            writeDefaults: false
          })
        }

        if (obj.HRHeader != null) {
          w.uint32(818)
          HRHeader.codec().encode(obj.HRHeader, w, {
            writeDefaults: false
          })
        }

        if (opts.writeDefaults === true || (obj.payload != null && obj.payload.byteLength > 0)) {
          w.uint32(26)
          w.bytes(obj.payload ?? new Uint8Array(0))
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          payload: new Uint8Array(0)
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 1:
              obj.X3DHHeader = X3DHHeader.codec().decode(reader, reader.uint32())
              break
            case 2:
              obj.DRHeader = DRHeader.codec().decode(reader, reader.uint32())
              break
            case 101:
              obj.DHHeader = DHHeader.codec().decode(reader, reader.uint32())
              break
            case 102:
              obj.HRHeader = HRHeader.codec().decode(reader, reader.uint32())
              break
            case 3:
              obj.payload = reader.bytes()
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

  export const encode = (obj: Partial<EncryptedMessageProtocol>): Uint8Array => {
    return encodeMessage(obj, EncryptedMessageProtocol.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): EncryptedMessageProtocol => {
    return decodeMessage(buf, EncryptedMessageProtocol.codec())
  }
}

export interface ProtocolMessage {
  installationId: string
  bundles: Bundle[]
  encryptedMessage: Map<string, EncryptedMessageProtocol>
  publicMessage: Uint8Array
}

export namespace ProtocolMessage {
  export interface ProtocolMessage$encryptedMessageEntry {
    key: string
    value: EncryptedMessageProtocol
  }

  export namespace ProtocolMessage$encryptedMessageEntry {
    let _codec: Codec<ProtocolMessage$encryptedMessageEntry>

    export const codec = (): Codec<ProtocolMessage$encryptedMessageEntry> => {
      if (_codec == null) {
        _codec = message<ProtocolMessage$encryptedMessageEntry>((obj, w, opts = {}) => {
          if (opts.lengthDelimited !== false) {
            w.fork()
          }

          if (opts.writeDefaults === true || (obj.key != null && obj.key !== '')) {
            w.uint32(10)
            w.string(obj.key ?? '')
          }

          if (obj.value != null) {
            w.uint32(18)
            EncryptedMessageProtocol.codec().encode(obj.value, w, {
              writeDefaults: false
            })
          }

          if (opts.lengthDelimited !== false) {
            w.ldelim()
          }
        }, (reader, length) => {
          const obj: any = {
            key: '',
            value: undefined
          }

          const end = length == null ? reader.len : reader.pos + length

          while (reader.pos < end) {
            const tag = reader.uint32()

            switch (tag >>> 3) {
              case 1:
                obj.key = reader.string()
                break
              case 2:
                obj.value = EncryptedMessageProtocol.codec().decode(reader, reader.uint32())
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

    export const encode = (obj: Partial<ProtocolMessage$encryptedMessageEntry>): Uint8Array => {
      return encodeMessage(obj, ProtocolMessage$encryptedMessageEntry.codec())
    }

    export const decode = (buf: Uint8Array | Uint8ArrayList): ProtocolMessage$encryptedMessageEntry => {
      return decodeMessage(buf, ProtocolMessage$encryptedMessageEntry.codec())
    }
  }

  let _codec: Codec<ProtocolMessage>

  export const codec = (): Codec<ProtocolMessage> => {
    if (_codec == null) {
      _codec = message<ProtocolMessage>((obj, w, opts = {}) => {
        if (opts.lengthDelimited !== false) {
          w.fork()
        }

        if (opts.writeDefaults === true || (obj.installationId != null && obj.installationId !== '')) {
          w.uint32(18)
          w.string(obj.installationId ?? '')
        }

        if (obj.bundles != null) {
          for (const value of obj.bundles) {
            w.uint32(26)
            Bundle.codec().encode(value, w, {
              writeDefaults: true
            })
          }
        }

        if (obj.encryptedMessage != null && obj.encryptedMessage.size !== 0) {
          for (const [key, value] of obj.encryptedMessage.entries()) {
            w.uint32(810)
            ProtocolMessage.ProtocolMessage$encryptedMessageEntry.codec().encode({ key, value }, w, {
              writeDefaults: true
            })
          }
        }

        if (opts.writeDefaults === true || (obj.publicMessage != null && obj.publicMessage.byteLength > 0)) {
          w.uint32(818)
          w.bytes(obj.publicMessage ?? new Uint8Array(0))
        }

        if (opts.lengthDelimited !== false) {
          w.ldelim()
        }
      }, (reader, length) => {
        const obj: any = {
          installationId: '',
          bundles: [],
          encryptedMessage: new Map<string, undefined>(),
          publicMessage: new Uint8Array(0)
        }

        const end = length == null ? reader.len : reader.pos + length

        while (reader.pos < end) {
          const tag = reader.uint32()

          switch (tag >>> 3) {
            case 2:
              obj.installationId = reader.string()
              break
            case 3:
              obj.bundles.push(Bundle.codec().decode(reader, reader.uint32()))
              break
            case 101: {
              const entry = ProtocolMessage.ProtocolMessage$encryptedMessageEntry.codec().decode(reader, reader.uint32())
              obj.encryptedMessage.set(entry.key, entry.value)
              break
            }
            case 102:
              obj.publicMessage = reader.bytes()
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

  export const encode = (obj: Partial<ProtocolMessage>): Uint8Array => {
    return encodeMessage(obj, ProtocolMessage.codec())
  }

  export const decode = (buf: Uint8Array | Uint8ArrayList): ProtocolMessage => {
    return decodeMessage(buf, ProtocolMessage.codec())
  }
}
