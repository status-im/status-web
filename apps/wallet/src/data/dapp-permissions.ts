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
  /** The approved account this origin currently sees. */
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
  const accounts = record.accounts ?? []
  const selectedAddress = record.selectedAddress ?? null
  // Older grants stored no account. They cannot prove which account was
  // approved, so retain their chain setting but require a new connection.
  const approved = accounts.some(account =>
    isSameAddress(account, selectedAddress),
  )
  const permissions = record.permissions ?? []
  return {
    permissions: approved ? permissions : [],
    accounts,
    selectedAddress: approved ? selectedAddress : null,
    chainId: record.chainId ?? DEFAULT_CHAIN_ID,
    grantedAt: record.grantedAt ?? Date.now(),
  }
}

// The extension pages and service worker share this lock. A per-context promise
// queue cannot prevent a stale write from restoring a connection another
// context has just revoked.
async function withStore<T>(
  mutate: (store: PermissionStore) => { store: PermissionStore; result: T },
): Promise<T> {
  return navigator.locks.request(DAPP_PERMISSIONS_KEY, async () => {
    const current = await readStoreUnlocked()
    const { store, result } = mutate(current)
    // Mutations that decline to change anything hand back the same object.
    // Writing it anyway would fire `watchPermissions` on every refused switch.
    if (store !== current) {
      await storage.setItem(DAPP_PERMISSIONS_KEY, store)
    }
    return result
  })
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

  const store: PermissionStore = {
    version: STORE_VERSION,
    origins: Object.fromEntries(
      origins.map(origin => [
        normalizeOrigin(origin),
        // The legacy keys carried no approved account identity. Preserve the
        // chain preference, but require explicit approval before reconnecting.
        normalizeRecord({
          chainId: chainIds?.[origin] ?? DEFAULT_CHAIN_ID,
        }),
      ]),
    ),
  }

  await storage.setItem(DAPP_PERMISSIONS_KEY, store)
  await storage.removeItems([LEGACY_ORIGINS_KEY, LEGACY_CHAIN_IDS_KEY])
  return store
}

// Call only while holding the store lock: legacy migration can write on read.
async function readStoreUnlocked(): Promise<PermissionStore> {
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

export async function readStore(): Promise<PermissionStore> {
  return navigator.locks.request(DAPP_PERMISSIONS_KEY, readStoreUnlocked)
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
 * Updates a connected origin's permission, checking the connection under the
 * same lock as the write. Returns null if it has been revoked or was never
 * approved. New connections must go through `connectAccount`.
 */
export function grantPermission(
  origin: string,
  parentCapability: string,
  caveats: Caveat[] = [],
): Promise<Permission | null> {
  const key = normalizeOrigin(origin)
  const permission: Permission = { parentCapability, caveats }

  return withStore<Permission | null>(store => {
    const existing = store.origins[key]
    if (
      !existing?.permissions.some(
        p => p.parentCapability === ETH_ACCOUNTS_CAPABILITY,
      )
    ) {
      return { store, result: null }
    }
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
