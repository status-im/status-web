import { create, fromBinary, toBinary, toJson } from '@bufbuild/protobuf'
import { base64url } from '@scure/base'
import { brotliCompressSync, brotliDecompressSync } from 'zlib'
import { z } from 'zod'

import {
  ChannelSchema,
  CommunitySchema,
  URLDataSchema,
  UserSchema,
} from '../protos/url_pb'

import type { Channel, Community, URLData, User } from '../protos/url_pb'

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

export function encodeCommunityURLData(data: Community): EncodedURLData {
  return encodeURLData(
    toBinary(CommunitySchema, create(CommunitySchema, data)),
  ) as EncodedURLData
}

export function decodeCommunityURLData(data: string) {
  const deserialized = decodeURLData(data)

  const community = toJson(
    CommunitySchema,
    fromBinary(CommunitySchema, deserialized.content),
  )

  return communitySchema.parse(community)
}

const channelSchema = z.object({
  displayName: z.string().max(24).nonempty(),
  description: z.string().max(140).nonempty(),
  emoji: z.string().trim().emoji().optional(),
  color: colorSchema,
  community: z.object({
    displayName: communityDisplayName,
  }),
  uuid: z.string().uuid(),
})

export function encodeChannelURLData(data: Channel): EncodedURLData {
  return encodeURLData(
    toBinary(ChannelSchema, create(ChannelSchema, data)),
  ) as EncodedURLData
}

export function decodeChannelURLData(data: string) {
  const deserialized = decodeURLData(data)

  const channel = toJson(
    ChannelSchema,
    fromBinary(ChannelSchema, deserialized.content),
  )

  return channelSchema.parse(channel)
}

const userSchema = z.object({
  displayName: z.string().max(24).nonempty(),
  description: z.string().max(240).optional(),
  // fixme: await integration in native platforms
  color: colorSchema.optional().default('#ffffff'),
})

export function encodeUserURLData(data: User): EncodedURLData {
  return encodeURLData(
    toBinary(UserSchema, create(UserSchema, data)),
  ) as EncodedURLData
}

export function decodeUserURLData(data: string) {
  const deserialized = decodeURLData(data)

  const user = toJson(UserSchema, fromBinary(UserSchema, deserialized.content))

  return userSchema.parse(user)
}

function encodeURLData(data: Uint8Array): string {
  const serialized = toBinary(
    URLDataSchema,
    create(URLDataSchema, {
      content: new Uint8Array(data),
    }),
  )
  const compressed = brotliCompressSync(serialized)
  const encoded = base64url.encode(compressed as unknown as Uint8Array)

  return encoded
}

function decodeURLData(data: string): URLData {
  // note: https://github.com/status-im/status-web/pull/345#discussion_r1113129396 observed lengths
  // note?: https://docs.google.com/spreadsheets/d/1JD4kp0aUm90piUZ7FgM_c2NGe2PdN8BFB11wmt5UZIY/view#gid=1260088614 limit for url path segmets not split by ";" or "_"
  // fixme: set to 301 per url path segment when the above mentioned splitting is implemented
  z.string().max(500).parse(data) // default max in order not to compute arbitrary values

  const decoded = base64url.decode(data)
  const decompressed = brotliDecompressSync(decoded)
  const deserialized = fromBinary(
    URLDataSchema,
    decompressed as unknown as Uint8Array,
  )

  return deserialized
}
