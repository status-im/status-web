import {
  encodeChannelURLData,
  encodeCommunityURLData,
  encodeUserURLData,
} from './encode-url-data'
import { signEncodedURLData } from './sign-url-data'

import type { Channel, Community, User } from '../protos/url_pb'
import type { PlainMessage } from '@bufbuild/protobuf'

const BASE_URL = 'https://status.app'

export function createCommunityURLWithChatKey(chatKey: string): URL {
  return new URL(`${BASE_URL}/c#${chatKey}`)
}

export async function createCommunityURLWithData(
  communityData: PlainMessage<Community>,
  communityPrivateKey: Uint8Array | string
): Promise<URL> {
  const encodedURLData = encodeCommunityURLData(communityData)
  const encodedSignature = await signEncodedURLData(
    encodedURLData,
    communityPrivateKey
  )

  return new URL(`${BASE_URL}/c/${encodedURLData}#${encodedSignature}`)
}

export function createChannelURLWithChatKey(
  channelUuid: string,
  communityChatKey: string
): URL {
  return new URL(`${BASE_URL}/cc/${channelUuid}#${communityChatKey}`)
}

export async function createChannelURLWithData(
  channelData: PlainMessage<Channel>,
  communityPrivateKey: Uint8Array | string
): Promise<URL> {
  const encodedURLData = encodeChannelURLData(channelData)
  const encodedSignature = await signEncodedURLData(
    encodedURLData,
    communityPrivateKey
  )

  return new URL(`${BASE_URL}/cc/${encodedURLData}#${encodedSignature}`)
}

export function createUserURLWithENS(ensName: string): URL {
  return new URL(`${BASE_URL}/u#${ensName}`)
}

export function createUserURLWithChatKey(chatKey: string): URL {
  return new URL(`${BASE_URL}/u#${chatKey}`)
}

export async function createUserURLWithData(
  userData: PlainMessage<User>,
  userPrivateKey: Uint8Array | string
): Promise<URL> {
  const encodedURLData = encodeUserURLData(userData)
  const encodedSignature = await signEncodedURLData(
    encodedURLData,
    userPrivateKey
  )

  return new URL(`${BASE_URL}/u/${encodedURLData}#${encodedSignature}`)
}
