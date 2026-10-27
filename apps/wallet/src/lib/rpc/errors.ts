import { ProviderRpcError } from '@status-im/ethereum-provider'

/**
 * The wording is status-go's `ErrDAppIsNotPermittedByUser`, asserted verbatim by
 * `tests-functional/tests/test_status_connector.py`. It is kept for reference
 * parity only -- nothing client-side reacts to it.
 */
export function notPermitted(): ProviderRpcError {
  return new ProviderRpcError({
    code: 4100,
    message: 'dApp is not permitted by user',
  })
}

/** Mirrors status-go `CallRPC`'s fallthrough for methods in neither table. */
export function methodNotAllowed(method: string): ProviderRpcError {
  return new ProviderRpcError({
    code: -32601,
    message: `method ${method} is not allowed`,
  })
}

/**
 * Distinct from `notPermitted`: the origin *is* permitted but its pinned
 * account no longer resolves -- the wallet holding it was deleted. Collapsing
 * the two would report the permission as missing when it is not.
 */
export function noConnectedAccount(): ProviderRpcError {
  return new ProviderRpcError({
    code: 4100,
    message: 'No connected account',
  })
}
