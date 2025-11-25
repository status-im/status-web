import {
  encodeChannelURLData,
  encodeCommunityURLData,
  encodeUserURLData,
} from './encode-url-data'

import type { Channel, Community, User } from '../protos/url_pb'

const BASE_URL = 'https://status.app'

export function createCommunityURLWithChatKey(communityChatKey: string): URL {
  return new URL(`${BASE_URL}/c#${communityChatKey}`)
}

export async function createCommunityURLWithData(
  communityData: Community,
  communityChatKey: string,
): Promise<URL> {
  const encodedURLData = encodeCommunityURLData(communityData)

  return new URL(`${BASE_URL}/c/${encodedURLData}#${communityChatKey}`)
}

export function createChannelURLWithChatKey(
  channelUuid: string,
  communityChatKey: string,
): URL {
  return new URL(`${BASE_URL}/cc/${channelUuid}#${communityChatKey}`)
}

export async function createChannelURLWithData(
  channelData: Channel,
  communityChatKey: string,
): Promise<URL> {
  const encodedURLData = encodeChannelURLData(channelData)

  return new URL(`${BASE_URL}/cc/${encodedURLData}#${communityChatKey}`)
}

export function createUserURLWithENS(ensName: string): URL {
  return new URL(`${BASE_URL}/u#${ensName}`)
}

export function createUserURLWithChatKey(chatKey: string): URL {
  return new URL(`${BASE_URL}/u#${chatKey}`)
}

export async function createUserURLWithData(
  userData: User,
  userChatKey: string,
): Promise<URL> {
  const encodedURLData = encodeUserURLData(userData)

  return new URL(`${BASE_URL}/u/${encodedURLData}#${userChatKey}`)
}
