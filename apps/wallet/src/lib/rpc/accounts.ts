import { ProviderRpcError } from '@status-im/ethereum-provider'

import { debugLog, getChainIdForOrigin } from '../../data/dapp-permissions'
import {
  getAccountName,
  getAddress,
  getOriginAddress,
  requireWalletFor,
} from './account'
import { notPermitted } from './errors'
import { assertNoPendingApproval, requestApproval } from './request-approval'

import type { RpcContext } from './context'

export async function eth_requestAccounts({
  origin,
  metadata,
}: RpcContext): Promise<string[]> {
  // Answer from the origin's own account when it has one, or a dApp that
  // calls this on every mount would flip back to the wallet's selection
  // and contradict eth_accounts.
  const connected = await getOriginAddress(origin)
  if (connected) {
    return [connected]
  }

  const address = await getAddress()
  if (!address) {
    throw new ProviderRpcError({
      code: 4100,
      message: 'No active account',
    })
  }

  await assertNoPendingApproval(origin)

  const chainId = await getChainIdForOrigin(origin)
  const accountName = await getAccountName()
  const { walletType } = await requireWalletFor(address)
  const connectResult = await requestApproval({
    type: 'eth_requestAccounts',
    origin,
    title: metadata?.title ?? origin,
    favicon: metadata?.favicon ?? `${origin}/favicon.ico`,
    address,
    accountName,
    chainId,
    walletType,
  })

  if (!connectResult) {
    throw new ProviderRpcError({
      code: 4001,
      message: 'User rejected the request.',
    })
  }

  // The approval page persisted the connection before publishing its result.
  // Reconnecting here could undo a Disconnect that happened in the meantime.
  const approvedAddress = await getOriginAddress(origin)
  if (!approvedAddress) {
    throw notPermitted()
  }
  void debugLog('granted', { origin, address: approvedAddress })
  return [approvedAddress]
}

export async function eth_accounts({ origin }: RpcContext): Promise<string[]> {
  const address = await getOriginAddress(origin)
  return address ? [address] : []
}
