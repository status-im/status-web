import { base64url } from '@scure/base'
import { brotliCompressSync, brotliDecompressSync } from 'zlib'

import { Channel, Community, URLData, User } from '../protos/url-data_pb'

import type { PlainMessage } from '@bufbuild/protobuf'

export type EncodedURLData = string & { _: 'EncodedURLData' }

// todo?: uppercase URL
export function encodeCommunityURLData(
  data: PlainMessage<Community>
): EncodedURLData {
  return encodeURLData(new Community(data).toBinary()) as EncodedURLData
}

// note: PlainMessage<T> type does not ensure returning of only own properties
export function decodeCommunityURLData(data: string): PlainMessage<Community> {
  const deserialized = decodeURLData(data)

  return Community.fromBinary(
    deserialized.content
  ).toJson() as PlainMessage<Community>
}

export function encodeChannelURLData(
  data: PlainMessage<Channel>
): EncodedURLData {
  return encodeURLData(new Channel(data).toBinary()) as EncodedURLData
}

export function decodeChannelURLData(data: string): PlainMessage<Channel> {
  const deserialized = decodeURLData(data)

  return Channel.fromBinary(
    deserialized.content
  ).toJson() as PlainMessage<Channel>
}

export function encodeUserURLData(data: PlainMessage<User>): EncodedURLData {
  return encodeURLData(new User(data).toBinary()) as EncodedURLData
}

export function decodeUserURLData(data: string): PlainMessage<User> {
  const deserialized = decodeURLData(data)

  return User.fromBinary(deserialized.content).toJson() as PlainMessage<User>
}

function encodeURLData(data: Uint8Array): string {
  const serialized = new URLData({
    content: data,
  }).toBinary()
  const compressed = brotliCompressSync(serialized)
  // todo?!: remove padding
  // todo?!: split into 301 chars chunks with a semicolon separator
  const encoded = base64url.encode(compressed)

  return encoded
}

function decodeURLData(data: string): URLData {
  const decoded = base64url.decode(data)
  const decompressed = brotliDecompressSync(decoded)
  const deserialized = URLData.fromBinary(decompressed)

  return deserialized
}
