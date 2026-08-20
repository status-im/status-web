import { ProviderRpcError } from '@status-im/ethereum-provider'

import {
  type Caveat,
  ETH_ACCOUNTS_CAPABILITY,
  getOriginRecord,
  grantPermission,
  isOriginPermitted,
  normalizeOrigin,
  type Permission,
} from '../../data/dapp-permissions'
import { disconnectDapp } from '../dapp-events'
import { getAddress, getOriginAddress } from './account'

import type { RpcContext } from './context'

/** EIP-2255 shape. status-go's `persistence.Permission` carries `Invoker`. */
type PermissionResponse = Permission & { invoker: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Mirrors `RPCRequest.getRequestPermissionsParam` in status-go
 * `commands/request_permissions.go`: `params[0]` is a single-key map of
 * `{ methodName: caveats }`. A non-map caveats value is not an error there --
 * it degrades to no caveats.
 */
function parseRequestPermissionsParam(params: unknown): {
  methodName: string
  caveats: Caveat[]
} {
  const first = Array.isArray(params) ? params[0] : undefined

  if (!isRecord(first)) {
    throw new ProviderRpcError({
      code: -32602,
      message: 'invalid parameter type',
    })
  }

  const entries = Object.entries(first)
  if (entries.length > 1) {
    throw new ProviderRpcError({
      code: -32602,
      message: 'multiple methodNames found in request permissions params',
    })
  }

  const entry = entries[0]
  if (!entry) {
    throw new ProviderRpcError({
      code: -32602,
      message: 'no request permission params found',
    })
  }

  const [methodName, caveatsValue] = entry
  const caveats = isRecord(caveatsValue)
    ? Object.entries(caveatsValue).map(([type, value]) => ({ type, value }))
    : []

  return { methodName, caveats }
}

/**
 * EIP-2255. Deliberately does not prompt -- the origin must already be
 * connected, matching `commands/request_permissions.go`, which returns
 * `ErrDAppNotFound` rather than raising a popup.
 */
export async function wallet_requestPermissions({
  params,
  origin,
}: RpcContext): Promise<PermissionResponse[]> {
  const { methodName, caveats } = parseRequestPermissionsParam(params)

  // The dispatch gate does not cover this method, because the error has to be
  // status-go's distinct ErrDAppNotFound rather than the parity string.
  //
  // Permitted, not merely present: `setChainIdForOrigin` creates a bare record
  // for any origin that switched chains, and records written before that call
  // was gated outlive the upgrade. Accepting those would let a page the user
  // never approved grant itself `eth_accounts` with no popup. status-go's
  // `SelectDApp` likewise returns a permitted dApp, not any row.
  if (!(await isOriginPermitted(origin))) {
    throw new ProviderRpcError({
      code: 4100,
      message: 'dApp not found; permission not persisted',
    })
  }

  // Safe only because the origin is already permitted, so the record exists
  // with its accounts intact: `grantPermission` on a fresh origin would create
  // one with no account, which then adopts whichever the wallet has selected.
  await grantPermission(origin, methodName, caveats)

  return [
    { invoker: normalizeOrigin(origin), parentCapability: methodName, caveats },
  ]
}

/**
 * EIP-2255. Reachable before connection, returning `[]` -- `get_permissions.go`
 * answers unconditionally too.
 *
 * `restrictReturnedAccounts` is derived here rather than stored: the record's
 * `accounts` lists every account ever connected to the origin, while
 * `eth_accounts` returns only the pinned one. Advertising the former would
 * claim access the wallet will never grant.
 */
export async function wallet_getPermissions({
  origin,
}: RpcContext): Promise<PermissionResponse[]> {
  const record = await getOriginRecord(origin)
  if (!record) return []

  const exposed = await getOriginAddress(origin)
  const invoker = normalizeOrigin(origin)

  return record.permissions.map(permission => ({
    invoker,
    parentCapability: permission.parentCapability,
    caveats:
      permission.parentCapability === ETH_ACCOUNTS_CAPABILITY
        ? [
            {
              type: 'restrictReturnedAccounts',
              value: exposed ? [exposed] : [],
            },
          ]
        : permission.caveats,
  }))
}

/**
 * EIP-2255. Notifies as well as revokes: the calling page keeps the account it
 * was handed until something tells it otherwise, and other tabs on the same
 * origin never saw the request at all.
 */
export async function wallet_revokePermissions({
  origin,
}: RpcContext): Promise<null> {
  await disconnectDapp(origin)
  return null
}

export async function wallet_getCapabilities({
  params,
}: RpcContext): Promise<Record<string, Record<string, unknown>>> {
  const p = (params as unknown[]) || []
  const addr = (p[0] as string) || (await getAddress())
  if (!addr) return {}
  const chainIds = (p[1] as string[]) || ['0x1']
  const capabilities: Record<string, Record<string, unknown>> = {}
  for (const chainId of chainIds) {
    capabilities[chainId] = {
      atomicBatch: { supported: false },
    }
  }
  return capabilities
}
