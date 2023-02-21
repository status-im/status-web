import { base64url } from '@scure/base'
import { sha256 } from 'ethereum-cryptography/sha256'
import {
  concatBytes,
  utf8ToBytes as toBytes,
} from 'ethereum-cryptography/utils'
import { brotliCompressSync, brotliDecompressSync } from 'node:zlib'

import { Channel, Community, URLData, User } from '../protos/url-data_pb'

import type { PlainMessage } from '@bufbuild/protobuf'

export function encodeCommunityUrlData(
  data: PlainMessage<Community>,
  publicKey: string
): string {
  return encodeUrlData(new Community(data).toBinary(), publicKey)
}

export function decodeCommunityUrlData(
  data: string,
  publicKey: string
): PlainMessage<Community> {
  const deserialized = decodeUrlData(data, publicKey)
  const community = Community.fromBinary(deserialized.content)

  // note: PlainMessage<T> type does not ensure returning of only own properties
  return { ...community }
}

export function encodeChannelUrlData(
  data: PlainMessage<Channel>,
  publicKey: string
): string {
  return encodeUrlData(new Channel(data).toBinary(), publicKey)
}

export function decodeChannelUrlData(
  data: string,
  publicKey: string
): PlainMessage<Channel> {
  const deserialized = decodeUrlData(data, publicKey)
  const channel = Channel.fromBinary(deserialized.content)

  return { ...channel }
}

export function encodeUserUrlData(data: PlainMessage<User>, publicKey: string) {
  return encodeUrlData(new User(data).toBinary(), publicKey)
}

export function decodeUserUrlData(data: string, publicKey: string) {
  const deserialized = decodeUrlData(data, publicKey)
  const user = User.fromBinary(deserialized.content)

  return { ...user }
}

function encodeUrlData(data: Uint8Array, publicKey: string): string {
  const serialized = new URLData({
    content: data,
    checksum: getChecksum(data, publicKey),
  }).toBinary()
  const compressed = brotliCompressSync(serialized)
  // todo?!: remove padding
  // todo?!: split into 301 chars chunks with a semicolon separator
  const encoded = base64url.encode(compressed)

  return encoded
}

function decodeUrlData(data: string, publicKey: string): URLData {
  const decoded = base64url.decode(data)
  const decompressed = brotliDecompressSync(decoded)
  const deserialized = URLData.fromBinary(decompressed)

  if (!verifyChecksum(deserialized, publicKey)) {
    throw new Error('Invalid checksum')
  }

  return deserialized
}

function getChecksum(data: Uint8Array, publicKey: string): Uint8Array {
  return sha256(sha256(concatBytes(data, toBytes(publicKey)))).slice(0, 4)
}

function verifyChecksum(urlData: URLData, publicKey: string): boolean {
  const checksum = getChecksum(urlData.content, publicKey)

  for (let i = 0; i < checksum.length; i++) {
    if (checksum[i] !== urlData.checksum[i]) {
      return false
    }
  }

  return true
}
