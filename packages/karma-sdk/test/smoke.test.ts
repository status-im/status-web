import { describe, expect, it } from 'vitest'

import { KARMA_CHAIN_IDS, getKarmaAddresses } from '../src'

describe('@status-im/karma-sdk smoke', () => {
  it('returns deployed contract addresses for status sepolia', () => {
    const chainId = KARMA_CHAIN_IDS.STATUS_SEPOLIA
    const addresses = getKarmaAddresses(chainId)

    expect(addresses.karma).toMatch(/^0x[a-fA-F0-9]{40}$/)
    expect(addresses.rewardsDistributor).toMatch(/^0x[a-fA-F0-9]{40}$/)
    expect(addresses.karmaTier).toMatch(/^0x[a-fA-F0-9]{40}$/)
  })
})
