import { base64url } from '@scure/base'
import { brotliCompressSync, brotliDecompressSync } from 'node:zlib'

import { Channel, Community, URLData, User } from '../protos/url-data_pb'

import type { PlainMessage } from '@bufbuild/protobuf'

export type EncodedUrlData = string & { _: never }

// todo?: uppercase URL
export function encodeCommunityUrlData(
  data: PlainMessage<Community>
): EncodedUrlData {
  return encodeUrlData(new Community(data).toBinary()) as EncodedUrlData
}

// note: PlainMessage<T> type does not ensure returning of only own properties
export function decodeCommunityUrlData(data: string): PlainMessage<Community> {
  const deserialized = decodeUrlData(data)

  return Community.fromBinary(
    deserialized.content
  ).toJson() as PlainMessage<Community>
}

export function encodeChannelUrlData(
  data: PlainMessage<Channel>
): EncodedUrlData {
  return encodeUrlData(new Channel(data).toBinary()) as EncodedUrlData
}

export function decodeChannelUrlData(data: string): PlainMessage<Channel> {
  const deserialized = decodeUrlData(data)

  return Channel.fromBinary(
    deserialized.content
  ).toJson() as PlainMessage<Channel>
}

export function encodeUserUrlData(data: PlainMessage<User>): EncodedUrlData {
  return encodeUrlData(new User(data).toBinary()) as EncodedUrlData
}

export function decodeUserUrlData(data: string): PlainMessage<User> {
  const deserialized = decodeUrlData(data)

  return User.fromBinary(deserialized.content).toJson() as PlainMessage<User>
}

function encodeUrlData(data: Uint8Array): string {
  const serialized = new URLData({
    content: data,
  }).toBinary()
  const compressed = brotliCompressSync(serialized)
  // todo?!: remove padding
  // todo?!: split into 301 chars chunks with a semicolon separator
  const encoded = base64url.encode(compressed)

  return encoded
}

function decodeUrlData(data: string): URLData {
  const decoded = base64url.decode(data)
  const decompressed = brotliDecompressSync(decoded)
  const deserialized = URLData.fromBinary(decompressed)

  return deserialized
}
