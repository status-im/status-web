import { storage } from '@wxt-dev/storage'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import {
  connectAccount,
  DAPP_PERMISSIONS_KEY,
  ETH_ACCOUNTS_CAPABILITY,
  getChainIdForOrigin,
  getConnectedAccounts,
  getOriginRecord,
  getPermissions,
  getPermittedOrigins,
  getSelectedAddress,
  grantPermission,
  isAccountConnected,
  isOriginPermitted,
  normalizeOrigin,
  type PermissionStore,
  readStore,
  revokeOrigin,
  selectAccountForOrigin,
  setChainIdForOrigin,
  watchPermissions,
} from './dapp-permissions'

const ORIGIN = 'https://app.uniswap.org'
const OTHER_ORIGIN = 'https://app.aave.com'
const ACCOUNT_A = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const ACCOUNT_B = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

beforeEach(async () => {
  await storage.clear('local')
  await storage.clear('session')
})

afterEach(async () => {
  vi.restoreAllMocks()
  await storage.clear('local')
  await storage.clear('session')
})

describe('grants', () => {
  test('an origin is not permitted until eth_accounts is granted', async () => {
    expect(await isOriginPermitted(ORIGIN)).toBe(false)
    expect(await getPermissions(ORIGIN)).toEqual([])

    await connectAccount(ORIGIN, ACCOUNT_A)

    expect(await isOriginPermitted(ORIGIN)).toBe(true)
    expect(await getPermissions(ORIGIN)).toEqual([
      { parentCapability: ETH_ACCOUNTS_CAPABILITY, caveats: [] },
    ])
  })

  test('an unconnected origin cannot grant itself any capability', async () => {
    expect(
      await grantPermission(ORIGIN, 'endowment:permitted-chains'),
    ).toBeNull()

    expect(await isOriginPermitted(ORIGIN)).toBe(false)
    expect(await getPermittedOrigins()).toEqual([])
  })

  test('a revoked origin cannot be recreated by a grant', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)
    await revokeOrigin(ORIGIN)
    const writes = vi.spyOn(storage, 'setItem')

    expect(await grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY)).toBeNull()
    expect(await getOriginRecord(ORIGIN)).toBeNull()
    expect(writes).not.toHaveBeenCalled()
  })

  test('a chain-only record cannot grant itself accounts', async () => {
    await setChainIdForOrigin(ORIGIN, '0xa')
    const before = await getOriginRecord(ORIGIN)

    expect(await grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY)).toBeNull()
    expect(await getOriginRecord(ORIGIN)).toEqual(before)
  })

  test('permission updates preserve connected accounts, selection and chain', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)
    await connectAccount(ORIGIN, ACCOUNT_B)
    await setChainIdForOrigin(ORIGIN, '0xa')
    const before = await getOriginRecord(ORIGIN)

    const permission = await grantPermission(
      'https://App.Uniswap.org/',
      'endowment:permitted-chains',
      [{ type: 'chains', value: ['0xa'] }],
    )

    expect(await getOriginRecord(ORIGIN)).toEqual({
      ...before,
      permissions: [...before!.permissions, permission],
    })
  })

  test('re-granting a capability replaces it rather than duplicating', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)
    await grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY, [
      { type: 'restrictReturnedAccounts', value: ['0x1'] },
    ])
    await grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY, [])

    expect(await getPermissions(ORIGIN)).toEqual([
      { parentCapability: ETH_ACCOUNTS_CAPABILITY, caveats: [] },
    ])
  })

  test('revoking removes the origin entirely', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)
    await revokeOrigin(ORIGIN)

    expect(await isOriginPermitted(ORIGIN)).toBe(false)
    expect((await readStore()).origins).toEqual({})
  })

  test('revoking an unknown origin is a no-op', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)
    await revokeOrigin(OTHER_ORIGIN)

    expect(await isOriginPermitted(ORIGIN)).toBe(true)
  })

  test('concurrent grants for different origins do not clobber each other', async () => {
    await Promise.all([
      connectAccount(ORIGIN, ACCOUNT_A),
      connectAccount(OTHER_ORIGIN, ACCOUNT_B),
    ])

    expect(await getPermittedOrigins()).toEqual(
      expect.arrayContaining([ORIGIN, OTHER_ORIGIN]),
    )
  })
})

