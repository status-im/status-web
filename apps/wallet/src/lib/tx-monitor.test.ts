import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  NOTIFICATIONS_ENABLED_KEY,
  PENDING_TXS_KEY,
  TX_NOTIFIED_KEY,
} from './storage-keys'
import { checkPendingTransactions } from './tx-monitor'

const hoisted = vi.hoisted(() => {
  const storageState = new Map<string, unknown>()

  return {
    storageState,
    getItemMock: vi.fn(async (key: string) => storageState.get(key)),
    setItemMock: vi.fn(async (key: string, value: unknown) => {
      storageState.set(key, value)
    }),
    notifyConfirmedMock: vi.fn(),
    notifyFailedMock: vi.fn(),
  }
})

vi.mock('@wxt-dev/storage', () => ({
  storage: {
    getItem: hoisted.getItemMock,
    setItem: hoisted.setItemMock,
  },
}))

vi.mock('./notifications', () => ({
  notifyTransactionConfirmed: hoisted.notifyConfirmedMock,
  notifyTransactionFailed: hoisted.notifyFailedMock,
}))

describe('checkPendingTransactions', () => {
  beforeEach(() => {
    hoisted.storageState.clear()
    hoisted.getItemMock.mockClear()
    hoisted.setItemMock.mockClear()
    hoisted.notifyConfirmedMock.mockReset()
    hoisted.notifyFailedMock.mockReset()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('removes confirmed transactions and records notification hashes', async () => {
    hoisted.storageState.set(PENDING_TXS_KEY, [
      { hash: '0xabc', value: 1, asset: 'ETH', displayAmount: '1.00' },
    ])
    hoisted.notifyConfirmedMock.mockResolvedValue(true)
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({ result: { status: '0x1' } }),
    } as Response)

    await checkPendingTransactions()

    expect(hoisted.notifyConfirmedMock).toHaveBeenCalledWith('1.00', 'ETH')
    expect(hoisted.storageState.get(PENDING_TXS_KEY)).toEqual([])
    expect(hoisted.storageState.get(TX_NOTIFIED_KEY)).toEqual(['0xabc'])
  })

  it('still removes settled transactions when notification delivery fails', async () => {
    hoisted.storageState.set(NOTIFICATIONS_ENABLED_KEY, false)
    hoisted.storageState.set(PENDING_TXS_KEY, [
      { hash: '0xdef', value: 2, asset: 'SNT', displayAmount: '2.50' },
    ])
    hoisted.notifyConfirmedMock.mockResolvedValue(false)
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({ result: { status: '0x1' } }),
    } as Response)

    await checkPendingTransactions()

    expect(hoisted.storageState.get(PENDING_TXS_KEY)).toEqual([])
    expect(hoisted.storageState.get(TX_NOTIFIED_KEY)).toBeUndefined()
  })

  it('cleans up already-notified stale pending transactions without re-notifying', async () => {
    hoisted.storageState.set(PENDING_TXS_KEY, [
      { hash: '0x123', value: 3, asset: 'ETH' },
    ])
    hoisted.storageState.set(TX_NOTIFIED_KEY, ['0x123'])
    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({ result: { status: '0x0' } }),
    } as Response)

    await checkPendingTransactions()

    expect(hoisted.notifyConfirmedMock).not.toHaveBeenCalled()
    expect(hoisted.notifyFailedMock).not.toHaveBeenCalled()
    expect(hoisted.storageState.get(PENDING_TXS_KEY)).toEqual([])
    expect(hoisted.storageState.get(TX_NOTIFIED_KEY)).toEqual(['0x123'])
  })
})
