// todo?: move to __tests__
import { Community } from './community'

import type { CommunityDescription } from './wire/community_description'
import type { Waku, WakuMessage } from 'js-waku'

// todo: move to __mocks__
const WakuMock = {
  store: {
    queryHistory: jest.fn(),
  },
}

describe('Community', () => {
  beforeEach(() => {
    // todo?: set as config instead
    jest.resetAllMocks()
  })

  test('Retrieves community description', async () => {
    // todo: move to __fixtures__
    const messages = [
      {
        payload: new Uint8Array([
          10, 65, 34, 159, 71, 242, 74, 40, 51, 11, 24, 120, 155, 102, 213, 241,
          204, 130, 230, 70, 184, 67, 216, 119, 77, 31, 226, 210, 217, 31, 82,
          178, 170, 106, 1, 67, 78, 127, 79, 198, 106, 0, 184, 167, 1, 117, 214,
          100, 35, 204, 53, 241, 245, 213, 210, 12, 223, 184, 203, 240, 170,
          153, 47, 186, 157, 134, 1, 18, 191, 2, 8, 3, 18, 140, 1, 10, 132, 1,
          48, 120, 48, 52, 97, 99, 52, 49, 57, 100, 97, 99, 57, 97, 56, 98, 98,
          98, 53, 56, 56, 50, 53, 97, 51, 99, 100, 101, 54, 48, 101, 101, 102,
          48, 101, 101, 55, 49, 98, 56, 99, 102, 54, 99, 54, 51, 100, 102, 54,
          49, 49, 101, 101, 101, 102, 99, 56, 101, 55, 97, 97, 99, 55, 99, 55,
          57, 98, 53, 53, 57, 53, 52, 98, 54, 55, 57, 100, 50, 52, 99, 102, 53,
          101, 99, 56, 50, 100, 97, 55, 101, 100, 57, 50, 49, 99, 97, 102, 50,
          52, 48, 54, 50, 56, 97, 57, 98, 102, 98, 51, 52, 53, 48, 99, 53, 49,
          49, 49, 97, 57, 99, 102, 102, 101, 53, 52, 101, 54, 51, 49, 56, 49,
          49, 18, 3, 10, 1, 1, 26, 2, 24, 3, 42, 41, 34, 16, 66, 111, 114, 105,
          110, 103, 32, 99, 111, 109, 109, 117, 110, 105, 116, 121, 42, 12, 68,
          101, 115, 99, 114, 105, 112, 116, 105, 111, 110, 46, 50, 7, 35, 52,
          51, 54, 48, 68, 70, 50, 60, 10, 36, 56, 52, 57, 53, 48, 98, 53, 50,
          45, 51, 97, 52, 52, 45, 52, 98, 102, 102, 45, 97, 52, 56, 99, 45, 52,
          98, 100, 102, 99, 48, 57, 55, 51, 49, 102, 57, 18, 20, 18, 2, 24, 1,
          26, 14, 34, 6, 114, 97, 110, 100, 111, 109, 42, 4, 100, 101, 115, 99,
          50, 63, 10, 36, 48, 48, 100, 51, 102, 53, 50, 53, 45, 97, 48, 99, 102,
          45, 52, 99, 52, 48, 45, 56, 51, 50, 100, 45, 53, 52, 51, 101, 99, 57,
          102, 56, 49, 56, 56, 98, 18, 23, 18, 2, 24, 1, 26, 15, 34, 8, 109,
          101, 115, 115, 97, 103, 101, 115, 42, 3, 100, 115, 99, 40, 1, 24, 25,
        ]),
      },
    ] as unknown as WakuMessage[]

    WakuMock.store.queryHistory.mockImplementationOnce((_, { callback }) =>
      Promise.resolve(callback(messages))
    )

    const community = await Community.instantiateCommunity(
      '0x02cf13719c8b836bebd4e430c497ee38e798a43e4d8c4760c34bbd9bf4f2434d26',
      WakuMock as unknown as Waku
    )
    const desc = community.description as CommunityDescription
    expect(desc).toBeDefined()

    expect(desc.identity?.displayName).toEqual('Boring community')

    const descChats = Array.from(desc.chats.values()).map(
      chat => chat?.identity?.displayName
    )
    expect(descChats).toEqual(expect.arrayContaining(['random']))
    expect(descChats).toEqual(expect.arrayContaining(['messages']))

    const chats = Array.from(community.chats.values()).map(
      chat => chat?.communityChat?.identity?.displayName
    )
    expect(chats).toEqual(expect.arrayContaining(['random']))
    expect(chats).toEqual(expect.arrayContaining(['messages']))
  })
})
