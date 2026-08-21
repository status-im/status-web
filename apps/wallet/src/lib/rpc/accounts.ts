import { ProviderRpcError } from '@status-im/ethereum-provider'

import { getPendingApproval } from '../../data/approval'
import {
  connectAccount,
  debugLog,
  getChainIdForOrigin,
} from '../../data/dapp-permissions'
import { getAccountName, getAddress, getOriginAddress } from './account'
import { requestApproval } from './request-approval'

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

  const existing = await getPendingApproval()
  if (existing) {
    throw new ProviderRpcError({
      code: -32002,
      message: 'Already processing a connection request.',
    })
  }

  const chainId = await getChainIdForOrigin(origin)
  const accountName = await getAccountName()
  const connectResult = await requestApproval({
    type: 'eth_requestAccounts',
    origin,
    title: metadata?.title ?? origin,
    favicon: metadata?.favicon ?? `${origin}/favicon.ico`,
    address,
    accountName,
    chainId,
  })

  if (!connectResult) {
    throw new ProviderRpcError({
      code: 4001,
      message: 'User rejected the request.',
    })
  }

  await connectAccount(origin, address)
  void debugLog('granted', { origin, address })
  return [address]
}

export async function eth_accounts({ origin }: RpcContext): Promise<string[]> {
  const address = await getOriginAddress(origin)
  return address ? [address] : []
}
