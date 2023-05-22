import { base64url } from '@scure/base'

import { URLHash, Verification } from '../protos/url_pb'

import type { PlainMessage } from '@bufbuild/protobuf'

export type EncodedVerificationURLHash = string & {
  _: 'EncodedVerificationURLHash'
}

export function encodeVerificationURLHash(
  data: PlainMessage<Verification>
): EncodedVerificationURLHash {
  return encodeURLHash(
    new Verification(data).toBinary()
  ) as EncodedVerificationURLHash
}

export function decodeVerificationURLHash(
  data: string
): PlainMessage<Verification> {
  const deserialized = decodeURLHash(data)

  return Verification.fromBinary(
    deserialized.content
  ).toJson() as PlainMessage<Verification>
}

function encodeURLHash(data: Uint8Array): string {
  const serialized = new URLHash({ content: data }).toBinary()
  const encoded = base64url.encode(serialized)

  return encoded
}

function decodeURLHash(data: string): URLHash {
  const decoded = base64url.decode(data)
  const deserialized = URLHash.fromBinary(decoded)

  return deserialized
}
