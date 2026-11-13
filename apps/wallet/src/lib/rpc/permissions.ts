import { ProviderRpcError } from '@status-im/ethereum-provider'
import { isAddress } from 'viem'

import {
  type Caveat,
  ETH_ACCOUNTS_CAPABILITY,
  getOriginRecord,
  grantPermission,
  normalizeOrigin,
  type Permission,
} from '../../data/dapp-permissions'
import { disconnectDapp } from '../dapp-events'
import { getAddress, getOriginAddress } from './account'

import type { RpcContext } from './context'

/** EIP-2255 shape. status-go's `persistence.Permission` carries `Invoker`. */
type PermissionResponse = Permission & { invoker: string }

const RESTRICT_RETURNED_ACCOUNTS = 'restrictReturnedAccounts'

/** Bounds a `restrictReturnedAccounts` request; it is validated, never stored. */
const MAX_RESTRICTED_ACCOUNTS = 100

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Mirrors `RPCRequest.getRequestPermissionsParam` in status-go
 * `commands/request_permissions.go`: `params[0]` is a single-key map of
 * `{ methodName: caveats }`. A non-map caveats value is not an error there --
 * it degrades to no caveats. Stricter than status-go about what is accepted:
 * the payload is dApp-controlled and would otherwise be persisted unbounded.
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
  // Unlike status-go, only the capability the wallet implements is accepted,
  // so a dApp cannot persist arbitrary names.
  if (methodName !== ETH_ACCOUNTS_CAPABILITY) {
    throw new ProviderRpcError({
      code: 4200,
      message: `Unsupported permission ${methodName.slice(0, 64)}`,
    })
  }

  if (isRecord(caveatsValue)) {
    for (const [type, value] of Object.entries(caveatsValue)) {
      if (type !== RESTRICT_RETURNED_ACCOUNTS) {
        throw new ProviderRpcError({
          code: -32602,
          message: `unsupported caveat ${type.slice(0, 64)}`,
        })
      }
      if (
        !Array.isArray(value) ||
        value.length > MAX_RESTRICTED_ACCOUNTS ||
        !value.every(
          account => typeof account === 'string' && isAddress(account),
        )
      ) {
        throw new ProviderRpcError({
          code: -32602,
          message: `invalid ${RESTRICT_RETURNED_ACCOUNTS} caveat`,
        })
      }
    }
  }

  // `restrictReturnedAccounts` is derived by `wallet_getPermissions`, so
  // nothing the dApp sent is worth storing.
  return { methodName, caveats: [] }
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

  // Check and persist together so a concurrent disconnect cannot be undone.
  // Preserve status-go's distinct ErrDAppNotFound response on refusal.
  if (!(await grantPermission(origin, methodName, caveats))) {
    throw new ProviderRpcError({
      code: 4100,
      message: 'dApp not found; permission not persisted',
    })
  }

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
 * claim access the wallet will never grant. Only that one caveat is derived --
 * anything else the dApp asked for through `wallet_requestPermissions` is
 * reported back as stored.
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
            // A stored `restrictReturnedAccounts` is dropped: a dApp can write
            // one through `wallet_requestPermissions`, and it must not shadow
            // the derived value.
            ...permission.caveats.filter(
              caveat => caveat.type !== RESTRICT_RETURNED_ACCOUNTS,
            ),
            {
              type: RESTRICT_RETURNED_ACCOUNTS,
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
