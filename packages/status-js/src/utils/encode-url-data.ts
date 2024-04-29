import { base64url } from '@scure/base'
import { brotliCompressSync, brotliDecompressSync } from 'zlib'
import { z } from 'zod'

import { Channel, Community, URLData, User } from '../protos/url_pb'

import type { PlainMessage } from '@bufbuild/protobuf'

export type EncodedURLData = string & { _: 'EncodedURLData' }

const colorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/)
const communityDisplayName = z.string().max(30).nonempty()

const communitySchema = z.object({
  displayName: communityDisplayName,
  description: z.string().max(140).nonempty(),
  membersCount: z.number().nonnegative(),
  color: colorSchema,
  tagIndices: z.number().nonnegative().array().optional(),
})

export function encodeCommunityURLData(
  data: PlainMessage<Community>
): EncodedURLData {
  return encodeURLData(new Community(data).toBinary()) as EncodedURLData
}

export function decodeCommunityURLData(data: string) {
  const deserialized = decodeURLData(data)

  const community = Community.fromBinary(deserialized.content).toJson()

  return communitySchema.parse(community)
}

const channelSchema = z.object({
  displayName: z.string().max(24).nonempty(),
  description: z.string().max(140).nonempty(),
  emoji: z.string().emoji().optional(),
  color: colorSchema,
  community: z.object({
    displayName: communityDisplayName,
  }),
  uuid: z.string().uuid(),
})

export function encodeChannelURLData(
  data: PlainMessage<Channel>
): EncodedURLData {
  return encodeURLData(new Channel(data).toBinary()) as EncodedURLData
}

export function decodeChannelURLData(data: string) {
  const deserialized = decodeURLData(data)

  const channel = Channel.fromBinary(deserialized.content).toJson()

  return channelSchema.parse(channel)
}

const userSchema = z.object({
  displayName: z.string().max(24).nonempty(),
  description: z.string().max(240).optional(),
  // fixme: await integration in native platforms
  color: colorSchema.optional().default('#ffffff'),
})

export function encodeUserURLData(data: PlainMessage<User>): EncodedURLData {
  return encodeURLData(new User(data).toBinary()) as EncodedURLData
}

export function decodeUserURLData(data: string) {
  const deserialized = decodeURLData(data)

  const user = User.fromBinary(deserialized.content).toJson()

  return userSchema.parse(user)
}

function encodeURLData(data: Uint8Array): string {
  const serialized = new URLData({
    content: data,
  }).toBinary()
  const compressed = brotliCompressSync(serialized)
  const encoded = base64url.encode(compressed)

  return encoded
}

function decodeURLData(data: string): URLData {
  // note: https://github.com/status-im/status-web/pull/345#discussion_r1113129396 observed lengths
  // note?: https://docs.google.com/spreadsheets/d/1JD4kp0aUm90piUZ7FgM_c2NGe2PdN8BFB11wmt5UZIY/view#gid=1260088614 limit for url path segmets not split by ";" or "_"
  // fixme: set to 301 per url path segment when the above mentioned splitting is implemented
  z.string().max(500).parse(data) // default max in order not to compute arbitrary values

  const decoded = base64url.decode(data)
  const decompressed = brotliDecompressSync(decoded)
  const deserialized = URLData.fromBinary(decompressed)

  return deserialized
}
