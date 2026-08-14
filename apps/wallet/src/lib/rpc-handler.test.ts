import { storage } from '@wxt-dev/storage'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import {
  connectAccount,
  ETH_ACCOUNTS_CAPABILITY,
  grantPermission,
  selectAccountForOrigin,
} from '../data/dapp-permissions'
import { handleRpcRequest } from './rpc-handler'

const ORIGIN = 'https://app.velora.xyz'
const OTHER_ORIGIN = 'https://app.uniswap.org'
const ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const OTHER_ADDRESS = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
const WALLET_ID = 'wallet-1'
const OTHER_WALLET_ID = 'wallet-2'

type Listener = (
  changes: Record<string, { newValue?: unknown; oldValue?: unknown }>,
  area: string,
) => void

/** Approves whatever approval the handler opens a popup for. */
let autoApprove = true

function createChromeMock() {
  const session = new Map<string, unknown>()
  const listeners: Listener[] = []

  const set = async (items: Record<string, unknown>) => {
    const changes: Record<string, { newValue?: unknown }> = {}
    for (const [k, v] of Object.entries(items)) {
      session.set(k, v)
      changes[k] = { newValue: v }
    }
    listeners.forEach(l => l(changes, 'session'))
  }

  return {
    storage: {
      session: {
        get: async (keys: string | string[]) => {
          const list = Array.isArray(keys) ? keys : [keys]
          const out: Record<string, unknown> = {}
          for (const k of list) if (session.has(k)) out[k] = session.get(k)
          return out
        },
        set,
        remove: async (keys: string | string[]) => {
          for (const k of Array.isArray(keys) ? keys : [keys]) session.delete(k)
        },
      },
      onChanged: {
        addListener: (l: Listener) => listeners.push(l),
        removeListener: (l: Listener) => {
          const i = listeners.indexOf(l)
          if (i >= 0) listeners.splice(i, 1)
        },
      },
    },
    runtime: { getURL: (p: string) => `chrome-extension://test/${p}` },
    windows: {
      getCurrent: async () => ({ left: 0, top: 0, width: 1200 }),
      // Stands in for the user acting on the approval popup.
      create: async () => {
        const pending = session.get('pendingApproval') as { id: string }
        queueMicrotask(() => {
          void set({
            approvalResult: { id: pending.id, approved: autoApprove },
          })
        })
        return { id: 1 }
      },
      onRemoved: {
        addListener: () => {},
        removeListener: () => {},
      },
    },
  }
}

/** Mirrors what `wallet-context` does when the user picks another account. */
async function selectAccount(address: string, walletId: string) {
  await chrome.storage.session.set({
    dappAddress: address,
    dappAccountName: walletId,
    dappWalletId: walletId,
  })
}

const signed: { walletId?: string; fromAddress?: string } = {}

beforeEach(async () => {
  autoApprove = true
  vi.stubGlobal('chrome', createChromeMock())
  vi.stubGlobal('api', {
    wallet: {
      account: {
        ethereum: {
          signMessage: async (input: {
            walletId: string
            fromAddress: string
          }) => {
            Object.assign(signed, input)
            return { signature: '0xsig' }
          },
        },
      },
    },
  })
  await storage.clear('local')
  await storage.clear('session')
  await storage.setItem(
    'local:vault:metadata',
    JSON.stringify({
      [WALLET_ID]: {
        id: WALLET_ID,
        name: 'Wallet 1',
        type: 'mnemonic',
        accounts: [{ address: ADDRESS }],
        selectedAccountAddress: ADDRESS,
      },
      [OTHER_WALLET_ID]: {
        id: OTHER_WALLET_ID,
        name: 'Wallet 2',
        type: 'mnemonic',
        accounts: [{ address: OTHER_ADDRESS }],
        selectedAccountAddress: OTHER_ADDRESS,
      },
    }),
  )
  // The account the wallet exposes to dApps.
  await selectAccount(ADDRESS, WALLET_ID)
})

afterEach(async () => {
  await storage.clear('local')
  await storage.clear('session')
  vi.unstubAllGlobals()
})

