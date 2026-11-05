import { afterEach, describe, expect, it, vi } from 'vitest'

import { RequestClient } from './request-client'

import type { LightNode } from '@waku/interfaces'

const communityPublicKey =
  '0x02b5bdaf5a25fcfe2ee14c501fab1836b8de57f61621080c3d52073d16de0d98d6'

describe('RequestClient', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('queries the store in 24-hour windows, newest first', async () => {
    vi.useFakeTimers({ now: new Date('2026-01-31T00:00:00Z') })

    const queryGenerator = vi.fn<
      (decoders: unknown[], options: unknown) => AsyncGenerator<never>
    >(async function* () {})
    const waku = { store: { queryGenerator } } as unknown as LightNode
    const client = new RequestClient(waku, { ethProviderApiKey: '' })

    await expect(
      client.fetchCommunityDescription(communityPublicKey),
    ).resolves.toBeUndefined()

    // 3 shards, 30 windows each
    expect(queryGenerator).toHaveBeenCalledTimes(90)
    expect(queryGenerator.mock.calls[0]![1]).toEqual({
      paginationForward: false,
      timeStart: new Date('2026-01-30T00:00:00Z'),
      timeEnd: new Date('2026-01-31T00:00:00Z'),
    })
    expect(queryGenerator.mock.calls.at(-1)![1]).toMatchObject({
      timeStart: new Date('2026-01-01T00:00:00Z'),
      timeEnd: new Date('2026-01-02T00:00:00Z'),
    })
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
    await vi.advanceTimersByTimeAsync(30_000)

    await expect(result).resolves.toBeUndefined()
    expect(queryGenerator).toHaveBeenCalledTimes(3)
  })
})
