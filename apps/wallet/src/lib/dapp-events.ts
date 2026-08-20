import {
  connectAccount,
  getPermittedOrigins,
  normalizeOrigin,
  revokeOrigin,
  selectAccountForOrigin,
} from '../data/dapp-permissions'

/**
 * Wallet-initiated EIP-1193 events.
 *
 * Every other dApp interaction is page-initiated: the provider opens a
 * `MessageChannel` and the service worker answers on it. An account switch has
 * no such request to answer, so it is pushed the other way --
 * `chrome.tabs.sendMessage` to the bridge content script, which re-posts it to
 * the page for the provider to emit. Without this a dApp only notices the new
 * account on reload.
 */
export type DappEventMessage = {
  type: 'status:event'
  event: 'accountsChanged'
  data: unknown
}

function originOf(url: string | undefined): string | null {
  if (!url) return null
  try {
    return normalizeOrigin(new URL(url).origin)
  } catch {
    return null
  }
}

async function broadcast(origin: string, message: DappEventMessage) {
  const key = normalizeOrigin(origin)
  // Best-effort throughout: `wallet_revokePermissions` notifies after the
  // permission is already gone, so a failure here must not surface as a failed
  // revoke.
  const tabs = await chrome.tabs.query({}).catch(() => [])

  await Promise.all(
    tabs.map(tab => {
      if (tab.id === undefined || originOf(tab.url) !== key) {
        return
      }
      // Tabs loaded before the extension, discarded tabs, and privileged pages
      // have no bridge listening. Nothing to do about it here.
      return chrome.tabs.sendMessage(tab.id, message).catch(() => {})
    }),
  )
}

export function notifyAccountsChanged(
  origin: string,
  accounts: string[],
): Promise<void> {
  return broadcast(origin, {
    type: 'status:event',
    event: 'accountsChanged',
    data: accounts,
  })
}

/**
 * Re-points every dApp already connected to `address` at it, and tells them.
 *
 * Origins that have never been connected to this account are deliberately left
 * on the account they were connected with -- the user gets a Connect action in
 * the wallet instead. Call this only from a deliberate account or wallet
 * switch, never from a storage watcher: the extension page writes its account
 * on mount before the persisted selection hydrates, so a watcher would re-point
 * dApps at whichever wallet happens to be first in the list.
 */
export async function syncAccountToDapps(address: string): Promise<void> {
  const origins = await getPermittedOrigins()

  await Promise.all(
    origins.map(async origin => {
      // Refused for any origin this account was never connected to, which is
      // what keeps the dApp on the account the user actually connected.
      if (!(await selectAccountForOrigin(origin, address))) return
      await notifyAccountsChanged(origin, [address])
    }),
  )
}

/** Connects `address` to a dApp from the wallet UI and switches it live. */
export async function connectAccountToDapp(
  origin: string,
  address: string,
): Promise<void> {
  await connectAccount(origin, address)
  await notifyAccountsChanged(origin, [address])
}

/**
 * Drops the grant and tells the page. The empty array is EIP-1193 for "logged
 * out". Both revoke paths go through here -- the wallet's Disconnect action and
 * `wallet_revokePermissions` -- so neither can leave a page showing an account
 * it no longer has.
 */
export async function disconnectDapp(origin: string): Promise<void> {
  await revokeOrigin(origin)
  await notifyAccountsChanged(origin, [])
}
