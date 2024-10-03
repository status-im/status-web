import { getFaviconUrl } from '~lib/get-favicon-url'
import { ProviderMessage } from '~messages/provider-message'

import { DesktopClient } from '../lib/desktop-client'

import type { ProxyMessage } from '~messages/proxy-message'
import type { EthersError } from 'ethers'
import type { PlasmoCSConfig } from 'plasmo'

export const config: PlasmoCSConfig = {
  run_at: 'document_start',
}

const desktopClient = new DesktopClient()

const handleMessage = async (event: MessageEvent) => {
  if (event.origin !== window.origin) {
    return
  }

  let message: ProviderMessage
  try {
    message = ProviderMessage.parse(event.data)
  } catch {
    return
  }

  if (message.type === 'status:provider:disconnect') {
    desktopClient.stop()
    return
  }

  if (message.type !== 'status:provider') {
    return
  }

  if (!event.ports.length) {
    return
  }

  try {
    console.log('request::', message.data)

    const response = await desktopClient.send({
      ...message.data,
      name: window.location.hostname,
      url: window.origin,
      iconUrl: getFaviconUrl() ?? '',
    })

    console.log('response::', response)

    event.ports[0].postMessage({
      type: 'status:proxy:success',
      data: response,
    } satisfies ProxyMessage)
  } catch (error) {
    let proxyError = {
      code: -32603,
      message: isError(error) ? error.message : 'Internal error',
    }

    /**
     * ethers.js library has a custom error detection mechanism.
     * - Detected errors are stored in the `info` object:
     *   @see https://github.com/ethers-io/ethers.js/blob/72c2182d01afa855d131e82635dca3da063cfb31/src.ts/providers/provider-jsonrpc.ts#L976-L1057
     * - Undetected errors are stored in the `error` field:
     *   @see https://github.com/ethers-io/ethers.js/blob/72c2182d01afa855d131e82635dca3da063cfb31/src.ts/providers/provider-jsonrpc.ts#L1059
     */
    if (isEthersError(error)) {
      if (isRpcError(error.error)) {
        proxyError = error.error
      } else if (isRpcError(error.info?.error)) {
        proxyError = error.info.error
      }
    }

    const proxyMessage: ProxyMessage = {
      type: 'status:proxy:error',
      error: proxyError,
    }

    event.ports[0].postMessage(proxyMessage)
  }
}

function isError(error: unknown): error is Error {
  return !!error && typeof error === 'object' && 'message' in error
}

function isEthersError(error: unknown): error is EthersError & {
  info?: { error?: { code: number; message: string } }
} {
  return (
    !!error &&
    typeof error === 'object' &&
    'error' in error &&
    error.error !== null &&
    typeof error.error === 'object' &&
    'code' in error.error
  )
}

function isRpcError(
  error: unknown,
): error is { code: number; message: string } {
  return (
    !!error &&
    typeof error === 'object' &&
    'code' in error &&
    'message' in error
  )
}

window.addEventListener('message', handleMessage)
