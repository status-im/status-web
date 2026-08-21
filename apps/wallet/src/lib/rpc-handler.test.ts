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

type PushedEvent = {
  tabId: number
  message: { type: string; event: string; data: unknown }
}

/** EIP-1193 events the handler pushed at the dApp's tabs. */
let pushedToTabs: PushedEvent[] = []

function createChromeMock() {
  const session = new Map<string, unknown>()
  const listeners: Listener[] = []
  pushedToTabs = []

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
    // Wallet-initiated events reach the page through the bridge content script.
    tabs: {
      query: async () => [
        { id: 1, url: `${ORIGIN}/swap` },
        { id: 2, url: `${OTHER_ORIGIN}/` },
      ],
      sendMessage: async (tabId: number, message: PushedEvent['message']) => {
        pushedToTabs.push({ tabId, message })
      },
    },
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
let signedTypedData: Record<string, unknown> | null = null

beforeEach(async () => {
  autoApprove = true
  popupsOpened = 0
  signedTypedData = null
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
          signTypedData: async (input: Record<string, unknown>) => {
            signedTypedData = input
            return { signature: '0xtypedsig' }
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

// The page that revoked, and every other tab on the origin, keep showing the
// account until told otherwise -- the wallet's own Disconnect action pushes
// this event, and the RPC path must not be the one that skips it.
test('an explicit revoke tells the origin its accounts are gone', async () => {
  await connect()
  await handleRpcRequest(
    'wallet_revokePermissions',
    [{ eth_accounts: {} }],
    ORIGIN,
  )

  expect(pushedToTabs).toEqual([
    {
      tabId: 1,
      message: { type: 'status:event', event: 'accountsChanged', data: [] },
    },
  ])
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

  test('keeps the caveats the dApp asked for alongside the derived one', async () => {
    await connect()
    await handleRpcRequest(
      'wallet_requestPermissions',
      [
        {
          eth_accounts: {
            requiredMethods: ['personal_sign'],
            // A dApp-written value for the derived caveat must not survive.
            restrictReturnedAccounts: [OTHER_ADDRESS],
          },
        },
      ],
      ORIGIN,
    )

    await expect(
      handleRpcRequest('wallet_getPermissions', [], ORIGIN),
    ).resolves.toEqual([
      {
        invoker: ORIGIN,
        parentCapability: ETH_ACCOUNTS_CAPABILITY,
        caveats: [
          { type: 'requiredMethods', value: ['personal_sign'] },
          { type: 'restrictReturnedAccounts', value: [ADDRESS] },
        ],
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

const TYPED_DATA = {
  domain: {
    name: 'Permit2',
    version: '1',
    chainId: 1,
    verifyingContract: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
  },
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    Permit: [
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
  },
  primaryType: 'Permit',
  message: { spender: OTHER_ADDRESS, value: '1000' },
}

const signTypedData = (address: unknown, typedData: unknown, origin = ORIGIN) =>
  handleRpcRequest('eth_signTypedData_v4', [address, typedData], origin)

/** `TYPED_DATA` with a replaced domain, still valid everywhere else. */
const withDomain = (domain: Record<string, unknown>) =>
  JSON.stringify({ ...TYPED_DATA, domain })

describe('eth_signTypedData_v4', () => {
  test('signs with the account the origin is pinned to', async () => {
    await connect()
    await selectAccount(OTHER_ADDRESS, OTHER_WALLET_ID)

    await expect(
      signTypedData(ADDRESS, JSON.stringify(TYPED_DATA)),
    ).resolves.toBe('0xtypedsig')
    expect(signedTypedData).toMatchObject({
      walletId: WALLET_ID,
      fromAddress: ADDRESS,
      primaryType: 'Permit',
    })
  })

  // Most dApps stringify, wagmi and viem pass the object through.
  test('accepts the payload as an object as well as a string', async () => {
    await connect()

    await expect(signTypedData(ADDRESS, TYPED_DATA)).resolves.toBe('0xtypedsig')
  })

  test('rejects a request for the account the dApp cannot see', async () => {
    await connect()
    await selectAccount(OTHER_ADDRESS, OTHER_WALLET_ID)

    await expect(
      signTypedData(OTHER_ADDRESS, JSON.stringify(TYPED_DATA)),
    ).rejects.toMatchObject({ code: -32602 })
  })

  test('an unconnected origin cannot sign', async () => {
    await expect(
      signTypedData(ADDRESS, JSON.stringify(TYPED_DATA), 'https://evil.test'),
    ).rejects.toMatchObject({
      code: 4100,
      message: 'dApp is not permitted by user',
    })
    expect(popupsOpened).toBe(0)
  })

  test('the user declining is a rejection, not a signature', async () => {
    await connect()
    autoApprove = false

    await expect(
      signTypedData(ADDRESS, JSON.stringify(TYPED_DATA)),
    ).rejects.toMatchObject({ code: 4001 })
    expect(signedTypedData).toBeNull()
  })

  test('a second request while one is pending is refused', async () => {
    await connect()

    const [first, second] = await Promise.allSettled([
      signTypedData(ADDRESS, JSON.stringify(TYPED_DATA)),
      signTypedData(ADDRESS, JSON.stringify(TYPED_DATA)),
    ])

    expect([first.status, second.status].sort()).toEqual([
      'fulfilled',
      'rejected',
    ])
    const rejected = [first, second].find(r => r.status === 'rejected')
    expect((rejected as PromiseRejectedResult).reason).toMatchObject({
      code: -32002,
    })
  })
})

// status-go `commands/sign.go` takes the address first and the payload second,
// the opposite of `personal_sign`. Sniffing which argument looks like an
// address would paper over a dApp that has them the wrong way round -- and
// hand it a signature over whatever it did send.
describe('the swapped parameter order', () => {
  test('eth_signTypedData_v4 takes the address first', async () => {
    await connect()
    popupsOpened = 0

    await expect(
      signTypedData(JSON.stringify(TYPED_DATA), ADDRESS),
    ).rejects.toMatchObject({
      code: -32602,
      message: expect.stringContaining('expects the address as the first'),
    })
    expect(popupsOpened).toBe(0)
  })

  test('personal_sign takes the message first', async () => {
    await connect()

    await expect(
      handleRpcRequest('personal_sign', ['0xdeadbeef', ADDRESS], ORIGIN),
    ).resolves.toBe('0xsig')
  })
})

// Everything here would otherwise surface as an opaque -32603 from zod or
// viem, after the user had already been shown a popup.
describe('malformed typed data is refused before the popup', () => {
  beforeEach(async () => {
    await connect()
    popupsOpened = 0
  })

  const refuses = async (typedData: unknown) => {
    await expect(signTypedData(ADDRESS, typedData)).rejects.toMatchObject({
      code: -32602,
    })
    expect(popupsOpened).toBe(0)
  }

  test('a payload that is not JSON', () => refuses('{ not json'))

  test('a payload that is not an object', () => refuses('"a string"'))

  test('a missing primaryType', () =>
    refuses(JSON.stringify({ ...TYPED_DATA, primaryType: undefined })))

  test('a primaryType absent from types', () =>
    refuses(JSON.stringify({ ...TYPED_DATA, primaryType: 'Nope' })))

  test('a missing message', () =>
    refuses(JSON.stringify({ ...TYPED_DATA, message: undefined })))

  test('types that are not {name, type} lists', () =>
    refuses(JSON.stringify({ ...TYPED_DATA, types: { Permit: 'nope' } })))

  test('a payload too large to hold in session storage', () =>
    refuses(
      JSON.stringify({
        ...TYPED_DATA,
        message: { spender: OTHER_ADDRESS, value: 'x'.repeat(200_000) },
      }),
    ))
})

// Not a status-go check. The domain is the only place the payload names the
// chain it binds to, and dApps spell the value three different ways.
describe('the domain chain', () => {
  beforeEach(() => connect())

  test('a number matching the origin chain is accepted', () =>
    expect(signTypedData(ADDRESS, withDomain({ chainId: 1 }))).resolves.toBe(
      '0xtypedsig',
    ))

  test('a hex string matching the origin chain is accepted', () =>
    expect(
      signTypedData(ADDRESS, withDomain({ chainId: '0x1' })),
    ).resolves.toBe('0xtypedsig'))

  test('a decimal string matching the origin chain is accepted', () =>
    expect(signTypedData(ADDRESS, withDomain({ chainId: '1' }))).resolves.toBe(
      '0xtypedsig',
    ))

  // EIP-712 makes every domain field optional and plenty of dApps omit this
  // one, so an absent chain must not become a refusal.
  test('an absent chain is not checked', () =>
    expect(
      signTypedData(ADDRESS, withDomain({ name: 'snapshot' })),
    ).resolves.toBe('0xtypedsig'))

  // Most dApps never declare EIP712Domain; viem derives it from the keys the
  // domain carries, so a chainId sitting there is signed and the check applies.
  test('an undeclared EIP712Domain leaves the chain signed', () =>
    expect(
      signTypedData(
        ADDRESS,
        JSON.stringify({
          ...TYPED_DATA,
          domain: { chainId: 1 },
          types: { Permit: TYPED_DATA.types.Permit },
        }),
      ),
    ).resolves.toBe('0xtypedsig'))

  // A chainId the dApp leaves out of its own EIP712Domain is not in the
  // separator: the check above would pass on a signature bound to no chain.
  test('a chain the payload does not sign is refused', async () => {
    await expect(
      signTypedData(
        ADDRESS,
        JSON.stringify({
          ...TYPED_DATA,
          domain: { chainId: 1 },
          types: {
            ...TYPED_DATA.types,
            EIP712Domain: [{ name: 'name', type: 'string' }],
          },
        }),
      ),
    ).rejects.toMatchObject({ code: -32602 })
    expect(signedTypedData).toBeNull()
  })

  test('a chain other than the one the origin is on is refused', async () => {
    await expect(
      signTypedData(ADDRESS, withDomain({ chainId: 137 })),
    ).rejects.toMatchObject({ code: -32602 })
    expect(signedTypedData).toBeNull()
  })

  test('the origin chain is the switched-to one, not mainnet', async () => {
    await handleRpcRequest(
      'wallet_switchEthereumChain',
      [{ chainId: '0x6300b5ea' }],
      ORIGIN,
    )

    await expect(
      signTypedData(ADDRESS, withDomain({ chainId: 1 })),
    ).rejects.toMatchObject({ code: -32602 })
    await expect(
      signTypedData(ADDRESS, withDomain({ chainId: 0x6300b5ea })),
    ).resolves.toBe('0xtypedsig')
  })
})