describe('per-account connections', () => {
  test('connecting records the account and points the origin at it', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)

    expect(await isOriginPermitted(ORIGIN)).toBe(true)
    expect(await getConnectedAccounts(ORIGIN)).toEqual([ACCOUNT_A])
    expect(await getSelectedAddress(ORIGIN)).toBe(ACCOUNT_A)
    expect(await isAccountConnected(ORIGIN, ACCOUNT_B)).toBe(false)
  })

  test('connecting a second account keeps the first', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)
    await connectAccount(ORIGIN, ACCOUNT_B)

    expect(await getConnectedAccounts(ORIGIN)).toEqual([ACCOUNT_A, ACCOUNT_B])
    expect(await getSelectedAddress(ORIGIN)).toBe(ACCOUNT_B)
  })

  test('reconnecting the same account does not duplicate it', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)
    await connectAccount(ORIGIN, ACCOUNT_A.toLowerCase())

    expect(await getConnectedAccounts(ORIGIN)).toEqual([ACCOUNT_A])
  })

  test('accounts are tracked per origin', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)
    await connectAccount(OTHER_ORIGIN, ACCOUNT_B)

    expect(await getSelectedAddress(ORIGIN)).toBe(ACCOUNT_A)
    expect(await getSelectedAddress(OTHER_ORIGIN)).toBe(ACCOUNT_B)
  })
})

describe('switching the account an origin sees', () => {
  test('an origin cannot be switched to an unconnected account', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)

    expect(await selectAccountForOrigin(ORIGIN, ACCOUNT_B)).toBe(false)
    expect(await getSelectedAddress(ORIGIN)).toBe(ACCOUNT_A)
  })

  test('switching to a previously connected account is allowed', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)
    await connectAccount(ORIGIN, ACCOUNT_B)

    expect(await selectAccountForOrigin(ORIGIN, ACCOUNT_A)).toBe(true)
    expect(await getSelectedAddress(ORIGIN)).toBe(ACCOUNT_A)
  })

  test('selecting the account already shown reports no change', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)

    expect(await selectAccountForOrigin(ORIGIN, ACCOUNT_A.toLowerCase())).toBe(
      false,
    )
  })

  test('an unknown origin is never given an account', async () => {
    expect(await selectAccountForOrigin(OTHER_ORIGIN, ACCOUNT_A)).toBe(false)
    expect(await getSelectedAddress(OTHER_ORIGIN)).toBeNull()
  })
})

describe('grants without an approved account', () => {
  test('an accountless stored grant cannot expose a newly selected account', async () => {
    await storage.setItem(DAPP_PERMISSIONS_KEY, {
      version: 2,
      origins: {
        [ORIGIN]: {
          permissions: [
            { parentCapability: ETH_ACCOUNTS_CAPABILITY, caveats: [] },
          ],
          accounts: [],
          selectedAddress: null,
          chainId: '0xa',
          grantedAt: 123,
        },
      },
    })

    expect(await isOriginPermitted(ORIGIN)).toBe(false)
    expect(await grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY)).toBeNull()
    expect(await getPermissions(ORIGIN)).toEqual([])
    expect(await getChainIdForOrigin(ORIGIN)).toBe('0xa')
    await connectAccount(ORIGIN, ACCOUNT_A)
    expect(await getSelectedAddress(ORIGIN)).toBe(ACCOUNT_A)
    expect(await isOriginPermitted(ORIGIN)).toBe(true)
  })

  test('a selected address outside the approved account list loses its grant', async () => {
    await storage.setItem(DAPP_PERMISSIONS_KEY, {
      version: 2,
      origins: {
        [ORIGIN]: {
          permissions: [
            { parentCapability: ETH_ACCOUNTS_CAPABILITY, caveats: [] },
          ],
          accounts: [ACCOUNT_A],
          selectedAddress: ACCOUNT_B,
          chainId: '0x1',
          grantedAt: 123,
        },
      },
    })

    expect(await isOriginPermitted(ORIGIN)).toBe(false)
    expect(await getSelectedAddress(ORIGIN)).toBeNull()
  })
})

