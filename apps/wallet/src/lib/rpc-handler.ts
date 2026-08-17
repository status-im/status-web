import { debugLog, isOriginPermitted } from '../data/dapp-permissions'
import { publicClient } from './public-client'
import { getAddress } from './rpc/account'
import { eth_accounts, eth_requestAccounts } from './rpc/accounts'
import {
  eth_chainId,
  net_version,
  wallet_addEthereumChain,
  wallet_switchEthereumChain,
} from './rpc/chain'
import { methodNotAllowed, notPermitted } from './rpc/errors'
import {
  wallet_getCapabilities,
  wallet_getPermissions,
  wallet_requestPermissions,
  wallet_revokePermissions,
} from './rpc/permissions'
import { eth_sendTransaction } from './rpc/send-transaction'
import { eth_signTypedData_v4, personal_sign } from './rpc/sign'
import { REMOTE_ALLOWED, UNGATED_LOCAL } from './rpc-methods'

import type { LocalHandler, RpcContext } from './rpc/context'

/**
 * The methods the wallet answers itself, as opposed to forwarding upstream.
 * Mirrors status-go's `CommandRegistry` in `services/connector/api.go`.
 *
 * This map is the registry -- there is no parallel list of case labels to keep
 * in sync with it.
 *
 * Exported so tests can assert it against the tables in `rpc-methods.ts`.
 */
export const LOCAL_HANDLERS: Record<string, LocalHandler> = {
  eth_requestAccounts,
  eth_accounts,
  eth_chainId,
  net_version,
  wallet_switchEthereumChain,
  wallet_addEthereumChain,
  wallet_requestPermissions,
  wallet_getPermissions,
  wallet_revokePermissions,
  wallet_getCapabilities,
  personal_sign,
  eth_signTypedData_v4,
  eth_sendTransaction,
}

/** Methods whose traffic `debugLog` records when `local:dapp:debug` is set. */
const DEBUG_LOGGED_METHODS = new Set([
  'eth_accounts',
  'eth_requestAccounts',
  'wallet_requestPermissions',
])

/**
 * Handle an EIP-1193 RPC request from a dApp.
 * Runs in the background service worker context.
 *
 * Dispatch order mirrors status-go's `CallRPC`, and is observable through the
 * errors: local registry, then the remote allowlist, then refusal. Everything
 * outside `UNGATED_LOCAL` requires the user to have connected the origin,
 * including the forwarded reads -- an unapproved page must not be able to
 * spend the wallet's authenticated proxy quota.
 */
export async function handleRpcRequest(
  method: string,
  params: unknown,
  origin: string,
  metadata?: { title?: string; favicon?: string },
): Promise<unknown> {
  if (DEBUG_LOGGED_METHODS.has(method)) {
    void debugLog(method, {
      origin,
      permitted: await isOriginPermitted(origin),
      address: await getAddress(),
    })
  }

  const ctx: RpcContext = { method, params, origin, metadata }

  const local = LOCAL_HANDLERS[method]
  if (local) {
    if (!UNGATED_LOCAL.has(method) && !(await isOriginPermitted(origin))) {
      throw notPermitted()
    }
    return await local(ctx)
  }

  if (REMOTE_ALLOWED.has(method)) {
    if (!(await isOriginPermitted(origin))) {
      throw notPermitted()
    }
    return await publicClient.request({
      method: method as never,
      params: params as never,
    })
  }

  console.warn(`[status:dapp] rejected ${method} from ${origin}`)
  throw methodNotAllowed(method)
}
