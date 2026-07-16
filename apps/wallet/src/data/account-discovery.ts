import { getRpcProxyUrl } from '../lib/rpc-proxy'
import { deriveAccounts } from './derive'

import type { WalletAccount } from './wallet-metadata'
import type { WalletCore } from '@trustwallet/wallet-core'

// Stop scanning once this many consecutive addresses show no on-chain
// activity (BIP-44 address gap limit).
export const ACCOUNT_DISCOVERY_GAP_LIMIT = 20

// Upper bound on scanned indices so wallets with very long runs of active
// addresses (e.g. widely-known test mnemonics) still finish in bounded time.
export const ACCOUNT_DISCOVERY_MAX_INDEX = 100

// note: rpc.proxy expects a plain JSON-RPC body with chainId as a query
// param; tRPC-formatted POST bodies are rejected by the API route handler
async function rpcCall(method: string, params: unknown[]): Promise<unknown> {
  const response = await fetch(getRpcProxyUrl(1), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to query RPC proxy: ${response.status}`)
  }

  const body = (await response.json()) as {
    result?: unknown
    error?: { message: string }
  }

  if (body.error) {
    throw new Error(body.error.message)
  }

  return body.result
}

export type DiscoveredAccount = WalletAccount & { active: boolean }

// An address counts as active when it sent at least one transaction or holds
// a balance; the balance covers addresses with only incoming transfers, which
// eth_getTransactionCount does not reflect.
export async function hasActivity(address: string): Promise<boolean> {
  const [transactionCount, balance] = await Promise.all([
    rpcCall('eth_getTransactionCount', [address, 'latest']),
    rpcCall('eth_getBalance', [address, 'latest']),
  ])

  return (
    BigInt((transactionCount as string | null) ?? 0) > 0n ||
    BigInt((balance as string | null) ?? 0) > 0n
  )
}

/**
 * Derives the Ethereum accounts of a mnemonic that have on-chain activity.
 *
 * Account 0 is always included. Subsequent indices are scanned until
 * `gapLimit` consecutive addresses show no activity (up to `maxIndex`);
 * addresses within a gap are skipped, active ones past a gap are included.
 *
 * Discovery is best effort: when activity checks fail (e.g. the RPC proxy is
 * unreachable) the accounts found so far are returned instead of failing the
 * import.
 */
export async function discoverAccounts({
  walletCore,
  mnemonic,
  gapLimit = ACCOUNT_DISCOVERY_GAP_LIMIT,
  maxIndex = ACCOUNT_DISCOVERY_MAX_INDEX,
  isAddressActive = hasActivity,
}: {
  walletCore: WalletCore
  mnemonic: string
  gapLimit?: number
  maxIndex?: number
  isAddressActive?: (address: string) => Promise<boolean>
}): Promise<DiscoveredAccount[]> {
  const derive = (indices: number[]) =>
    deriveAccounts(
      walletCore,
      mnemonic,
      walletCore.CoinType.ethereum,
      walletCore.Derivation.default,
      indices,
    )

  const [firstAccount] = derive([0])
  // Account 0 is imported regardless of activity; its check runs alongside
  // the scan and only informs the UI, not the gap counting.
  const firstActive = isAddressActive(firstAccount.address).catch(() => false)
  const accounts: DiscoveredAccount[] = []

  try {
    let index = 1
    let inactiveStreak = 0
    while (inactiveStreak < gapLimit && index <= maxIndex) {
      // Check in parallel only as many addresses as could exhaust the gap.
      const batch = derive(
        Array.from(
          { length: Math.min(gapLimit - inactiveStreak, maxIndex - index + 1) },
          (_, i) => index + i,
        ),
      )
      const activity = await Promise.all(
        batch.map(account => isAddressActive(account.address)),
      )
      for (const [i, active] of activity.entries()) {
        if (active) {
          accounts.push({ ...batch[i], active: true })
          inactiveStreak = 0
        } else {
          inactiveStreak++
        }
      }
      index += batch.length
    }
  } catch (error) {
    console.warn('account discovery stopped early:', error)
  }

  return [{ ...firstAccount, active: await firstActive }, ...accounts]
}
