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

/**
 * @see https://github.com/microsoft/TypeScript/issues/24509
 */
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

describe('Create URLs', () => {
  test('should create community URL', async () => {
    const community = vi.fn() as unknown as Mutable<
      Community & { privateKey: string }
    >
    community.privateKey =
      '87734578951189d843c7acd05b133a0e0d02c4110ea961df812f7ea15648e0d8'
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
      'https://status.app/c#zQ3shYSHp7GoiXaauJMnDcjwU2yNjdzpXLosAWapPS4CFxc11'
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
          community.privateKey
        )
      ).toString()
    ).toBe(
      'https://status.app/c/iyKACkQKB0Rvb2RsZXMSJ0NvbG9yaW5nIHRoZSB3b3JsZCB3aXRoIGpveSDigKIg4bSXIOKAohiYohsiByMxMzFEMkYqAwEhMwM=#Co0BClhRbk8yaHc1dFZBRS1NRDVpOE1xNHNfb0dXZDByUkZtbE9iZ1JVTlFYdFVOd1AxaXhGdzkxNFk0LUJRcEYwOEtPcXBhVUxDaDdVQ3RsV1ItTzBZUDhNd0E9EjF6UTNzaFlTSHA3R29pWGFhdUpNbkRjandVMnlOamR6cFhMb3NBV2FwUFM0Q0Z4YzEx'
    )
  })

  test('should create channel URL', async () => {
    const community = vi.fn() as unknown as Community & { privateKey: string }
    community.privateKey =
      '87734578951189d843c7acd05b133a0e0d02c4110ea961df812f7ea15648e0d8'
    community.chatKey = 'zQ3shYSHp7GoiXaauJMnDcjwU2yNjdzpXLosAWapPS4CFxc11'

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
      createChannelURLWithChatKey(chat.uuid, community.chatKey).toString()
    ).toBe(
      'https://status.app/cc/003cdcd5-e065-48f9-b166-b1a94ac75a11#zQ3shYSHp7GoiXaauJMnDcjwU2yNjdzpXLosAWapPS4CFxc11'
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
          },
          community.privateKey
        )
      ).toString()
    ).toBe(
      'https://status.app/cc/G5MAAJwHti1wffaxzoROUinAT91sn4fR1N9N7xIfY4uFVB5QfZZUo05O5CZ3-3ZIvPQAFCaU89DfHaWnM8bi4ykqo6qeH3JJdjnd-lFT5bnpk_fR86nSw4vHNGWf9Gp6p5yfJv1vsggjEY2pjTHL8ix3QYE9sBOUIUiJ5x1J6CSZ7yaEAA==#Co0BClhEc1lDNHFoeWZEaThPeXh0ekdqdVpPNGJxSmFRLWZyc01EMEpqTS1XY1VjMnhIVVZzRGQ4bHJqS1lINjRDTG11eEI4b0F2MXR0SEtLTEs4c0xWY2JVZ0E9EjF6UTNzaFlTSHA3R29pWGFhdUpNbkRjandVMnlOamR6cFhMb3NBV2FwUFM0Q0Z4YzEx'
    )
  })

  test('should create user URL', async () => {
    const account = vi.fn() as unknown as Mutable<Account>
    account.ensName = 'testing.stateofus.eth'
    account.privateKey =
      'e922443102af10422970269a8bc575cbdfd70487e4d9051f4b091edd8def5254'
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
      'https://status.app/u#testing.stateofus.eth'
    )
    expect(createUserURLWithChatKey(account.chatKey).toString()).toBe(
      'https://status.app/u#zQ3shwQPhRuDJSjVGVBnTjCdgXy5i9WQaeVPdGJD6yTarJQSj'
    )
    expect(
      (
        await createUserURLWithData(
          {
            description: account.description.chatIdentity!.description,
            displayName: account.description.chatIdentity!.displayName,
            color: account.description.chatIdentity!.color,
          },
          account.privateKey
        )
      ).toString()
    ).toBe(
      'https://status.app/u/G10A4B0JdgwyRww90WXtnP1oNH1ZLQNM0yX0Ja9YyAMjrqSZIYINOHCbFhrnKRAcPGStPxCMJDSZlGCKzmZrJcimHY8BbcXlORrElv_BbQEegnMDPx1g9C5VVNl0fE4y#Co0BClhMYlFVZEpESENLb2k4RHpvWXlYODlicEtyVGpWVjNTaHFIM0U2NGJEaWZKQjJHa2VkdExCZlZLQTAyUmJVZlgwNzRwYjlpM293R3dSZFM2eF9udHhyUUE9EjF6UTNzaHdRUGhSdURKU2pWR1ZCblRqQ2RnWHk1aTlXUWFlVlBkR0pENnlUYXJKUVNq'
    )
  })
})
