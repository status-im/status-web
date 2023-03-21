import { base64url } from '@scure/base'

const BASE_URL = 'https://status.app'

export function createCommunityURLWithPublicKey(publicKey: string): URL {
  return new URL(`${BASE_URL}/c#${publicKey}`)
}

export function createCommunityURLWithSignature(
  encodedCommunityURLData: string,
  signature: Uint8Array
): URL {
  return new URL(
    `${BASE_URL}/c/${encodedCommunityURLData}#${base64url.encode(signature)}`
  )
}

export function createChannelURLWithPublicKey(
  channelUuid: string,
  communityPublicKey: string
): URL {
  return new URL(`${BASE_URL}/cc/${channelUuid}#${communityPublicKey}`)
}

export function createChannelURLWithSignature(
  encodedChannelURLData: string,
  signature: Uint8Array
): URL {
  return new URL(
    `${BASE_URL}/cc/${encodedChannelURLData}#${base64url.encode(signature)}`
  )
}

export function createUserURLWithPublicKey(publicKey: string): URL {
  return new URL(`${BASE_URL}/u#${publicKey}`)
}

export function createUserURLWithSignature(
  encodedURLData: string,
  signature: Uint8Array
): URL {
  return new URL(
    `${BASE_URL}/u/${encodedURLData}#${base64url.encode(signature)}`
  )
}
