import { storage } from '@wxt-dev/storage'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { readNonceMarkStore, writeNonceMarkStore } from '../data/nonce-tracker'
import {
  createNonceTracker,
  decideNonce,
  HELD_NONCE_TTL_MS,
  RECONCILE_AFTER_BLOCKS,
  RENEWED_HOLD_TTL_MS,
} from './nonce-tracker'

import type { ChainNonceState } from './nonce-tracker'

const chain = (
  pendingNonce: number,
  latestNonce: number,
  blockNumber: number,
): ChainNonceState => ({ pendingNonce, latestNonce, blockNumber })

describe('decideNonce', () => {
  it('clears the mark when the chain has caught up with the local counter', () => {
    expect(
      decideNonce(5, chain(5, 5, 100), { block: 90, pendingNonce: 5 }),
    ).toEqual({ action: 'clear' })
  })

  it('clears the mark while the pool still holds something', () => {
    expect(
      decideNonce(6, chain(5, 4, 100), { block: 90, pendingNonce: 5 }),
    ).toEqual({ action: 'clear' })
  })

  it('marks the first time the counter is seen ahead of an empty pool', () => {
    expect(decideNonce(6, chain(5, 5, 100), undefined)).toEqual({
      action: 'mark',
      mark: { block: 100, pendingNonce: 5 },
    })
  })

  it('re-marks when the pending count has moved since the mark', () => {
    expect(
      decideNonce(8, chain(6, 6, 100), { block: 95, pendingNonce: 5 }),
    ).toEqual({ action: 'mark', mark: { block: 100, pendingNonce: 6 } })
  })

  it('re-marks when the reported block is below the marked one', () => {
    expect(
      decideNonce(6, chain(5, 5, 80), { block: 100, pendingNonce: 5 }),
    ).toEqual({ action: 'mark', mark: { block: 80, pendingNonce: 5 } })
  })

  it('waits inside the observation window', () => {
    const mark = { block: 100, pendingNonce: 5 }
    const lastWaiting = 100 + RECONCILE_AFTER_BLOCKS - 1
    expect(decideNonce(6, chain(5, 5, lastWaiting), mark)).toEqual({
      action: 'wait',
    })
  })

  it('lowers the counter to the pending count once the window has passed', () => {
    const mark = { block: 100, pendingNonce: 5 }
    expect(
      decideNonce(6, chain(5, 5, 100 + RECONCILE_AFTER_BLOCKS), mark),
    ).toEqual({ action: 'reconcile', nonce: 5 })
  })

  it('lowers a counter that has run several nonces ahead', () => {
    const mark = { block: 100, pendingNonce: 5 }
    expect(
      decideNonce(9, chain(5, 5, 100 + RECONCILE_AFTER_BLOCKS), mark),
    ).toEqual({ action: 'reconcile', nonce: 5 })
  })
})

const ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const NETWORK = 'ethereum'

describe('held reservations', () => {
  // The node's pending nonce, left unchanged after a send as a lagging node would.
  let pendingNonce = 5

  beforeEach(async () => {
    pendingNonce = 5
    await storage.clear('session')
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('nodes.getNonce')) {
          return new Response(
            JSON.stringify({
              result: { data: { json: `0x${pendingNonce.toString(16)}` } },
            }),
          )
        }
        return new Response(null, { status: 503 })
      }),
    )
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('blocks the next reservation until the held one is committed', async () => {
    const tracker = createNonceTracker()
    const first = await tracker.reserveHeld(ADDRESS, NETWORK)

    let second: { nonce: number } | undefined
    const waiting = tracker
      .reserveHeld(ADDRESS, NETWORK)
      .then(reservation => (second = reservation))
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(second).toBeUndefined()

    await tracker.claimHeld(first.id)!.commit()
    await waiting

    expect(first.nonce).toBe(5)
    expect(second?.nonce).toBe(6)
  })

  it('hands a released nonce to the next reservation', async () => {
    const tracker = createNonceTracker()
    const first = await tracker.reserveHeld(ADDRESS, NETWORK)

    tracker.releaseHeld(first.id)

    await expect(tracker.reserveHeld(ADDRESS, NETWORK)).resolves.toMatchObject({
      nonce: first.nonce,
    })
  })

  it('lets an abandoned reservation lapse', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    const tracker = createNonceTracker()
    const first = await tracker.reserveHeld(ADDRESS, NETWORK)
    const waiting = tracker.reserveHeld(ADDRESS, NETWORK)

    vi.advanceTimersByTime(HELD_NONCE_TTL_MS)

    await expect(waiting).resolves.toMatchObject({ nonce: first.nonce })
  })

  it('cannot claim a hold that lapsed', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    const tracker = createNonceTracker()
    const held = await tracker.reserveHeld(ADDRESS, NETWORK)

    vi.advanceTimersByTime(HELD_NONCE_TTL_MS)

    expect(tracker.renewHeld(held.id)).toBe(false)
    expect(tracker.claimHeld(held.id)).toBeNull()
  })

  it('cannot claim a hold that a worker restart lost', async () => {
    const held = await createNonceTracker().reserveHeld(ADDRESS, NETWORK)

    expect(createNonceTracker().claimHeld(held.id)).toBeNull()
  })

  it('keeps a renewed hold past its lifetime', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    const tracker = createNonceTracker()
    const held = await tracker.reserveHeld(
      ADDRESS,
      NETWORK,
      RENEWED_HOLD_TTL_MS,
    )

    vi.advanceTimersByTime(RENEWED_HOLD_TTL_MS - 1000)
    expect(tracker.renewHeld(held.id)).toBe(true)
    vi.advanceTimersByTime(RENEWED_HOLD_TTL_MS - 1000)

    expect(tracker.claimHeld(held.id)).toMatchObject({ nonce: held.nonce })
  })

  it('releases a short hold nobody renews', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    const tracker = createNonceTracker()
    const held = await tracker.reserveHeld(
      ADDRESS,
      NETWORK,
      RENEWED_HOLD_TTL_MS,
    )
    const waiting = tracker.reserveHeld(ADDRESS, NETWORK)

    vi.advanceTimersByTime(RENEWED_HOLD_TTL_MS)

    await expect(waiting).resolves.toMatchObject({ nonce: held.nonce })
  })

  it('drops the reserve-time mark when a held nonce is committed', async () => {
    const key = `${ADDRESS}:${NETWORK}`
    await writeNonceMarkStore({ [key]: { block: 100, pendingNonce: 5 } })
    const tracker = createNonceTracker()
    const held = await tracker.reserveHeld(ADDRESS, NETWORK)

    await tracker.claimHeld(held.id)!.commit()

    expect((await readNonceMarkStore())[key]).toBeUndefined()
  })

  it('withNonce gives the nonce back when the send fails', async () => {
    const tracker = createNonceTracker()

    await expect(
      tracker.withNonce(ADDRESS, NETWORK, async () => {
        throw new Error('broadcast failed')
      }),
    ).rejects.toThrow('broadcast failed')

    const nonceHex = await tracker.withNonce(ADDRESS, NETWORK, async hex => hex)
    expect(parseInt(nonceHex, 16)).toBe(5)
  })
})
