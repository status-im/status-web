import { base64url } from '@scure/base'
import { sha256 } from 'ethereum-cryptography/sha256'
import {
  concatBytes,
  utf8ToBytes as toBytes,
} from 'ethereum-cryptography/utils'
import { brotliCompressSync } from 'node:zlib'

import { Channel, Community, URLData, User } from '../protos/url-data_pb'

import type { PlainMessage } from '@bufbuild/protobuf'

export function encodeUrlData(
  type: 'community' | 'channel' | 'user',
  data: PlainMessage<Community | Channel | User>,
  publicKey: string
): string {
  let serialized: Uint8Array
  switch (type) {
    case 'community': {
      const community = new Community(data).toBinary()
      const checksum = sha256(
        sha256(concatBytes(community, toBytes(publicKey)))
      ).slice(0, 4)

      serialized = new URLData({
        checksum,
        content: community,
      }).toBinary()

      break
    }

    case 'channel': {
      const channel = new Channel(data).toBinary()
      const checksum = sha256(
        sha256(concatBytes(channel, toBytes(publicKey)))
      ).slice(0, 4)

      serialized = new URLData({
        checksum,
        content: channel,
      }).toBinary()

      break
    }

    case 'user': {
      const user = new User(data).toBinary()
      const checksum = sha256(
        sha256(concatBytes(user, toBytes(publicKey)))
      ).slice(0, 4)

      serialized = new URLData({
        checksum,
        content: user,
      }).toBinary()

      break
    }
  }

  const compressed = brotliCompressSync(serialized)
  // todo: remove padding
  const encoded = base64url.encode(compressed)

  return encoded
}
