import asMetamaskIcon from '~_encoded/icon-as-metamask'
import asStatusIcon from '~_encoded/icon-as-status'
import { logger } from '~lib/logger'
import { ProviderRpcError } from '~lib/provider-rpc-error'
import { RequestArguments } from '~lib/request-arguments'
import { ProxyMessage } from '~messages/proxy-message'

import type { ProviderMessage } from '~messages/provider-message'
import type { PlasmoCSConfig } from 'plasmo'

export const config: PlasmoCSConfig = {
  matches: ['https://*/*'],
  world: 'MAIN',
  run_at: 'document_start',
  all_frames: false,
}

type Event =
  | 'connect'
  | 'connected'
  | 'disconnect'
  | 'close'
  | 'error'
  | 'chainChanged'
  | 'accountsChanged'
  | 'networkChanged'

/**
 * @see https://eips.ethereum.org/EIPS/eip-1193 for spec
 */
export class Provider {
  #listeners: Map<Event, (...args: unknown[]) => void>

  /**
   * @see https://github.com/snapshot-labs/lock/blob/503f4b07f1b631b1eed0dca993110dc561189261/src/utils.ts for other examples
   */
  public isStatus: boolean

  public isMetaMask: boolean
  public _metamask: {
    isUnlocked: () => Promise<true>
  } | null

  // public isCoinbaseWallet: boolean
  public qrUrl: null

  public autoRefreshOnNetworkChange: boolean

  public provider: Record<string, unknown> | null

  public __isProvider: boolean

  public connected: boolean

  constructor() {
    this.isStatus = true
    this.isMetaMask = false
    this._metamask = null
    // this.isCoinbaseWallet = false
    this.qrUrl = null
    this.autoRefreshOnNetworkChange = false
    this.provider = null
    this.__isProvider = false
    this.connected = false
    this.#listeners = new Map()
  }

  public request = async (args: RequestArguments): Promise<unknown> => {
    try {
      args = RequestArguments.parse(args)
    } catch {
      throw new ProviderRpcError({
        code: -32602,
        message: 'Invalid request arguments',
      })
    }

    await waitUntilComplete(document)

    return new Promise((resolve, reject) => {
      const { method, params } = args

      const messageChannel = new MessageChannel()

      messageChannel.port1.onmessage = ({ data }) => {
        try {
          const message = ProxyMessage.parse(data)

          messageChannel.port1.close()

          // note: method side-effects
          switch (message.type) {
            case 'status:proxy:success': {
              if (
                (method === 'eth_requestAccounts' ||
                  method === 'eth_accounts') &&
                !this.connected
              ) {
                this.#listeners.get('connect')?.({ chainId: '0x1' })
                this.#listeners.get('connected')?.({ chainId: '0x1' })
                this.connected = true

                logger.info('connected::')
              }

              if (method === 'wallet_switchEthereumChain') {
                this.#listeners.get('chainChanged')?.(message.data)
                this.#listeners.get('networkChanged')?.(message.data)

                logger.info('chainChanged::')
              }

              resolve(message.data)

              return
            }
            case 'status:proxy:error': {
              logger.error(message.error)

              // note: for those dApps that make call after having permissions revoked
              if (
                message.error.message === 'dApp is not permitted by user' &&
                this.connected
              ) {
                this.disconnect()
              }

              reject(new ProviderRpcError(message.error))

              return
            }
          }
        } catch {
          // we don't reject here because incoming message is not from the proxy
          return
        }
      }

      const providerMessage: ProviderMessage = {
        type: 'status:provider',
        data: {
          method,
          params,
        },
      }

      window.postMessage(providerMessage, window.origin, [messageChannel.port2])
    })
  }

  /** @deprecated */
  public send = async (...args: unknown[]): Promise<unknown> => {
    return await this.request({
      method: args[0] as string,
      params: args[1] as Record<string, unknown>,
    })
  }

  public on = (event: Event, handler: (args: unknown) => void): void => {
    logger.info('on::', event, handler)

    this.#listeners.set(event, handler)
  }

  /** @deprecated */
  public close = async (...args: unknown[]): Promise<void> => {
    logger.info('close::', args)

    this.disconnect()
  }

  public removeListener = (
    event: Event,
    handler: (args: unknown) => void,
  ): void => {
    logger.info('removeListener::', event, handler)

    // note: not all dapps remove these on disconnect
    if (event === 'close' || event === 'disconnect') {
      this.disconnect()
    }

    this.#listeners.delete(event)
  }

