import { storage } from '@wxt-dev/storage'

/**
 * dApp connection permissions, modelled on EIP-2255 and on status-go's
 * `services/connector/database` so the wallet, desktop and mobile agree on what
 * a granted permission looks like.
 *
 * Stored in `local`: a connection is revoked only by an explicit request --
 * `wallet_revokePermissions` or the Disconnect action. Nothing else drops it,
 * not a page reload, a browser restart, locking, or switching accounts.
 */

export const DAPP_PERMISSIONS_KEY = 'local:dapp:permissions' as const

/** Capability granted by `eth_requestAccounts`; presence of it means "connected". */
export const ETH_ACCOUNTS_CAPABILITY = 'eth_accounts'

export const DEFAULT_CHAIN_ID = '0x1'

export type Caveat = {
  type: string
  value: unknown
}

export type Permission = {
  parentCapability: string
  caveats: Caveat[]
}

export type OriginRecord = {
  permissions: Permission[]
  /**
   * Every account the user has explicitly connected to this origin. Source of
   * truth for `eth_accounts`' `restrictReturnedAccounts` caveat, which is
   * derived from it rather than stored alongside it.
   */
  accounts: string[]
  /**
   * The single account this origin currently sees. Null until adopted, which
   * only happens for records predating per-account tracking.
   */
  selectedAddress: string | null
  chainId: string
  grantedAt: number
}

export type PermissionStore = {
  version: typeof STORE_VERSION
  origins: Record<string, OriginRecord>
}

const STORE_VERSION = 2

const EMPTY_STORE: PermissionStore = {
  version: STORE_VERSION,
  origins: {},
}

// Legacy session keys, superseded by DAPP_PERMISSIONS_KEY. Read once for
// migration, then removed.
const LEGACY_ORIGINS_KEY = 'session:connectedOrigins' as const
const LEGACY_CHAIN_IDS_KEY = 'session:originChainIds' as const

/**
 * Mirrors status-go's `persistence.NormalizeURL`: strip a trailing slash and
 * lowercase, so an origin can never be keyed two ways.
 */
export function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/+$/, '').toLowerCase()
}

/** Addresses are stored as given (checksummed) but always compared folded. */
export function isSameAddress(a: string | null, b: string | null): boolean {
  if (!a || !b) return false
  return a.toLowerCase() === b.toLowerCase()
}

/**
 * Fills in fields added after a record was written, in memory only -- a read
 * must never write, or a fresh install fires `watchPermissions` before
 * anything is connected. The upgraded shape persists on the next real write.
 */
function normalizeRecord(record: Partial<OriginRecord>): OriginRecord {
  return {
    permissions: record.permissions ?? [],
    accounts: record.accounts ?? [],
    selectedAddress: record.selectedAddress ?? null,
    chainId: record.chainId ?? DEFAULT_CHAIN_ID,
    grantedAt: record.grantedAt ?? Date.now(),
  }
}

// Serializes read-modify-write cycles so concurrent grants/revocations for
// different origins can't clobber each other. Per-context only -- the page and
// the service worker hold separate chains, so a simultaneous write from both
// can still race. chrome.storage offers no transaction to close that, and in
// practice the two never mutate permissions at the same moment.
let writeChain: Promise<unknown> = Promise.resolve()

function withStore<T>(
  mutate: (store: PermissionStore) => { store: PermissionStore; result: T },
): Promise<T> {
  const next = writeChain.then(async () => {
    const current = await readStore()
    const { store, result } = mutate(current)
    // Mutations that decline to change anything hand back the same object.
    // Writing it anyway would fire `watchPermissions` on every refused switch.
    if (store !== current) {
      await storage.setItem(DAPP_PERMISSIONS_KEY, store)
    }
    return result
  })
  // Keep the chain alive even if this link rejects.
  writeChain = next.catch(() => {})
  return next
}

/**
 * Adopts the pre-`local` session keys. Returns null -- and deliberately writes
 * nothing -- when there is nothing to migrate, so a fresh install neither
 * touches storage nor fires `watchPermissions` on the first read.
 */
