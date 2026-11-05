import { describe, expect, it } from 'vitest'

import { parseMessageLink } from './_parse-message-link'

const communityPublicKey =
  '0x02b5bdaf5a25fcfe2ee14c501fab1836b8de57f61621080c3d52073d16de0d98d6'
const channelUuid = 'cf678d5b-87e7-4275-8621-67d96d974c1a'
const messageId =
  '0xbbf7b4bd87f814d3ba128dd6090423c049ba180436fabaec394572483d4de6f9'

describe('parseMessageLink', () => {
  it('splits chat ID into community public key and channel UUID', () => {
    expect(
      parseMessageLink(`${communityPublicKey}${channelUuid}`, messageId)
    ).toEqual({ communityPublicKey, channelUuid, messageId })
  })

  it('ignores missing or invalid message ID', () => {
    const slug = `${communityPublicKey}${channelUuid}`

    expect(parseMessageLink(slug, undefined)?.messageId).toBeUndefined()
    expect(parseMessageLink(slug, '0x123')?.messageId).toBeUndefined()
    expect(parseMessageLink(slug, [messageId])?.messageId).toBeUndefined()
  })

  it.each([
    channelUuid,
    communityPublicKey,
    `${communityPublicKey.slice(0, -2)}${channelUuid}`,
    `${communityPublicKey}-${channelUuid}`,
  ])('rejects invalid chat ID %s', slug => {
    expect(parseMessageLink(slug, messageId)).toBeNull()
  })
})
