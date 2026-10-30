import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { APPROVAL_TIMEOUT_MS } from '../../data/approval'
import { requestApproval } from './request-approval'

const POPUP_ID = 7

const removeWindow = vi.fn<(windowId: number) => Promise<void>>(async () => {})
const createWindow = vi.fn(async () => ({ id: POPUP_ID }))

beforeEach(() => {
  vi.useFakeTimers()
  removeWindow.mockClear()
  createWindow.mockClear()
  const session = new Map<string, unknown>()
  vi.stubGlobal('chrome', {
    storage: {
      session: {
        get: async (key: string) =>
          session.has(key) ? { [key]: session.get(key) } : {},
        set: async (items: Record<string, unknown>) => {
          for (const [k, v] of Object.entries(items)) session.set(k, v)
        },
        remove: async (key: string) => {
          session.delete(key)
        },
      },
      onChanged: { addListener: () => {}, removeListener: () => {} },
    },
    runtime: { getURL: (path: string) => `chrome-extension://test/${path}` },
    windows: {
      getCurrent: async () => ({ left: 0, top: 0, width: 1200 }),
      create: createWindow,
      remove: removeWindow,
      onRemoved: { addListener: () => {}, removeListener: () => {} },
    },
  })
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

test('a timed-out approval closes its popup', async () => {
  const result = requestApproval({
    type: 'eth_requestAccounts',
    origin: 'https://app.velora.xyz',
    title: 'Velora',
    favicon: 'https://app.velora.xyz/favicon.ico',
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    accountName: 'Wallet 1',
    chainId: '0x1',
  })
  await vi.waitFor(() => expect(createWindow).toHaveBeenCalled())

  await vi.advanceTimersByTimeAsync(APPROVAL_TIMEOUT_MS)

  await expect(result).resolves.toBeNull()
  expect(removeWindow).toHaveBeenCalledWith(POPUP_ID)
})
