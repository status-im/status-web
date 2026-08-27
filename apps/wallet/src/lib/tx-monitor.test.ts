import { describe, expect, it } from 'vitest'

import { classifyPoll, DROPPED_AFTER_MISSES } from './tx-monitor'

const found = { ok: true, value: true } as const
const missing = { ok: true, value: false } as const
const unreachable = { ok: false } as const
const noReceipt = { ok: true, value: null } as const

describe('classifyPoll', () => {
  it('confirms on a successful receipt', () => {
    expect(
      classifyPoll({ ok: true, value: { status: '0x1' } }, undefined, 0),
    ).toEqual({ state: 'confirmed' })
  })

  it('fails on a reverted receipt', () => {
    expect(
      classifyPoll({ ok: true, value: { status: '0x0' } }, undefined, 0),
    ).toEqual({ state: 'failed' })
  })

  it('keeps a transaction the node still knows pending, and resets its misses', () => {
    expect(classifyPoll(noReceipt, found, 2)).toEqual({
      state: 'pending',
      misses: 0,
    })
  })

  it('counts a miss when the node has no record of the hash', () => {
    expect(classifyPoll(noReceipt, missing, 0)).toEqual({
      state: 'pending',
      misses: 1,
    })
  })

  it('marks the transaction dropped once the misses run out', () => {
    expect(classifyPoll(noReceipt, missing, DROPPED_AFTER_MISSES - 1)).toEqual({
      state: 'dropped',
    })
  })

  it('does not age a transaction towards dropped on a failed receipt poll', () => {
    expect(classifyPoll(unreachable, undefined, 1)).toEqual({
      state: 'unresolved',
    })
  })

  it('does not age a transaction towards dropped on a failed probe', () => {
    expect(classifyPoll(noReceipt, unreachable, 1)).toEqual({
      state: 'unresolved',
    })
  })

  it('waits rather than settling on a receipt with an unknown status', () => {
    expect(
      classifyPoll({ ok: true, value: { status: '0x2' } }, undefined, 0),
    ).toEqual({ state: 'unresolved' })
  })
})
