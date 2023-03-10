import { base64url } from '@scure/base'

const BASE_URL = 'https://status.app'

export function createCommunityURL(
  ...args:
    | [publicKey: string]
    | [encodedCommunityURLData: string, signature: Uint8Array]
): URL {
  const signature = args[1]

  if (signature) {
    const encodedCommunityURLData = args[0]

    return new URL(
      `${BASE_URL}/c/${encodedCommunityURLData}#${base64url.encode(signature)}`
    )
  }

  const publicKey = args[0]

  return new URL(`${BASE_URL}/c#${publicKey}`)
}

export function createChannelURL(
  ...args:
    | [channelUuid: string, communityPublicKey: string]
    | [encodedChannelURLData: string, signature: Uint8Array]
): URL {
  const signature = args[1]

  if (signature instanceof Uint8Array) {
    const encodedChannelURLData = args[0]

    return new URL(
      `${BASE_URL}/cc/${encodedChannelURLData}#${base64url.encode(signature)}`
    )
  }

  const channelUuid = args[0]
  const communityPublicKey = args[1]

  return new URL(`${BASE_URL}/cc/${channelUuid}#${communityPublicKey}`)
}

export function createUserURL(
  ...args: [publicKey: string] | [encodedURLData: string, signature: Uint8Array]
): URL {
  const signature = args[1]

  if (signature) {
    const encodedURLData = args[0]

    return new URL(
      `${BASE_URL}/u/${encodedURLData}#${base64url.encode(signature)}`
    )
  }

  const publicKey = args[0]

  return new URL(`${BASE_URL}/u#${publicKey}`)
}
