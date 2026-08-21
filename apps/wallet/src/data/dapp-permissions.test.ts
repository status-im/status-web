import { storage } from '@wxt-dev/storage'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

import {
  adoptSelectedAddress,
  connectAccount,
  DAPP_PERMISSIONS_KEY,
  ETH_ACCOUNTS_CAPABILITY,
  getChainIdForOrigin,
  getConnectedAccounts,
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
  await storage.clear('local')
  await storage.clear('session')
})

describe('grants', () => {
  test('an origin is not permitted until eth_accounts is granted', async () => {
    expect(await isOriginPermitted(ORIGIN)).toBe(false)
    expect(await getPermissions(ORIGIN)).toEqual([])

    await grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY)

    expect(await isOriginPermitted(ORIGIN)).toBe(true)
    expect(await getPermissions(ORIGIN)).toEqual([
      { parentCapability: ETH_ACCOUNTS_CAPABILITY, caveats: [] },
    ])
  })

  test('a non-eth_accounts capability alone does not connect an origin', async () => {
    await grantPermission(ORIGIN, 'endowment:permitted-chains')

    expect(await isOriginPermitted(ORIGIN)).toBe(false)
    expect(await getPermittedOrigins()).toEqual([])
  })

  test('re-granting a capability replaces it rather than duplicating', async () => {
    await grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY, [
      { type: 'restrictReturnedAccounts', value: ['0x1'] },
    ])
    await grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY, [])

    expect(await getPermissions(ORIGIN)).toEqual([
      { parentCapability: ETH_ACCOUNTS_CAPABILITY, caveats: [] },
    ])
  })

  test('revoking removes the origin entirely', async () => {
    await grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY)
    await revokeOrigin(ORIGIN)

    expect(await isOriginPermitted(ORIGIN)).toBe(false)
    expect((await readStore()).origins).toEqual({})
  })

  test('revoking an unknown origin is a no-op', async () => {
    await grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY)
    await revokeOrigin(OTHER_ORIGIN)

    expect(await isOriginPermitted(ORIGIN)).toBe(true)
  })

  test('concurrent grants for different origins do not clobber each other', async () => {
    await Promise.all([
      grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY),
      grantPermission(OTHER_ORIGIN, ETH_ACCOUNTS_CAPABILITY),
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

describe('adopting records written before per-account tracking', () => {
  test('an accountless record pins to the account it was showing', async () => {
    await grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY)

    expect(await adoptSelectedAddress(ORIGIN, ACCOUNT_A)).toBe(ACCOUNT_A)
    expect(await getConnectedAccounts(ORIGIN)).toEqual([ACCOUNT_A])
  })

  test('adoption cannot move an origin that already has an account', async () => {
    await connectAccount(ORIGIN, ACCOUNT_A)

    expect(await adoptSelectedAddress(ORIGIN, ACCOUNT_B)).toBe(ACCOUNT_A)
    expect(await getConnectedAccounts(ORIGIN)).toEqual([ACCOUNT_A])
  })

  test('adoption does not create a record for an unknown origin', async () => {
    await adoptSelectedAddress(OTHER_ORIGIN, ACCOUNT_A)

    expect(await isOriginPermitted(OTHER_ORIGIN)).toBe(false)
  })

  // Regression: the approval popup persisted the grant with `grantPermission`,
  // leaving no account on the record. Adoption would then pin the dApp to
  // whichever account the wallet had selected, which need not be the approved
  // one -- exactly the drift per-account tracking exists to prevent.
  test('a grant carrying no account is adoptable by any account', async () => {
    await grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY)

    expect(await adoptSelectedAddress(ORIGIN, ACCOUNT_B)).toBe(ACCOUNT_B)

    // Whereas connecting records the account up front and pins it.
    await revokeOrigin(OTHER_ORIGIN)
    await connectAccount(OTHER_ORIGIN, ACCOUNT_A)
    expect(await adoptSelectedAddress(OTHER_ORIGIN, ACCOUNT_B)).toBe(ACCOUNT_A)
  })
})

describe('origin normalization', () => {
  test('trailing slashes and case do not create a second key', async () => {
    expect(normalizeOrigin('https://App.Uniswap.org/')).toBe(ORIGIN)

    await grantPermission('https://App.Uniswap.org/', ETH_ACCOUNTS_CAPABILITY)

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
    await grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY)
    await setChainIdForOrigin(ORIGIN, '0x6300b5ea')

    expect(await isOriginPermitted(ORIGIN)).toBe(true)
  })
})

describe('a grant is dropped only by an explicit request', () => {
  // Regression: the store used to record the granting account and revoke
  // everything when it changed. wallet-context resolves `currentWallet` to
  // `wallets[0]` until the persisted selection hydrates, so every extension
  // page load briefly reported the wrong account and wiped all connections.
  test('the store holds no account identity to invalidate against', async () => {
    await grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY)

    expect(await readStore()).toEqual({
      version: 2,
      origins: {
        [ORIGIN]: {
          permissions: [
            { parentCapability: ETH_ACCOUNTS_CAPABILITY, caveats: [] },
          ],
          accounts: [],
          selectedAddress: null,
          chainId: '0x1',
          grantedAt: expect.any(Number),
        },
      },
    })
  })

  test('unrelated writes never drop an existing grant', async () => {
    await grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY)

    await setChainIdForOrigin(ORIGIN, '0x6300b5ea')
    await grantPermission(OTHER_ORIGIN, ETH_ACCOUNTS_CAPABILITY)
    await setChainIdForOrigin(OTHER_ORIGIN, '0x1')
    await revokeOrigin(OTHER_ORIGIN)

    expect(await isOriginPermitted(ORIGIN)).toBe(true)
    expect(await getChainIdForOrigin(ORIGIN)).toBe('0x6300b5ea')
  })

  test('reads are pure -- repeated reads cannot revoke', async () => {
    await grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY)

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

    await grantPermission(ORIGIN, ETH_ACCOUNTS_CAPABILITY)
    await revokeOrigin(ORIGIN)
    unwatch()
    await grantPermission(OTHER_ORIGIN, ETH_ACCOUNTS_CAPABILITY)

    expect(seen).toEqual([[ORIGIN], []])
  })
})

describe('legacy migration', () => {
  test('adopts session connectedOrigins as eth_accounts grants', async () => {
    await storage.setItem('session:connectedOrigins', [ORIGIN, OTHER_ORIGIN])
    await storage.setItem('session:originChainIds', { [ORIGIN]: '0x6300b5ea' })

    expect(await isOriginPermitted(ORIGIN)).toBe(true)
    expect(await isOriginPermitted(OTHER_ORIGIN)).toBe(true)
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