const connect = () => handleRpcRequest('eth_requestAccounts', [], ORIGIN)
const accounts = () => handleRpcRequest('eth_accounts', [], ORIGIN)

test('approving a connection returns the account', async () => {
  await expect(connect()).resolves.toEqual([ADDRESS])
})

test('the grant survives a dApp reload', async () => {
  await connect()

  expect(await accounts()).toEqual([ADDRESS])
})

test('a second eth_requestAccounts does not prompt again', async () => {
  await connect()

  // If this opened a popup it would be rejected, since autoApprove is off.
  autoApprove = false
  await expect(connect()).resolves.toEqual([ADDRESS])
})

test('an unconnected origin gets no accounts', async () => {
  expect(
    await handleRpcRequest('eth_accounts', [], 'https://evil.test'),
  ).toEqual([])
})

test('an explicit revoke disconnects', async () => {
  await connect()
  await handleRpcRequest(
    'wallet_revokePermissions',
    [{ eth_accounts: {} }],
    ORIGIN,
  )

  expect(await accounts()).toEqual([])
})

describe('switching accounts in the wallet', () => {
  test('an unconnected account is not exposed to the dApp', async () => {
    await connect()
    await selectAccount(OTHER_ADDRESS, OTHER_WALLET_ID)

    expect(await accounts()).toEqual([ADDRESS])
  })

  test('eth_requestAccounts agrees with eth_accounts after a switch', async () => {
    await connect()
    await selectAccount(OTHER_ADDRESS, OTHER_WALLET_ID)

    // A dApp that re-requests on mount must not be handed the other account.
    autoApprove = false
    expect(await connect()).toEqual([ADDRESS])
  })

  test('a previously connected account is exposed again once selected', async () => {
    await connect()
    await selectAccount(OTHER_ADDRESS, OTHER_WALLET_ID)
    await connectAccount(ORIGIN, OTHER_ADDRESS)

    expect(await accounts()).toEqual([OTHER_ADDRESS])

    await selectAccountForOrigin(ORIGIN, ADDRESS)
    expect(await accounts()).toEqual([ADDRESS])
  })

  test('each origin keeps its own account', async () => {
    await connect()
    await selectAccount(OTHER_ADDRESS, OTHER_WALLET_ID)
    await handleRpcRequest('eth_requestAccounts', [], OTHER_ORIGIN)

    expect(await accounts()).toEqual([ADDRESS])
    expect(await handleRpcRequest('eth_accounts', [], OTHER_ORIGIN)).toEqual([
      OTHER_ADDRESS,
    ])
  })
})

describe('personal_sign follows the origin, not the wallet selection', () => {
  test('signs with the connected account and its wallet', async () => {
    await connect()
    await selectAccount(OTHER_ADDRESS, OTHER_WALLET_ID)

    await handleRpcRequest('personal_sign', ['0xdeadbeef', ADDRESS], ORIGIN)

    expect(signed).toMatchObject({
      walletId: WALLET_ID,
      fromAddress: ADDRESS,
    })
  })

  // Without the pinning it signed with the newly selected account while the
  // dApp believed it had asked for -- and received -- the connected one.
  test('rejects a request for the account the dApp cannot see', async () => {
    await connect()
    await selectAccount(OTHER_ADDRESS, OTHER_WALLET_ID)

    await expect(
      handleRpcRequest('personal_sign', ['0xdeadbeef', OTHER_ADDRESS], ORIGIN),
    ).rejects.toMatchObject({ code: -32602 })
  })

  test('an unconnected origin cannot sign', async () => {
    await expect(
      handleRpcRequest('personal_sign', ['0xdeadbeef'], 'https://evil.test'),
    ).rejects.toMatchObject({ code: 4100 })
  })
})

describe('records predating per-account tracking', () => {
  test('adopt the active account once, then hold it', async () => {
    await grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY)

    expect(await accounts()).toEqual([ADDRESS])

    await selectAccount(OTHER_ADDRESS, OTHER_WALLET_ID)
    expect(await accounts()).toEqual([ADDRESS])
  })
})