describe('origin normalization', () => {
  test('trailing slashes and case do not create a second key', async () => {
    expect(normalizeOrigin('https://App.Uniswap.org/')).toBe(ORIGIN)

    await connectAccount('https://App.Uniswap.org/', ACCOUNT_A)

    expect(await isOriginPermitted(ORIGIN)).toBe(true)
    expect(Object.keys((await readStore()).origins)).toEqual([ORIGIN])
  })
})

describe('per-origin chain', () => {
  test('defaults to mainnet and is stored per origin', async () => {
    expect(await getChainIdForOrigin(ORIGIN)).toBe('0x1')

    await setChainIdForOrigin(ORIGIN, '0x6300b5ea')

    expect(await getChainIdForOrigin(ORIGIN)).toBe('0x6300b5ea')
    expect(await getChainIdForOrigin(OTHER_ORIGIN)).toBe('0x1')
  })

  test('switching chains preserves an existing grant', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)
    await setChainIdForOrigin(ORIGIN, '0x6300b5ea')

    expect(await isOriginPermitted(ORIGIN)).toBe(true)
  })
})

describe('a grant is dropped only by an explicit request', () => {
  // Regression: the store used to record the granting account and revoke
  // everything when it changed. wallet-context resolves `currentWallet` to
  // `wallets[0]` until the persisted selection hydrates, so every extension
  // page load briefly reported the wrong account and wiped all connections.
  test('legacy origins without account identity require reconnection', async () => {
    await storage.setItem('session:connectedOrigins', [ORIGIN])

    expect(await readStore()).toEqual({
      version: 2,
      origins: {
        [ORIGIN]: {
          permissions: [],
          accounts: [],
          selectedAddress: null,
          chainId: '0x1',
          grantedAt: expect.any(Number),
        },
      },
    })
  })

  test('unrelated writes never drop an existing grant', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)

    await setChainIdForOrigin(ORIGIN, '0x6300b5ea')
    await connectAccount(OTHER_ORIGIN, ACCOUNT_B)
    await setChainIdForOrigin(OTHER_ORIGIN, '0x1')
    await revokeOrigin(OTHER_ORIGIN)

    expect(await isOriginPermitted(ORIGIN)).toBe(true)
    expect(await getChainIdForOrigin(ORIGIN)).toBe('0x6300b5ea')
  })

  test('reads are pure -- repeated reads cannot revoke', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)

    for (let i = 0; i < 5; i++) {
      await readStore()
      await isOriginPermitted(ORIGIN)
      await getPermittedOrigins()
      await getChainIdForOrigin(ORIGIN)
    }

    expect(await isOriginPermitted(ORIGIN)).toBe(true)
  })
})

describe('watchPermissions', () => {
  // The connected-dApps header has no other refresh mechanism.
  test('fires on grant and on revoke', async () => {
    const seen: string[][] = []
    const unwatch = watchPermissions(store => {
      seen.push(Object.keys(store.origins))
    })

    await connectAccount(ORIGIN, ACCOUNT_A)
    await revokeOrigin(ORIGIN)
    unwatch()
    await connectAccount(OTHER_ORIGIN, ACCOUNT_B)

    expect(seen).toEqual([[ORIGIN], []])
  })
})