  public enable = async (): Promise<boolean> => {
    logger.info('enable::')

    return true
  }

  private disconnect = async (): Promise<void> => {
    if (!this.connected) {
      return
    }

    this.connected = false

    logger.info('disconnect::')

    await this.request({
      method: 'wallet_revokePermissions',
      params: [
        {
          eth_accounts: {},
        },
      ],
    })

    window.postMessage(
      {
        type: 'status:provider:disconnect',
      } satisfies ProviderMessage,
      window.origin,
    )

    this.#listeners.get('disconnect')?.()
    this.#listeners.get('close')?.()
    this.#listeners.clear()
  }
}

const provider = new Provider()

/**
 * @see https://eips.ethereum.org/EIPS/eip-6963 for standard
 */
function announceProvider() {
  const asStatus = {
    uuid: 'c14d6a7e-14c2-477d-bcb7-ffb732145eae',
    name: 'Status',
    icon: asStatusIcon,
    rdns: 'app.status',
  }

  window.dispatchEvent(
    new CustomEvent('eip6963:announceProvider', {
      detail: Object.freeze({ info: asStatus, provider }),
    }),
  )
}

/**
 * non-standard
 */
function announceAsDefaultProvider() {
  const asDefault = {
    uuid: '00000000-0000-0000-0000-000000000000', // nil
    name: 'Default Browser Wallet',
    // icon: null,
    icon: asStatusIcon,
    // rdns: null,
    rdns: '',
    // rdns: 'app.status.default',
  }

  window.dispatchEvent(
    new CustomEvent('eip6963:announceProvider', {
      detail: Object.freeze({ info: asDefault, provider }),
    }),
  )

  const asMetaMask = {
    // uuid: '3f1def1d-85e4-4e47-9dea-b5eb4c0f9e6c', // random
    // uuid: '45d0bff1-5747-47a2-8a31-e80c14c410a2', // mipd
    // uuid: '2b119462-5656-4749-8a0d-3b8b04818c3a', // mipd
    uuid: '767f5a87-3bd2-44a6-8c00-8eed3748e793', // official, but random too
    name: 'MetaMask',
    icon: asMetamaskIcon,
    rdns: 'io.metamask',
  }

  window.dispatchEvent(
    new CustomEvent('eip6963:announceProvider', {
      detail: Object.freeze({ info: asMetaMask, provider }),
    }),
  )
}

window.addEventListener('eip6963:requestProvider', () => {
  announceProvider()
})

announceProvider()

function injectProvider() {
  Object.defineProperties(provider, {
    isStatus: {
      value: true,
      writable: false,
    },
    isMetaMask: {
      value: true,
      writable: false,
    },
    _metamask: {
      value: {
        isUnlocked: () => new Promise(resolve => resolve(true)),
      },
      writable: false,
    },
    // isCoinbaseWallet: {
    //   value: true,
    //   writable: false,
    // },
    qrUrl: {
      value: null,
      writable: false,
    },
    autoRefreshOnNetworkChange: {
      value: false,
      writable: true,
    },
    provider: {
      value: {},
      writable: true,
    },
    ['__isProvider']: {
      value: true,
      writable: false,
    },
    connected: {
      value: true,
      writable: true,
    },
  })

  Object.seal(provider)

  Object.defineProperties(window, {
    ethereum: {
      get() {
        return provider
      },
      configurable: false,
    },
  })
}

// let redefinedProvider: any

if (window.localStorage.getItem('status:default-wallet') !== 'false') {
  // redefinedProvider = window.ethereum

  try {
    injectProvider()
  } catch (error) {
    logger.error(error)
  }

  // note: remove listener if UI wouldn't window.location.reload()
  window.addEventListener('eip6963:requestProvider', () => {
    announceAsDefaultProvider()
  })
}

// window.addEventListener('storage', () => {
//   if (window.localStorage.getItem('status:default-wallet') === 'false') {
//     window.ethereum = redefinedProvider
//   }
// })

async function waitUntilComplete(document: Document): Promise<void> {
  return new Promise(resolve => {
    if (document.readyState === 'complete') {
      resolve()

      return
    }

    document.addEventListener('readystatechange', () => {
      if (document.readyState === 'complete') {
        resolve()
      }
    })
  })
}