async function migrateLegacyKeys(): Promise<PermissionStore | null> {
  const [origins, chainIds] = await Promise.all([
    storage.getItem<string[]>(LEGACY_ORIGINS_KEY),
    storage.getItem<Record<string, string>>(LEGACY_CHAIN_IDS_KEY),
  ])

  if (!origins?.length) {
    return null
  }

  const grantedAt = Date.now()
  const store: PermissionStore = {
    version: STORE_VERSION,
    origins: Object.fromEntries(
      origins.map(origin => [
        normalizeOrigin(origin),
        // The legacy keys carried no account identity, so these records adopt
        // the active account on first use -- see `adoptSelectedAddress`.
        normalizeRecord({
          permissions: [
            { parentCapability: ETH_ACCOUNTS_CAPABILITY, caveats: [] },
          ],
          chainId: chainIds?.[origin] ?? DEFAULT_CHAIN_ID,
          grantedAt,
        }),
      ]),
    ),
  }

  await storage.setItem(DAPP_PERMISSIONS_KEY, store)
  await storage.removeItems([LEGACY_ORIGINS_KEY, LEGACY_CHAIN_IDS_KEY])
  return store
}

export async function readStore(): Promise<PermissionStore> {
  const stored = await storage.getItem<PermissionStore>(DAPP_PERMISSIONS_KEY)
  if (!stored) {
    return (await migrateLegacyKeys()) ?? EMPTY_STORE
  }

  return {
    version: STORE_VERSION,
    origins: Object.fromEntries(
      Object.entries(stored.origins ?? {}).map(([origin, record]) => [
        origin,
        normalizeRecord(record),
      ]),
    ),
  }
}

/**
 * Diagnostics for dApp connection loss. Enable from the service-worker
 * console with `chrome.storage.local.set({ 'dapp:debug': true })`.
 */
async function debugEnabled(): Promise<boolean> {
  return (await storage.getItem<boolean>('local:dapp:debug')) === true
}

export async function debugLog(event: string, detail: unknown): Promise<void> {
  if (!(await debugEnabled())) return
  const store = await readStore()

  console.log(
    `[status:dapp] ${event}`,
    detail,
    'stored origins:',
    Object.keys(store.origins),
  )
}

export async function getOriginRecord(
  origin: string,
): Promise<OriginRecord | null> {
  const store = await readStore()
  return store.origins[normalizeOrigin(origin)] ?? null
}

/** An origin is connected once it holds the `eth_accounts` capability. */
export async function isOriginPermitted(origin: string): Promise<boolean> {
  const record = await getOriginRecord(origin)
  return (
    record?.permissions.some(
      permission => permission.parentCapability === ETH_ACCOUNTS_CAPABILITY,
    ) ?? false
  )
}

export async function getPermissions(origin: string): Promise<Permission[]> {
  const record = await getOriginRecord(origin)
  return record?.permissions ?? []
}

export async function getPermittedOrigins(): Promise<string[]> {
  const store = await readStore()
  return Object.entries(store.origins)
    .filter(([, record]) =>
      record.permissions.some(
        permission => permission.parentCapability === ETH_ACCOUNTS_CAPABILITY,
      ),
    )
    .map(([origin]) => origin)
}

/**
 * Grants `parentCapability` to `origin`, replacing any existing grant of the
 * same capability. Creates the origin record if this is the first grant.
 *
 * Not the way to connect an account -- the record it creates has no account, so
 * `eth_accounts` would fall back to adopting whichever one the wallet has
 * selected. Anything granting `eth_accounts` must call `connectAccount`.
 */
export function grantPermission(
  origin: string,
  parentCapability: string,
  caveats: Caveat[] = [],
): Promise<Permission> {
  const key = normalizeOrigin(origin)
  const permission: Permission = { parentCapability, caveats }

  return withStore(store => {
    const existing = normalizeRecord(store.origins[key] ?? {})
    const permissions = [
      ...existing.permissions.filter(
        p => p.parentCapability !== parentCapability,
      ),
      permission,
    ]

    return {
      store: {
        ...store,
        origins: { ...store.origins, [key]: { ...existing, permissions } },
      },
      result: permission,
    }
  })
}

/**
 * Connects `address` to `origin` and makes it the account the origin sees.
 *
 * The only way an account joins an origin's list, so a dApp can never be
 * handed an account the user did not deliberately connect to it. Called both
 * from the `eth_requestAccounts` approval and from the wallet's own Connect
 * action -- in the latter the click *is* the consent, so no popup is shown.
 */
