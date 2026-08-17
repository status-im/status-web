import { storage } from '@wxt-dev/storage'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import {
  connectAccount,
  ETH_ACCOUNTS_CAPABILITY,
  getPermissions,
  grantPermission,
  selectAccountForOrigin,
  setChainIdForOrigin,
} from '../data/dapp-permissions'
import { publicClient } from './public-client'
import { handleRpcRequest, LOCAL_HANDLERS } from './rpc-handler'
import { REMOTE_ALLOWED, UNGATED_LOCAL } from './rpc-methods'

// The forwarding branch is the point of the gate, so it needs a stand-in for
// the node. The real client is a module-level const over the authenticated
// proxy URL.
vi.mock('./public-client', () => ({
  publicClient: { request: vi.fn(async () => '0x1234') },
}))

const nodeRequest = vi.mocked(publicClient.request)

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

/** Popups the handler opened, counted by the mock's `windows.create`. */
let popupsOpened = 0

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
        popupsOpened++
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
  popupsOpened = 0
  nodeRequest.mockClear()
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

// Regression: the -32002 guard read the stored approval asynchronously, so two
// requests in the same tick both saw an empty slot and each opened a popup.
// They then overwrote each other's record and one window was left showing a
// request that no longer existed -- a blank approval popup.
test('concurrent connect requests open a single popup', async () => {
  const [first, second] = await Promise.allSettled([connect(), connect()])

  expect(popupsOpened).toBe(1)
  expect([first.status, second.status].sort()).toEqual([
    'fulfilled',
    'rejected',
  ])
  const rejected = [first, second].find(r => r.status === 'rejected')
  expect((rejected as PromiseRejectedResult).reason).toMatchObject({
    code: -32002,
  })
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

// Ported from status-go @384a179
// tests-functional/tests/test_status_connector.py
describe('the status-go permission table', () => {
  const UNCONNECTED = 'https://evil.test'

  describe('before connection', () => {
    test.each([
      ['eth_blockNumber', []],
      ['eth_getBalance', [ADDRESS, 'latest']],
      ['eth_getTransactionCount', [ADDRESS, 'latest']],
      ['eth_call', [{ to: ADDRESS }, 'latest']],
      ['eth_estimateGas', [{ to: ADDRESS }]],
      ['eth_getTransactionReceipt', ['0xdeadbeef']],
      ['eth_sendTransaction', [{ from: ADDRESS, to: ADDRESS }]],
      ['wallet_switchEthereumChain', [{ chainId: '0x1' }]],
    ])('%s is refused', async (method, params) => {
      await expect(
        handleRpcRequest(method, params, UNCONNECTED),
      ).rejects.toMatchObject({
        code: 4100,
        message: 'dApp is not permitted by user',
      })
    })

    test('a refused method never reaches the node', async () => {
      await expect(
        handleRpcRequest('eth_blockNumber', [], UNCONNECTED),
      ).rejects.toThrow()

      expect(nodeRequest).not.toHaveBeenCalled()
    })

    test('eth_chainId resolves', async () => {
      expect(await handleRpcRequest('eth_chainId', [], UNCONNECTED)).toBe('0x1')
    })

    test('net_version resolves', async () => {
      expect(await handleRpcRequest('net_version', [], UNCONNECTED)).toBe('1')
    })

    test('eth_accounts is empty', async () => {
      expect(await handleRpcRequest('eth_accounts', [], UNCONNECTED)).toEqual(
        [],
      )
    })

    test('wallet_getPermissions is empty', async () => {
      expect(
        await handleRpcRequest('wallet_getPermissions', [], UNCONNECTED),
      ).toEqual([])
    })
  })

  describe('after connection', () => {
    test('an allowlisted method reaches the node unchanged', async () => {
      await connect()

      expect(await handleRpcRequest('eth_blockNumber', [], ORIGIN)).toBe(
        '0x1234',
      )
      expect(nodeRequest).toHaveBeenCalledWith({
        method: 'eth_blockNumber',
        params: [],
      })
    })

    test('a method off the allowlist is still refused', async () => {
      await connect()

      // Reaches the proxy today; status-go does not list it.
      await expect(
        handleRpcRequest('eth_getProof', [], ORIGIN),
      ).rejects.toMatchObject({ code: -32601 })
      expect(nodeRequest).not.toHaveBeenCalled()
    })
  })

  // status-go's own unknown-method case: connector_callRPC must not become a
  // way to reach status-go service methods.
  test('an unknown method is refused by name', async () => {
    await connect()

    await expect(
      handleRpcRequest('wakuext_joinedCommunities', [], ORIGIN),
    ).rejects.toMatchObject({
      code: -32601,
      message: 'method wakuext_joinedCommunities is not allowed',
    })
  })
})

describe('the method tables', () => {
  test('no method is both local and forwarded', () => {
    const both = Object.keys(LOCAL_HANDLERS).filter(m => REMOTE_ALLOWED.has(m))

    expect(both).toEqual([])
  })

  test('every ungated method has a local handler', () => {
    const orphans = [...UNGATED_LOCAL].filter(m => !(m in LOCAL_HANDLERS))

    expect(orphans).toEqual([])
  })
})

describe('wallet_getPermissions', () => {
  test('reports the pinned account, not every account ever connected', async () => {
    await connect()
    await connectAccount(ORIGIN, OTHER_ADDRESS)
    await selectAccountForOrigin(ORIGIN, ADDRESS)

    const permissions = (await handleRpcRequest(
      'wallet_getPermissions',
      [],
      ORIGIN,
    )) as Array<{ parentCapability: string; caveats: unknown[] }>

    expect(permissions).toEqual([
      {
        invoker: ORIGIN,
        parentCapability: ETH_ACCOUNTS_CAPABILITY,
        // eth_accounts returns exactly this, so the caveat must not claim the
        // dApp may see OTHER_ADDRESS as well.
        caveats: [{ type: 'restrictReturnedAccounts', value: [ADDRESS] }],
      },
    ])
  })
})

describe('wallet_requestPermissions', () => {
  const request = (params: unknown, origin = ORIGIN) =>
    handleRpcRequest('wallet_requestPermissions', params, origin)

  test('persists the requested capability and echoes it', async () => {
    await connect()

    await expect(
      request([{ eth_accounts: { requiredMethods: ['personal_sign'] } }]),
    ).resolves.toEqual([
      {
        invoker: ORIGIN,
        parentCapability: 'eth_accounts',
        caveats: [{ type: 'requiredMethods', value: ['personal_sign'] }],
      },
    ])

    expect(await getPermissions(ORIGIN)).toEqual([
      {
        parentCapability: 'eth_accounts',
        caveats: [{ type: 'requiredMethods', value: ['personal_sign'] }],
      },
    ])
  })

  test('a non-object caveats value means no caveats, not an error', async () => {
    await connect()

    await expect(request([{ eth_accounts: {} }])).resolves.toMatchObject([
      { parentCapability: 'eth_accounts', caveats: [] },
    ])
  })

  test.each([
    ['no params', []],
    ['a non-object param', ['eth_accounts']],
    ['two capabilities', [{ eth_accounts: {}, eth_chainId: {} }]],
  ])('rejects %s', async (_label, params) => {
    await connect()

    await expect(request(params)).rejects.toMatchObject({ code: -32602 })
  })

  // status-go's ErrDAppNotFound, deliberately distinct from the generic
  // refusal so the diagnostics say which of the two happened.
  test('an unconnected origin is refused and nothing is written', async () => {
    await expect(
      request([{ eth_accounts: {} }], 'https://evil.test'),
    ).rejects.toMatchObject({
      code: 4100,
      message: 'dApp not found; permission not persisted',
    })

    expect(await getPermissions('https://evil.test')).toEqual([])
  })

  // Regression: guarding on "the origin has a record" rather than "the origin
  // is permitted" was an escalation. setChainIdForOrigin creates a bare record
  // for any origin that switched chains, and wallet_switchEthereumChain was
  // ungated before this PR -- so such records survive the upgrade. The origin
  // could then grant itself eth_accounts with no approval popup.
  test('an origin with a record but no grant cannot grant itself one', async () => {
    await setChainIdForOrigin(ORIGIN, '0x1')

    await expect(request([{ eth_accounts: {} }])).rejects.toMatchObject({
      code: 4100,
      message: 'dApp not found; permission not persisted',
    })

    expect(await accounts()).toEqual([])
  })
})

describe('personal_sign distinguishes its two failures', () => {
  test('an unpermitted origin is a permission problem', async () => {
    await expect(
      handleRpcRequest('personal_sign', ['0xdeadbeef'], 'https://evil.test'),
    ).rejects.toMatchObject({
      code: 4100,
      message: 'dApp is not permitted by user',
    })
  })

  // A permitted origin whose pinned account no longer resolves -- the wallet
  // holding it was deleted. Reporting this as "not permitted" would be false.
  test('a permitted origin with no resolvable account is not', async () => {
    await grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY)
    await storage.removeItem('local:vault:metadata')
    await chrome.storage.session.remove([
      'dappAddress',
      'dappAccountName',
      'dappWalletId',
    ])

    await expect(
      handleRpcRequest('personal_sign', ['0xdeadbeef'], ORIGIN),
    ).rejects.toMatchObject({
      code: 4100,
      message: 'No connected account',
    })
  })
})
