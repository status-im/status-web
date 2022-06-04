/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-namespace */

import {
  encodeMessage,
  decodeMessage,
  message,
  bytes,
  uint32,
  int64,
  string,
} from 'protons-runtime'
import type { Codec } from 'protons-runtime'

export interface SignedPreKey {
  signedPreKey: Uint8Array
  version: number
  protocolVersion: number
}

export namespace SignedPreKey {
  export const codec = (): Codec<SignedPreKey> => {
    return message<SignedPreKey>({
      1: { name: 'signedPreKey', codec: bytes },
      2: { name: 'version', codec: uint32 },
      3: { name: 'protocolVersion', codec: uint32 },
    })
  }

  export const encode = (obj: SignedPreKey): Uint8Array => {
    return encodeMessage(obj, SignedPreKey.codec())
  }

  export const decode = (buf: Uint8Array): SignedPreKey => {
    return decodeMessage(buf, SignedPreKey.codec())
  }
}

export interface Bundle {
  identity: Uint8Array
  signedPreKeys: SignedPreKey
  signature: Uint8Array
  timestamp: bigint
}

export namespace Bundle {
  export const codec = (): Codec<Bundle> => {
    return message<Bundle>({
      1: { name: 'identity', codec: bytes },
      2: { name: 'signedPreKeys', codec: SignedPreKey.codec() },
      4: { name: 'signature', codec: bytes },
      5: { name: 'timestamp', codec: int64 },
    })
  }

  export const encode = (obj: Bundle): Uint8Array => {
    return encodeMessage(obj, Bundle.codec())
  }

  export const decode = (buf: Uint8Array): Bundle => {
    return decodeMessage(buf, Bundle.codec())
  }
}

export interface BundleContainer {
  bundle: Bundle
  privateSignedPreKey: Uint8Array
}

export namespace BundleContainer {
  export const codec = (): Codec<BundleContainer> => {
    return message<BundleContainer>({
      1: { name: 'bundle', codec: Bundle.codec() },
      2: { name: 'privateSignedPreKey', codec: bytes },
    })
  }

  export const encode = (obj: BundleContainer): Uint8Array => {
    return encodeMessage(obj, BundleContainer.codec())
  }

  export const decode = (buf: Uint8Array): BundleContainer => {
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
  export const codec = (): Codec<DRHeader> => {
    return message<DRHeader>({
      1: { name: 'key', codec: bytes },
      2: { name: 'n', codec: uint32 },
      3: { name: 'pn', codec: uint32 },
      4: { name: 'id', codec: bytes },
    })
  }

  export const encode = (obj: DRHeader): Uint8Array => {
    return encodeMessage(obj, DRHeader.codec())
  }

  export const decode = (buf: Uint8Array): DRHeader => {
    return decodeMessage(buf, DRHeader.codec())
  }
}

export interface DHHeader {
  key: Uint8Array
}

export namespace DHHeader {
  export const codec = (): Codec<DHHeader> => {
    return message<DHHeader>({
      1: { name: 'key', codec: bytes },
    })
  }

  export const encode = (obj: DHHeader): Uint8Array => {
    return encodeMessage(obj, DHHeader.codec())
  }

  export const decode = (buf: Uint8Array): DHHeader => {
    return decodeMessage(buf, DHHeader.codec())
  }
}

export interface X3DHHeader {
  key: Uint8Array
  id: Uint8Array
}

export namespace X3DHHeader {
  export const codec = (): Codec<X3DHHeader> => {
    return message<X3DHHeader>({
      1: { name: 'key', codec: bytes },
      4: { name: 'id', codec: bytes },
    })
  }

  export const encode = (obj: X3DHHeader): Uint8Array => {
    return encodeMessage(obj, X3DHHeader.codec())
  }

  export const decode = (buf: Uint8Array): X3DHHeader => {
    return decodeMessage(buf, X3DHHeader.codec())
  }
}

export interface HRHeader {
  keyId: number
  seqNo: number
  groupId: string
}

export namespace HRHeader {
  export const codec = (): Codec<HRHeader> => {
    return message<HRHeader>({
      1: { name: 'keyId', codec: uint32 },
      2: { name: 'seqNo', codec: uint32 },
      3: { name: 'groupId', codec: string },
    })
  }

  export const encode = (obj: HRHeader): Uint8Array => {
    return encodeMessage(obj, HRHeader.codec())
  }

  export const decode = (buf: Uint8Array): HRHeader => {
    return decodeMessage(buf, HRHeader.codec())
  }
}

export interface EncryptedMessageProtocol {
  X3DHHeader: X3DHHeader
  DRHeader: DRHeader
  DHHeader: DHHeader
  HRHeader: HRHeader
  payload: Uint8Array
}

export namespace EncryptedMessageProtocol {
  export const codec = (): Codec<EncryptedMessageProtocol> => {
    return message<EncryptedMessageProtocol>({
      1: { name: 'X3DHHeader', codec: X3DHHeader.codec() },
      2: { name: 'DRHeader', codec: DRHeader.codec() },
      101: { name: 'DHHeader', codec: DHHeader.codec() },
      102: { name: 'HRHeader', codec: HRHeader.codec() },
      3: { name: 'payload', codec: bytes },
    })
  }

  export const encode = (obj: EncryptedMessageProtocol): Uint8Array => {
    return encodeMessage(obj, EncryptedMessageProtocol.codec())
  }

  export const decode = (buf: Uint8Array): EncryptedMessageProtocol => {
    return decodeMessage(buf, EncryptedMessageProtocol.codec())
  }
}

export interface ProtocolMessage {
  installationId: string
  bundles: Bundle[]
  encryptedMessage: EncryptedMessageProtocol
  publicMessage: Uint8Array
}

export namespace ProtocolMessage {
  export const codec = (): Codec<ProtocolMessage> => {
    return message<ProtocolMessage>({
      2: { name: 'installationId', codec: string },
      3: { name: 'bundles', codec: Bundle.codec(), repeats: true },
      101: {
        name: 'encryptedMessage',
        codec: EncryptedMessageProtocol.codec(),
      },
      102: { name: 'publicMessage', codec: bytes },
    })
  }

  export const encode = (obj: ProtocolMessage): Uint8Array => {
    return encodeMessage(obj, ProtocolMessage.codec())
  }

  export const decode = (buf: Uint8Array): ProtocolMessage => {
    return decodeMessage(buf, ProtocolMessage.codec())
  }
}
