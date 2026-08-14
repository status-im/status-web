import { storage } from '@wxt-dev/storage'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import {
  connectAccount,
  getConnectedAccounts,
  getSelectedAddress,
} from '../data/dapp-permissions'
import {
  connectAccountToDapp,
  disconnectDapp,
  syncAccountToDapps,
} from './dapp-events'

const ORIGIN = 'https://app.velora.xyz'
const OTHER_ORIGIN = 'https://app.uniswap.org'
const ACCOUNT_A = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const ACCOUNT_B = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

type Sent = { tabId: number; message: { event: string; data: unknown } }

let sent: Sent[] = []

beforeEach(async () => {
  sent = []
  vi.stubGlobal('chrome', {
    tabs: {
      query: async () => [
        { id: 1, url: `${ORIGIN}/swap?from=eth` },
        { id: 2, url: `${OTHER_ORIGIN}/` },
        // A tab the bridge never loaded into. Pushing to it rejects.
        { id: 3, url: 'chrome://extensions' },
        { id: 4 },
      ],
      sendMessage: async (tabId: number, message: Sent['message']) => {
        if (tabId === 3) throw new Error('Receiving end does not exist.')
        sent.push({ tabId, message })
      },
    },
  })
  await storage.clear('local')
})

afterEach(async () => {
  await storage.clear('local')
  vi.unstubAllGlobals()
})

describe('syncAccountToDapps', () => {
  test('re-points a dApp already connected to the account and tells it', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)
    await connectAccount(ORIGIN, ACCOUNT_B)

    await syncAccountToDapps(ACCOUNT_A)

    expect(await getSelectedAddress(ORIGIN)).toBe(ACCOUNT_A)
    expect(sent).toEqual([
      {
        tabId: 1,
        message: {
          type: 'status:event',
          event: 'accountsChanged',
          data: [ACCOUNT_A],
        },
      },
    ])
  })

  // The whole point of the change: an account the user never connected here
  // must not appear in the dApp just because the wallet switched to it.
  test('leaves a dApp that was never connected to the account alone', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)

    await syncAccountToDapps(ACCOUNT_B)

    expect(await getSelectedAddress(ORIGIN)).toBe(ACCOUNT_A)
    expect(sent).toEqual([])
  })

  test('says nothing when the dApp already shows the account', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)

    await syncAccountToDapps(ACCOUNT_A)

    expect(sent).toEqual([])
  })

  test('only notifies tabs on the matching origin', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)
    await connectAccount(ORIGIN, ACCOUNT_B)
    await connectAccount(OTHER_ORIGIN, ACCOUNT_A)
    await connectAccount(OTHER_ORIGIN, ACCOUNT_B)
    await syncAccountToDapps(ACCOUNT_A)

    expect(sent.map(s => s.tabId).sort()).toEqual([1, 2])
  })
})

describe('acting on a dApp from the wallet UI', () => {
  test('connecting adds the account and switches the dApp live', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)

    await connectAccountToDapp(ORIGIN, ACCOUNT_B)

    expect(await getConnectedAccounts(ORIGIN)).toEqual([ACCOUNT_A, ACCOUNT_B])
    expect(sent[0]?.message.data).toEqual([ACCOUNT_B])
  })

  test('disconnecting reports an empty account list', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)

    await disconnectDapp(ORIGIN)

    expect(await getConnectedAccounts(ORIGIN)).toEqual([])
    expect(sent[0]?.message.data).toEqual([])
  })
})