export function connectAccount(origin: string, address: string): Promise<void> {
  const key = normalizeOrigin(origin)

  return withStore(store => {
    const existing = normalizeRecord(store.origins[key] ?? {})
    const accounts = existing.accounts.some(a => isSameAddress(a, address))
      ? existing.accounts
      : [...existing.accounts, address]
    const permissions = [
      ...existing.permissions.filter(
        p => p.parentCapability !== ETH_ACCOUNTS_CAPABILITY,
      ),
      { parentCapability: ETH_ACCOUNTS_CAPABILITY, caveats: [] },
    ]

    return {
      store: {
        ...store,
        origins: {
          ...store.origins,
          [key]: {
            ...existing,
            accounts,
            permissions,
            selectedAddress: address,
          },
        },
      },
      result: undefined,
    }
  })
}

export async function getConnectedAccounts(origin: string): Promise<string[]> {
  return (await getOriginRecord(origin))?.accounts ?? []
}

export async function isAccountConnected(
  origin: string,
  address: string,
): Promise<boolean> {
  const accounts = await getConnectedAccounts(origin)
  return accounts.some(a => isSameAddress(a, address))
}

export async function getSelectedAddress(
  origin: string,
): Promise<string | null> {
  return (await getOriginRecord(origin))?.selectedAddress ?? null
}

/**
 * Points `origin` at an account it is already connected to. Refuses otherwise:
 * switching accounts in the wallet must not silently expose a new account to a
 * dApp the user never connected it to.
 *
 * Returns whether the origin's account actually changed, so the caller only
 * emits `accountsChanged` when there is something to report.
 */
export function selectAccountForOrigin(
  origin: string,
  address: string,
): Promise<boolean> {
  const key = normalizeOrigin(origin)

  return withStore(store => {
    const existing = store.origins[key]
    if (
      !existing ||
      !existing.accounts.some(a => isSameAddress(a, address)) ||
      isSameAddress(existing.selectedAddress, address)
    ) {
      return { store, result: false }
    }

    return {
      store: {
        ...store,
        origins: {
          ...store.origins,
          [key]: { ...existing, selectedAddress: address },
        },
      },
      result: true,
    }
  })
}

/**
 * Pins a record that predates per-account tracking to `address`, which is the
 * account it has been showing all along. Idempotent and one-way: once a record
 * has a selected address nothing here can move it, so the fallback can never
 * become a path for drifting a dApp onto the wallet's current selection.
 */
export function adoptSelectedAddress(
  origin: string,
  address: string,
): Promise<string> {
  const key = normalizeOrigin(origin)

  return withStore(store => {
    const existing = store.origins[key]
    if (!existing) {
      return { store, result: address }
    }
    if (existing.selectedAddress) {
      return { store, result: existing.selectedAddress }
    }

    return {
      store: {
        ...store,
        origins: {
          ...store.origins,
          [key]: {
            ...existing,
            accounts: existing.accounts.length ? existing.accounts : [address],
            selectedAddress: address,
          },
        },
      },
      result: address,
    }
  })
}

export function revokeOrigin(origin: string): Promise<void> {
  const key = normalizeOrigin(origin)
  void debugLog('revoke', { origin, stack: new Error('revoke').stack })

  return withStore(store => {
    if (!(key in store.origins)) {
      return { store, result: undefined }
    }

    const origins = { ...store.origins }
    delete origins[key]
    return { store: { ...store, origins }, result: undefined }
  })
}

export async function getChainIdForOrigin(origin: string): Promise<string> {
  const record = await getOriginRecord(origin)
  return record?.chainId ?? DEFAULT_CHAIN_ID
}

export function setChainIdForOrigin(
  origin: string,
  chainId: string,
): Promise<void> {
  const key = normalizeOrigin(origin)

  return withStore(store => {
    const existing = normalizeRecord(store.origins[key] ?? {})
    return {
      store: {
        ...store,
        origins: { ...store.origins, [key]: { ...existing, chainId } },
      },
      result: undefined,
    }
  })
}

export function watchPermissions(
  callback: (store: PermissionStore) => void,
): () => void {
  return storage.watch<PermissionStore>(DAPP_PERMISSIONS_KEY, value => {
    callback(value ?? EMPTY_STORE)
  })
}
