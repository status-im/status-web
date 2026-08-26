import { describe, expect, it } from 'vitest'

import { decideNonce, RECONCILE_AFTER_BLOCKS } from './nonce-tracker'

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
