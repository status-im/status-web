import { base64url } from '@scure/base'

const BASE_URL = 'https://status.app'

export function createCommunityUrl(
  ...args:
    | [publicKey: string]
    | [encodedCommunityUrlData: string, signature: Uint8Array]
): URL {
  const signature = args[1]

  if (signature) {
    const encodedCommunityUrlData = args[0]

    return new URL(
      `${BASE_URL}/c/${encodedCommunityUrlData}#${base64url.encode(signature)}`
    )
  }

  const publicKey = args[0]

  return new URL(`${BASE_URL}/c#${publicKey}`)
}

export function createChannelUrl(
  ...args:
    | [channelUuid: string, communityPublicKey: string]
    | [encodedChannelUrlData: string, signature: Uint8Array]
): URL {
  const signature = args[1]

  if (signature instanceof Uint8Array) {
    const encodedChannelUrlData = args[0]

    return new URL(
      `${BASE_URL}/cc/${encodedChannelUrlData}#${base64url.encode(signature)}`
    )
  }

  const channelUuid = args[0]
  const communityPublicKey = args[1]

  return new URL(`${BASE_URL}/cc/${channelUuid}#${communityPublicKey}`)
}

export function createUserUrl(
  ...args: [publicKey: string] | [encodedUrlData: string, signature: Uint8Array]
): URL {
  const signature = args[1]

  if (signature) {
    const encodedUrlData = args[0]

    return new URL(
      `${BASE_URL}/u/${encodedUrlData}#${base64url.encode(signature)}`
    )
  }

  const publicKey = args[0]

  return new URL(`${BASE_URL}/u#${publicKey}`)
}
