import { storage } from '@wxt-dev/storage'

import {
  adoptSelectedAddress,
  getSelectedAddress,
  isOriginPermitted,
  isSameAddress,
} from '../../data/dapp-permissions'
import * as walletMetadata from '../../data/wallet-metadata'
import { SELECTED_WALLET_ID_KEY } from '../storage-keys'

export const DEFAULT_ACCOUNT_NAME = 'Account 1'

type ActiveAccount = {
  address: string
  accountName: string
  walletId: string
}

/**
 * The account exposed to dApps.
 *
 * The extension page mirrors its selection into session storage, but that is
 * empty after a browser restart until the page is opened. Permissions live in
 * `local` and outlast it, so fall back to wallet metadata -- otherwise a still
 * permitted dApp would be told there is no account. Mirrors the selection rule
 * in `wallet-context.tsx`.
 */
export async function getActiveAccount(): Promise<ActiveAccount | null> {
  const session = await chrome.storage.session.get([
    'dappAddress',
    'dappAccountName',
    'dappWalletId',
  ])

  if (session.dappAddress && session.dappWalletId) {
    return {
      address: session.dappAddress as string,
      accountName: (session.dappAccountName as string) || DEFAULT_ACCOUNT_NAME,
      walletId: session.dappWalletId as string,
    }
  }

  const wallets = await walletMetadata.getAll()
  const selectedId = await storage.getItem<string>(SELECTED_WALLET_ID_KEY)
  const wallet = wallets.find(w => w.id === selectedId) ?? wallets[0]
  if (!wallet) return null

  const account =
    wallet.accounts.find(a => a.address === wallet.selectedAccountAddress) ??
    wallet.accounts[0]
  if (!account) return null

  return {
    address: account.address,
    accountName: wallet.name || DEFAULT_ACCOUNT_NAME,
    walletId: wallet.id,
  }
}

export async function getAddress(): Promise<string | null> {
  return (await getActiveAccount())?.address ?? null
}

export async function getAccountName(): Promise<string> {
  return (await getActiveAccount())?.accountName ?? DEFAULT_ACCOUNT_NAME
}

/**
 * The account this origin sees, which is not necessarily the wallet's current
 * selection: switching to an account the user never connected here must leave
 * the dApp on the one it was connected with.
 *
 * Every dApp-facing read and signature resolves through this -- reading the
 * pinned account for `eth_accounts` while signing with the selected one would
 * hand the dApp a signature from an account it was never shown.
 */
export async function getOriginAddress(origin: string): Promise<string | null> {
  if (!(await isOriginPermitted(origin))) {
    return null
  }

  const selected = await getSelectedAddress(origin)
  if (selected) {
    return selected
  }

  // Connected before per-account tracking existed: the account it has been
  // showing is the active one, so pin it there once.
  const active = await getAddress()
  return active ? await adoptSelectedAddress(origin, active) : null
}

/**
 * Locates the wallet holding `address`, across all wallets -- the account a dApp
 * is pinned to may not belong to the currently selected wallet.
 */
export async function findWalletForAddress(
  address: string,
): Promise<{ walletId: string; accountName: string } | null> {
  const wallets = await walletMetadata.getAll()
  const wallet = wallets.find(w =>
    w.accounts.some(account => isSameAddress(account.address, address)),
  )
  if (!wallet) return null

  return {
    walletId: wallet.id,
    accountName: wallet.name || DEFAULT_ACCOUNT_NAME,
  }
}
