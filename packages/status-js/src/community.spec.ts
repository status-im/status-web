import { Waku } from 'js-waku'

import { Community } from './community'

import type { CommunityDescription } from './wire/community_description'

describe('Community [live data]', () => {
  test('Retrieves community description For DappConnect Test from Waku prod fleet', async () => {
    const waku = await Waku.create({ bootstrap: { default: true } })

    await waku.waitForRemotePeer()

    const community = await Community.instantiateCommunity(
      '0x02cf13719c8b836bebd4e430c497ee38e798a43e4d8c4760c34bbd9bf4f2434d26',
      waku
    )
    const desc = community.description as CommunityDescription
    expect(desc).toBeDefined()

    expect(desc.identity?.displayName).toEqual('Test Community')

    const descChats = Array.from(desc.chats.values()).map(
      chat => chat?.identity?.displayName
    )
    expect(descChats).toEqual(expect.arrayContaining(['Test Chat']))
    expect(descChats).toEqual(expect.arrayContaining(['Additional Chat']))

    const chats = Array.from(community.chats.values()).map(
      chat => chat?.communityChat?.identity?.displayName
    )
    expect(chats).toEqual(expect.arrayContaining(['Test Chat']))
    expect(chats).toEqual(expect.arrayContaining(['Additional Chat']))
  })
})
