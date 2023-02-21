import { base64url } from '@scure/base'
import { sha256 } from 'ethereum-cryptography/sha256'
import {
  concatBytes,
  utf8ToBytes as toBytes,
} from 'ethereum-cryptography/utils'
import { brotliCompressSync } from 'node:zlib'

import { Channel, Community, URLData, User } from '../protos/url-data_pb'

import type { PlainMessage } from '@bufbuild/protobuf'

export function encodeCommunityUrlData(
  data: PlainMessage<Community>,
  publicKey: string
): string {
  return encodeUrlData(new Community(data).toBinary(), publicKey)
}

export function encodeChannelUrlData(
  data: PlainMessage<Channel>,
  publicKey: string
): string {
  return encodeUrlData(new Channel(data).toBinary(), publicKey)
}

export function encodeUserUrlData(data: PlainMessage<User>, publicKey: string) {
  return encodeUrlData(new User(data).toBinary(), publicKey)
}

function encodeUrlData(data: Uint8Array, publicKey: string): string {
  const checksum = sha256(sha256(concatBytes(data, toBytes(publicKey)))).slice(
    0,
    4
  )

  const serialized = new URLData({
    content: data,
    checksum,
  }).toBinary()
  const compressed = brotliCompressSync(serialized)
  // todo?!: remove padding
  // todo?!: split into 301 chars chunks with a semicolon separator
  const encoded = base64url.encode(compressed)

  return encoded
}
