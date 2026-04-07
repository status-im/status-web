import { afterEach, beforeEach, expect, test, vi } from 'vitest'

// vi.mock is hoisted by Vitest at compile time; placing it here makes the
// hoisting intent explicit. ESLint rules are suppressed for the lines that
// follow because the import ordering is intentional.

vi.mock('@wxt-dev/storage', () => ({
  storage: {
    getItem: vi.fn(),
  },
}))

/* eslint-disable import/first */
import { storage } from '@wxt-dev/storage'

import {
  notifyTransactionConfirmed,
  notifyTransactionFailed,
  notifyTransactionSent,
} from './notifications'
/* eslint-enable import/first */

const storageMock = storage as unknown as { getItem: ReturnType<typeof vi.fn> }

beforeEach(() => {
  vi.stubGlobal('chrome', {
    runtime: {
      getURL: vi.fn((path: string) => `chrome-extension://test/${path}`),
    },
    notifications: {
      create: vi.fn(),
    },
  })
  storageMock.getItem.mockResolvedValue(true)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

test('notifyTransactionSent creates notification with correct content', async () => {
  const result = await notifyTransactionSent('0.1', 'ETH')
  expect(chrome.notifications.create).toHaveBeenCalledWith({
    type: 'basic',
    iconUrl: 'chrome-extension://test/icons/128.png',
    title: 'Transaction Sent',
    message: 'Sending 0.1 ETH…',
  })
  expect(result).toBe(true)
})

test('notifyTransactionConfirmed creates notification with correct content', async () => {
  const result = await notifyTransactionConfirmed('0.5', 'USDC')
  expect(chrome.notifications.create).toHaveBeenCalledWith({
    type: 'basic',
    iconUrl: 'chrome-extension://test/icons/128.png',
    title: 'Transaction Confirmed',
    message: '0.5 USDC sent successfully',
  })
  expect(result).toBe(true)
})

test('notifyTransactionFailed creates notification with correct content', async () => {
  const result = await notifyTransactionFailed('0.1', 'ETH')
  expect(chrome.notifications.create).toHaveBeenCalledWith({
    type: 'basic',
    iconUrl: 'chrome-extension://test/icons/128.png',
    title: 'Transaction Failed',
    message: '0.1 ETH transaction failed',
  })
  expect(result).toBe(true)
})

test('does not create notification when notifications are disabled', async () => {
  storageMock.getItem.mockResolvedValue(false)
  const result = await notifyTransactionSent('0.1', 'ETH')
  expect(chrome.notifications.create).not.toHaveBeenCalled()
  expect(result).toBe(false)
})

test('returns false when chrome.notifications.create throws', async () => {
  vi.mocked(chrome.notifications.create).mockRejectedValueOnce(
    new Error('boom'),
  )
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const result = await notifyTransactionSent('0.1', 'ETH')
  expect(result).toBe(false)
  warnSpy.mockRestore()
})
