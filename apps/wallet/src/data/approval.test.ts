import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import {
  APPROVAL_TIMEOUT_MS,
  clearPendingApproval,
  getPendingApproval,
  type PendingApproval,
  setPendingApproval,
} from './approval'

const approval = (createdAt: number): PendingApproval => ({
  id: 'approval-1',
  createdAt,
  type: 'eth_requestAccounts',
  origin: 'https://app.velora.xyz',
  title: 'Velora',
  favicon: 'https://app.velora.xyz/favicon.ico',
  address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  accountName: 'Wallet 1',
  chainId: '0x1',
})

beforeEach(() => {
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
    },
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

test('a fresh pending approval is returned', async () => {
  await setPendingApproval(approval(Date.now()))

  expect(await getPendingApproval()).not.toBeNull()
})

// Regression: MV3 can terminate the worker while the approval popup is open,
// so the handler that would clear this never runs. The leftover record then
// rejected every later connection attempt with -32002 until the browser was
// restarted, which reads as "the dApp keeps asking and never connects".
test('a pending approval older than the timeout is discarded', async () => {
  await setPendingApproval(approval(Date.now() - APPROVAL_TIMEOUT_MS - 1))

  expect(await getPendingApproval()).toBeNull()
  // and is cleared, so it cannot block again
  expect(await chrome.storage.session.get('pendingApproval')).toEqual({})
})

test('a record predating the createdAt field is treated as stale', async () => {
  const legacy: Record<string, unknown> = { ...approval(Date.now()) }
  delete legacy.createdAt
  await chrome.storage.session.set({ pendingApproval: legacy })

  expect(await getPendingApproval()).toBeNull()
})

test('clearing removes the record', async () => {
  await setPendingApproval(approval(Date.now()))
  await clearPendingApproval()

  expect(await getPendingApproval()).toBeNull()
})
