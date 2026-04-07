import { afterEach, beforeEach, expect, test, vi } from 'vitest'

vi.mock('@wxt-dev/storage', () => ({
  storage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
}))

vi.mock('./notifications', () => ({
  notifyTransactionConfirmed: vi.fn(),
  notifyTransactionFailed: vi.fn(),
}))

/* eslint-disable import/first */
import { storage } from '@wxt-dev/storage'

import {
  notifyTransactionConfirmed,
  notifyTransactionFailed,
} from './notifications'
import {
  NOTIFICATIONS_ENABLED_KEY,
  PENDING_TXS_KEY,
  TX_NOTIFIED_KEY,
} from './storage-keys'
import { checkPendingTransactions } from './tx-monitor'
/* eslint-enable import/first */

const storageMock = storage as unknown as {
  getItem: ReturnType<typeof vi.fn>
  setItem: ReturnType<typeof vi.fn>
}
const notifyConfirmedMock = notifyTransactionConfirmed as ReturnType<
  typeof vi.fn
>
const notifyFailedMock = notifyTransactionFailed as ReturnType<typeof vi.fn>

const A_PENDING_TX = {
  hash: '0xabc123',
  value: 0.1,
  asset: 'ETH',
  status: 'pending',
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
  storageMock.getItem.mockResolvedValue(null)
  storageMock.setItem.mockResolvedValue(undefined)
  notifyConfirmedMock.mockResolvedValue(true)
  notifyFailedMock.mockResolvedValue(true)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

test('does nothing when there are no pending transactions', async () => {
  storageMock.getItem.mockResolvedValue([])
  await checkPendingTransactions()
  expect(fetch).not.toHaveBeenCalled()
  expect(notifyConfirmedMock).not.toHaveBeenCalled()
})

test('clears notified list when pending transactions are empty', async () => {
  storageMock.getItem.mockImplementation(async (key: string) => {
    if (key === PENDING_TXS_KEY) return []
    return null
  })
  await checkPendingTransactions()
  expect(storageMock.setItem).toHaveBeenCalledWith(TX_NOTIFIED_KEY, [])
})

test('sends confirmed notification when receipt status is 0x1', async () => {
  storageMock.getItem.mockImplementation(async (key: string) => {
    if (key === PENDING_TXS_KEY) return [A_PENDING_TX]
    return null
  })
  vi.mocked(fetch).mockResolvedValue({
    json: async () => ({ result: { status: '0x1' } }),
  } as Response)

  await checkPendingTransactions()

  expect(notifyConfirmedMock).toHaveBeenCalledWith('0.1', 'ETH')
  expect(storageMock.setItem).toHaveBeenCalledWith(TX_NOTIFIED_KEY, [
    '0xabc123',
  ])
})

test('sends failed notification when receipt status is 0x0', async () => {
  storageMock.getItem.mockImplementation(async (key: string) => {
    if (key === PENDING_TXS_KEY) return [A_PENDING_TX]
    return null
  })
  vi.mocked(fetch).mockResolvedValue({
    json: async () => ({ result: { status: '0x0' } }),
  } as Response)

  await checkPendingTransactions()

  expect(notifyFailedMock).toHaveBeenCalledWith('0.1', 'ETH')
})

test('skips already-notified transactions', async () => {
  storageMock.getItem.mockImplementation(async (key: string) => {
    if (key === PENDING_TXS_KEY) return [A_PENDING_TX]
    if (key === TX_NOTIFIED_KEY) return ['0xabc123']
    return null
  })

  await checkPendingTransactions()

  expect(fetch).not.toHaveBeenCalled()
  expect(notifyConfirmedMock).not.toHaveBeenCalled()
})

test('skips tx if receipt is not yet available (null result)', async () => {
  storageMock.getItem.mockImplementation(async (key: string) => {
    if (key === PENDING_TXS_KEY) return [A_PENDING_TX]
    return null
  })
  vi.mocked(fetch).mockResolvedValue({
    json: async () => ({ result: null }),
  } as Response)

  await checkPendingTransactions()

  expect(notifyConfirmedMock).not.toHaveBeenCalled()
  expect(notifyFailedMock).not.toHaveBeenCalled()
})

test('does not poll or notify when notifications are disabled', async () => {
  storageMock.getItem.mockImplementation(async (key: string) => {
    if (key === NOTIFICATIONS_ENABLED_KEY) return false
    if (key === PENDING_TXS_KEY) return [A_PENDING_TX]
    return null
  })

  await checkPendingTransactions()

  expect(fetch).not.toHaveBeenCalled()
  expect(notifyConfirmedMock).not.toHaveBeenCalled()
})
