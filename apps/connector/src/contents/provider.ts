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

  public async request(args: RequestArguments) {
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
  public async send(...args: unknown[]): Promise<unknown> {
    return await this.request({
      method: args[0] as string,
      params: args[1] as Record<string, unknown>,
    })
  }

  public on(event: Event, handler: (args: unknown) => void): void {
    logger.info('on::', event, handler)

    this.#listeners.set(event, handler)
  }

  /** @deprecated */
  public async close(...args: unknown[]): Promise<void> {
    logger.info('close::', args)

    this.disconnect()
  }

  public removeListener(event: Event, handler: (args: unknown) => void): void {
    logger.info('removeListener::', event, handler)

    // note: not all dapps remove these on disconnect
    if (event === 'close' || event === 'disconnect') {
      this.disconnect()
    }

    this.#listeners.delete(event)
  }

  public async enable() {
    logger.info('enable::')

    return true
  }

  private async disconnect() {
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
 * @see https://eips.ethereum.org/EIPS/eip-6963 for spec
 */
function announceProvider() {
  const info = {
    uuid: 'c14d6a7e-14c2-477d-bcb7-ffb732145eae',
    name: 'Status',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzk1MF8xMjM5NikiPiA8bWFzayBpZD0ibWFzazBfOTUwXzEyMzk2IiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSItMSIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMzIj4gPHBhdGggZD0iTTE2IC0wLjAwMDQ4ODI4MUM0IC0wLjAwMDQ4ODI4MSAwIDMuOTk5NTEgMCAxNS45OTk1QzAgMjcuOTk5NSA0IDMxLjk5OTUgMTYgMzEuOTk5NUMyOCAzMS45OTk1IDMyIDI3Ljk5OTUgMzIgMTUuOTk5NUMzMiAzLjk5OTUxIDI4IC0wLjAwMDQ4ODI4MSAxNiAtMC4wMDA0ODgyODFaIiBmaWxsPSJ3aGl0ZSIvPiA8L21hc2s+IDxnIG1hc2s9InVybCgjbWFzazBfOTUwXzEyMzk2KSI+IDxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2ZfOTUwXzEyMzk2KSI+IDxjaXJjbGUgY3g9IjIzIiBjeT0iOC45OTk1MSIgcj0iMTkiIGZpbGw9IiMxOTkyRDciLz4gPC9nPiA8ZyBmaWx0ZXI9InVybCgjZmlsdGVyMV9mXzk1MF8xMjM5NikiPiA8Y2lyY2xlIGN4PSIzMyIgY3k9IjE4Ljk5OTUiIHI9IjE5IiBmaWxsPSIjRjZCMDNDIi8+IDwvZz4gPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjJfZl85NTBfMTIzOTYpIj4gPGNpcmNsZSBjeD0iNSIgY3k9IjMwLjk5OTUiIHI9IjE5IiBmaWxsPSIjRkY3RDQ2Ii8+IDwvZz4gPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjNfZl85NTBfMTIzOTYpIj4gPGNpcmNsZSBjeD0iLTciIGN5PSI4Ljk5OTUxIiByPSIxOSIgZmlsbD0iIzcxNDBGRCIvPiA8L2c+IDxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTguMTI4NCA4LjgwODQzQzE0Ljk1NTEgOC45ODk4NCAxMi42MTIxIDExLjg3NDMgMTIuMzUxNiAxNS4xMzc1QzEyLjM2NzYgMTUuMTMyNiAxMi4zODUzIDE1LjEyNzYgMTIuNDAzIDE1LjEyMjdDMTIuNDIwNyAxNS4xMTc4IDEyLjQzODQgMTUuMTEyOSAxMi40NTQ0IDE1LjEwOEMxMi44NTM1IDE1LjAwNjcgMTMuMjYxNyAxNC45NDUyIDEzLjY3MzEgMTQuOTI0M0MxNC41NjQxIDE0Ljg3NDUgMTUuMjg4NyAxNC45NTE2IDE2LjAxMzIgMTUuMDI4OEMxNi43Mzg3IDE1LjEwNiAxNy40NjQgMTUuMTgzMiAxOC4zNTYyIDE1LjEzMjlDMTguNzY1OCAxNS4xMTEzIDE5LjE3MjIgMTUuMDQ3OSAxOS41Njg4IDE0Ljk0NEMyMS4yNDc2IDE0LjUwODYgMjIuMjEzNSAxMy4zNzQgMjIuMTI4MiAxMS44MTkxQzIyLjAyMzEgOS44ODcwOCAyMC4wNzY5IDguNjk3MzIgMTguMTI4NCA4LjgwODQzWk0xMy44Nzk2IDIzLjE5MDlDMTcuMDUyOSAyMy4wMDk1IDE5LjM5NTkgMjAuMTI1IDE5LjY1NjQgMTYuODYxOEMxOS42MzYzIDE2Ljg2OCAxOS42MTM1IDE2Ljg3NDIgMTkuNTkxNSAxNi44ODAxQzE5LjU3ODQgMTYuODgzNyAxOS41NjU1IDE2Ljg4NzIgMTkuNTUzNiAxNi44OTA1QzE5LjE1NDUgMTYuOTkxOSAxOC43NDYyIDE3LjA1MzQgMTguMzM0OCAxNy4wNzQyQzE3LjQ0MjcgMTcuMTI0OSAxNi43MTczIDE3LjA0NzkgMTUuOTkxOSAxNi45NzA4QzE1LjI2NzQgMTYuODkzOCAxNC41NDI4IDE2LjgxNjkgMTMuNjUxOCAxNi44NjcxQzEzLjI0MjEgMTYuODg4OCAxMi44MzU4IDE2Ljk1MjEgMTIuNDM5MiAxNy4wNTYxQzEwLjc2MDMgMTcuNDkwNyA5Ljc5ODI5IDE4LjYyNTMgOS44Nzk3OSAyMC4xODAyQzkuOTg0OTEgMjIuMTEyMiAxMS45MzExIDIzLjMwMiAxMy44Nzk2IDIzLjE5MDlaIiBmaWxsPSJ3aGl0ZSIvPiA8L2c+IDwvZz4gPGRlZnM+IDxmaWx0ZXIgaWQ9ImZpbHRlcjBfZl85NTBfMTIzOTYiIHg9Ii01LjQzMDI2IiB5PSItMTkuNDMwNyIgd2lkdGg9IjU2Ljg2MDUiIGhlaWdodD0iNTYuODYwNSIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPiA8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPiA8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPiA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI0LjcxNTEzIiByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfOTUwXzEyMzk2Ii8+IDwvZmlsdGVyPiA8ZmlsdGVyIGlkPSJmaWx0ZXIxX2ZfOTUwXzEyMzk2IiB4PSI0LjU2OTc0IiB5PSItOS40MzA3NSIgd2lkdGg9IjU2Ljg2MDUiIGhlaWdodD0iNTYuODYwNSIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPiA8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPiA8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPiA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI0LjcxNTEzIiByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfOTUwXzEyMzk2Ii8+IDwvZmlsdGVyPiA8ZmlsdGVyIGlkPSJmaWx0ZXIyX2ZfOTUwXzEyMzk2IiB4PSItMjMuNDMwMyIgeT0iMi41NjkyNSIgd2lkdGg9IjU2Ljg2MDUiIGhlaWdodD0iNTYuODYwNSIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPiA8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPiA8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPiA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI0LjcxNTEzIiByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfOTUwXzEyMzk2Ii8+IDwvZmlsdGVyPiA8ZmlsdGVyIGlkPSJmaWx0ZXIzX2ZfOTUwXzEyMzk2IiB4PSItMzUuNDMwMyIgeT0iLTE5LjQzMDciIHdpZHRoPSI1Ni44NjA1IiBoZWlnaHQ9IjU2Ljg2MDUiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4gPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4gPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz4gPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iNC43MTUxMyIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzk1MF8xMjM5NiIvPiA8L2ZpbHRlcj4gPGNsaXBQYXRoIGlkPSJjbGlwMF85NTBfMTIzOTYiPiA8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9IndoaXRlIi8+IDwvY2xpcFBhdGg+IDwvZGVmcz4gPC9zdmc+',
    rdns: 'app.status',
  }

  window.dispatchEvent(
    new CustomEvent('eip6963:announceProvider', {
      detail: Object.freeze({ info, provider }),
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

  injectProvider()
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