describe('legacy migration', () => {
  test('keeps legacy chain settings without transferring account grants', async () => {
    await storage.setItem('session:connectedOrigins', [ORIGIN, OTHER_ORIGIN])
    await storage.setItem('session:originChainIds', { [ORIGIN]: '0x6300b5ea' })

    expect(await isOriginPermitted(ORIGIN)).toBe(false)
    expect(await isOriginPermitted(OTHER_ORIGIN)).toBe(false)
    expect(await getChainIdForOrigin(ORIGIN)).toBe('0x6300b5ea')
    expect(await getChainIdForOrigin(OTHER_ORIGIN)).toBe('0x1')
  })

  test('removes the legacy keys and does not run twice', async () => {
    await storage.setItem('session:connectedOrigins', [ORIGIN])
    await readStore()

    expect(await storage.getItem('session:connectedOrigins')).toBeNull()
    expect(await storage.getItem('session:originChainIds')).toBeNull()

    // A later revoke must not be undone by a second migration pass.
    await revokeOrigin(ORIGIN)
    expect(await isOriginPermitted(ORIGIN)).toBe(false)
  })

  test('with no legacy data it reads empty without writing', async () => {
    expect(await readStore()).toEqual({ version: 2, origins: {} })
    // A fresh install must not write on read, or watchPermissions fires
    // spuriously before anything is connected.
    expect(
      await storage.getItem<PermissionStore>(DAPP_PERMISSIONS_KEY),
    ).toBeNull()
  })
})

describe('writes from separate extension contexts', () => {
  test.each(['permission update', 'legacy migration'])(
    'a disconnect waits for an in-flight %s and remains final',
    async operation => {
      if (operation === 'legacy migration') {
        await storage.setItem('session:connectedOrigins', [ORIGIN])
      } else {
        await connectAccount(ORIGIN, ACCOUNT_A)
      }
      // A fresh module instance has its own module state, as an extension page
      // does relative to the service worker. Only the browser lock is shared.
      vi.resetModules()
      const otherContext = await import('./dapp-permissions')
      const entered = Promise.withResolvers<void>()
      const release = Promise.withResolvers<void>()
      const setItem = storage.setItem.bind(storage)
      vi.spyOn(storage, 'setItem').mockImplementationOnce(
        async (key, value) => {
          entered.resolve()
          await release.promise
          return setItem(key, value)
        },
      )

      const update =
        operation === 'legacy migration'
          ? readStore()
          : grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY)
      await entered.promise
      let disconnected = false
      const disconnect = otherContext.revokeOrigin(ORIGIN).then(() => {
        disconnected = true
      })
      try {
        // Let the other context run until it blocks on the shared lock.
        await new Promise(resolve => setTimeout(resolve, 0))
        expect(disconnected).toBe(false)
      } finally {
        release.resolve()
        await Promise.all([update, disconnect])
      }

      expect(await getOriginRecord(ORIGIN)).toBeNull()
    },
  )

  test('a permission update waits for an in-flight disconnect and is refused', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)
    vi.resetModules()
    const otherContext = await import('./dapp-permissions')
    const entered = Promise.withResolvers<void>()
    const release = Promise.withResolvers<void>()
    const setItem = storage.setItem.bind(storage)
    vi.spyOn(storage, 'setItem').mockImplementationOnce(async (key, value) => {
      entered.resolve()
      await release.promise
      return setItem(key, value)
    })

    const disconnect = revokeOrigin(ORIGIN)
    await entered.promise
    let updated = false
    const update = otherContext
      .grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY)
      .then(result => {
        updated = true
        return result
      })
    try {
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(updated).toBe(false)
    } finally {
      release.resolve()
      await disconnect
    }

    expect(await update).toBeNull()
    expect(await getOriginRecord(ORIGIN)).toBeNull()
  })

  test('a failed write releases the lock for a later disconnect', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)
    vi.spyOn(storage, 'setItem').mockRejectedValueOnce(
      new Error('Storage failed'),
    )

    await expect(
      grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY),
    ).rejects.toThrow('Storage failed')
    await revokeOrigin(ORIGIN)

    expect(await getOriginRecord(ORIGIN)).toBeNull()
  })
})
