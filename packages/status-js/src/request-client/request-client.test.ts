import { afterEach, describe, expect, it, vi } from 'vitest'

import { RequestClient } from './request-client'

import type { LightNode } from '@waku/interfaces'

const communityPublicKey =
  '0x02b5bdaf5a25fcfe2ee14c501fab1836b8de57f61621080c3d52073d16de0d98d6'

describe('RequestClient', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('settles when a store node never responds', async () => {
    vi.useFakeTimers()

    const queryGenerator = vi.fn(async function* () {
      // accepted, never answered
      yield await new Promise<never>(() => {})
    })
    const waku = { store: { queryGenerator } } as unknown as LightNode
    const client = new RequestClient(waku, { ethProviderApiKey: '' })

    const result = client.fetchCommunityDescription(communityPublicKey)
    await vi.advanceTimersByTimeAsync(10_000)

    await expect(result).resolves.toBeUndefined()
    expect(queryGenerator).toHaveBeenCalledTimes(3)
  })
})
