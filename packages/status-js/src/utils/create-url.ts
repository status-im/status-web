const BASE_URL = 'https://status.app'

export function createCommunityURLWithPublicKey(publicKey: string): URL {
  return new URL(`${BASE_URL}/c#${publicKey}`)
}

export function createCommunityURLWithData(
  encodedCommunityURLData: string,
  encodedVerificationURLData: string
): URL {
  return new URL(
    `${BASE_URL}/c/${encodedCommunityURLData}#${encodedVerificationURLData}`
  )
}

export function createChannelURLWithPublicKey(
  channelUuid: string,
  communityPublicKey: string
): URL {
  return new URL(`${BASE_URL}/cc/${channelUuid}#${communityPublicKey}`)
}

export function createChannelURLWithData(
  encodedChannelURLData: string,
  encodedVerificationURLData: string
): URL {
  return new URL(
    `${BASE_URL}/cc/${encodedChannelURLData}#${encodedVerificationURLData}`
  )
}

export function createUserURLWithPublicKey(publicKey: string): URL {
  return new URL(`${BASE_URL}/u#${publicKey}`)
}

export function createUserURLWithData(
  encodedURLData: string,
  encodedVerificationURLData: string
): URL {
  return new URL(
    `${BASE_URL}/u/${encodedURLData}#${encodedVerificationURLData}`
  )
}
