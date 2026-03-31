export { Provider, ProviderRpcError } from './provider'
export type { ProviderEvent } from './provider'
export { default as statusIcon } from './status-icon'
export {
  RequestArguments,
  ProviderMessage,
  ProxyMessage,
} from './messages'

export interface EIP6963ProviderInfo {
  uuid: string
  name: string
  icon: string
  rdns: string
}

/**
 * @see https://eips.ethereum.org/EIPS/eip-6963
 */
export function announceProvider(
  provider: unknown,
  info: EIP6963ProviderInfo,
): void {
  window.dispatchEvent(
    new CustomEvent('eip6963:announceProvider', {
      detail: Object.freeze({ info, provider }),
    }),
  )
}

export function listenForProviderRequests(
  provider: unknown,
  info: EIP6963ProviderInfo,
): void {
  window.addEventListener('eip6963:requestProvider', () => {
    announceProvider(provider, info)
  })
}

export function injectProvider(
  provider: unknown,
  options?: { configurable?: boolean },
): void {
  const { configurable = true } = options ?? {}
  try {
    Object.defineProperties(window, {
      ethereum: {
        get() {
          return provider
        },
        configurable,
      },
    })
  } catch {
    console.debug(
      '[Status] window.ethereum already defined by another extension',
    )
  }
}
