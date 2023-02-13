// https://docs.buf.build/generate/usage#limit-to-specific-files
// buf generate --path src/protos/file.proto

// todo?: use canonical json
// todo?: use .fromBinary(bytes, { readUnknownFields: false })

import { base58, base64, base64url, utf8 } from '@scure/base'
import { brotliCompressSync, gzipSync } from 'node:zlib'

import {
  CommunityChatPreview,
  CommunityPreview,
  UserPreview,
} from '../protos/link-preview_pb'

import type { PlainMessage } from '@bufbuild/protobuf'

export function encodeUrlData(
  type: 'community' | 'chat' | 'user',
  data: PlainMessage<CommunityPreview | CommunityChatPreview | UserPreview>,
  options: {
    serialization: 'csv' | 'protobuf'
    compression: 'gzip' | 'brotli' | 'noop'
    encoding: 'encodeURIComponent' | 'base58' | 'base64' | 'base64url'
  } = {
    serialization: 'protobuf',
    compression: 'brotli',
    encoding: 'base64url',
  }
): string {
  let serialized: Uint8Array
  switch (options.serialization) {
    case 'csv':
      serialized = utf8.decode(Object.values(data).join(','))

      break

    case 'protobuf':
      switch (type) {
        case 'community':
          serialized = new CommunityPreview(data).toBinary()

          break

        case 'chat':
          serialized = new CommunityChatPreview(data).toBinary()

          break
        case 'user':
          serialized = new UserPreview(data).toBinary()

          break
      }

      break
  }

  let compressed: Uint8Array
  switch (options.compression) {
    case 'gzip':
      compressed = gzipSync(serialized)

      break

    case 'brotli':
      compressed = brotliCompressSync(serialized)

      break

    case 'noop':
      compressed = serialized

      break
  }

  let encoded: string
  switch (options.encoding) {
    case 'encodeURIComponent':
      if (options.serialization !== 'csv') {
        throw 'Invalid options'
      }

      encoded = encodeURIComponent(utf8.encode(compressed))

      break

    case 'base58':
      encoded = base58.encode(compressed)

      break

    case 'base64':
      encoded = base64.encode(compressed)

      break

    case 'base64url':
      encoded = base64url.encode(compressed)

      break
  }

  return encoded
}
