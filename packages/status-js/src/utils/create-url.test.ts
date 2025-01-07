import { describe, expect, test, vi } from 'vitest'

import {
  createChannelURLWithChatKey,
  createChannelURLWithData,
  createCommunityURLWithChatKey,
  createCommunityURLWithData,
  createUserURLWithChatKey,
  createUserURLWithData,
  createUserURLWithENS,
} from './create-url'

import type { Account } from '../client/account'
import type { Chat } from '../client/chat'
import type { Community } from '../client/community/community'
import type {
  CommunityChat,
  CommunityDescription,
} from '../protos/communities_pb'
import type { ContactCodeAdvertisement } from '../protos/push-notifications_pb'
import type { Channel as ChannelProto } from '../protos/url_pb'
import type { PlainMessage } from '@bufbuild/protobuf'

/**
 * @see https://github.com/microsoft/TypeScript/issues/24509
 */
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

describe('Create URLs', () => {
  test('should create community URL', async () => {
    const community = vi.fn() as unknown as Mutable<Community>
    community.chatKey = 'zQ3shYSHp7GoiXaauJMnDcjwU2yNjdzpXLosAWapPS4CFxc11'
    community.description = {
      members: {
        '0x04b226ea6d3a96a6ef43106d773c730179d91f5a1d8d701ab40a8f576811fcc8de36df0b756938cc540cd24590a49791aec1489a1ba4af9a13ebdfbc7c3115283d':
          {},
      },
      identity: {
        description: 'Coloring the world with joy • ᴗ •',
        displayName: 'Doodles',
        color: '#131D2F',
      },
      tags: ['Art', 'NFT', 'Web3'],
    } as unknown as CommunityDescription

    expect(createCommunityURLWithChatKey(community.chatKey).toString()).toBe(
      'https://status.app/c#zQ3shYSHp7GoiXaauJMnDcjwU2yNjdzpXLosAWapPS4CFxc11',
    )
    expect(
      (
        await createCommunityURLWithData(
          {
            description: community.description.identity!.description,
            displayName: community.description.identity!.displayName,
            color: community.description.identity!.color,
            membersCount: 446_744,
            tagIndices: [1, 33, 51],
          },
          community.chatKey,
        )
      ).toString(),
    ).toBe(
      'https://status.app/c/iyKACkQKB0Rvb2RsZXMSJ0NvbG9yaW5nIHRoZSB3b3JsZCB3aXRoIGpveSDigKIg4bSXIOKAohiYohsiByMxMzFEMkYqAwEhMwM=#zQ3shYSHp7GoiXaauJMnDcjwU2yNjdzpXLosAWapPS4CFxc11',
    )
  })

  test('should create channel URL', async () => {
    const community = vi.fn() as unknown as Community
    community.chatKey = 'zQ3shYSHp7GoiXaauJMnDcjwU2yNjdzpXLosAWapPS4CFxc11'
    community.description = {
      members: {
        '0x04b226ea6d3a96a6ef43106d773c730179d91f5a1d8d701ab40a8f576811fcc8de36df0b756938cc540cd24590a49791aec1489a1ba4af9a13ebdfbc7c3115283d':
          {},
      },
      identity: {
        description: 'Coloring the world with joy • ᴗ •',
        displayName: 'Doodles',
        color: '#131D2F',
      },
      tags: ['Art', 'NFT', 'Web3'],
    } as unknown as CommunityDescription

    const chat = vi.fn() as unknown as Mutable<Chat>
    chat.uuid = '003cdcd5-e065-48f9-b166-b1a94ac75a11'
    chat.description = {
      identity: {
        description:
          'The quick brown fox jumped over the lazy dog because it was too lazy to go around.',
        displayName: 'design',
        emoji: '🍿',
        color: '#131D2F',
      },
    } as unknown as CommunityChat

    expect(
      createChannelURLWithChatKey(chat.uuid, community.chatKey).toString(),
    ).toBe(
      'https://status.app/cc/003cdcd5-e065-48f9-b166-b1a94ac75a11#zQ3shYSHp7GoiXaauJMnDcjwU2yNjdzpXLosAWapPS4CFxc11',
    )
    expect(
      (
        await createChannelURLWithData(
          {
            description: chat.description.identity!.description,
            displayName: chat.description.identity!.displayName,
            emoji: chat.description.identity!.emoji,
            color: chat.description.identity!.color,
            uuid: chat.uuid,
            community: {
              displayName: community.description.identity!.displayName,
            },
          } as unknown as PlainMessage<ChannelProto>,
          community.chatKey,
        )
      ).toString(),
    ).toBe(
      'https://status.app/cc/G54AAKwObLdpiGjXnckYzRcOSq0QQAS_CURGfqVU42ceGHCObstUIknTTZDOKF3E8y2MSicncpO7fTskXnoACiPKeejvjtLTGWNxUhlT7fyQS7Jrr33UVHluxv_PLjV2ePGw5GQ33innzeK34pInIgUGs5RjdQifMVmURalxxQKwiuoY5zwIjixWWRHqjHM=#zQ3shYSHp7GoiXaauJMnDcjwU2yNjdzpXLosAWapPS4CFxc11',
    )
  })

  test('should create user URL', async () => {
    const account = vi.fn() as unknown as Mutable<Account>
    account.ensName = 'testing.stateofus.eth'
    account.chatKey = 'zQ3shwQPhRuDJSjVGVBnTjCdgXy5i9WQaeVPdGJD6yTarJQSj'
    account.description = {
      chatIdentity: {
        description:
          'Visual designer @Status, cat lover, pizza enthusiast, yoga afficionada',
        displayName: 'Mark Cole',
        color: '#BA434D',
      },
    } as unknown as ContactCodeAdvertisement

    expect(createUserURLWithENS(account.ensName).toString()).toBe(
      'https://status.app/u#testing.stateofus.eth',
    )
    expect(createUserURLWithChatKey(account.chatKey).toString()).toBe(
      'https://status.app/u#zQ3shwQPhRuDJSjVGVBnTjCdgXy5i9WQaeVPdGJD6yTarJQSj',
    )
    expect(
      (
        await createUserURLWithData(
          {
            description: account.description.chatIdentity!.description,
            displayName: account.description.chatIdentity!.displayName,
            color: account.description.chatIdentity!.color,
          },
          account.chatKey,
        )
      ).toString(),
    ).toBe(
      'https://status.app/u/G10A4B0JdgwyRww90WXtnP1oNH1ZLQNM0yX0Ja9YyAMjrqSZIYINOHCbFhrnKRAcPGStPxCMJDSZlGCKzmZrJcimHY8BbcXlORrElv_BbQEegnMDPx1g9C5VVNl0fE4y#zQ3shwQPhRuDJSjVGVBnTjCdgXy5i9WQaeVPdGJD6yTarJQSj',
    )
  })
})
