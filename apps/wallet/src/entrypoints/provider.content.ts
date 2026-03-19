import { defineContentScript } from 'wxt/sandbox'

import statusIcon from '../lib/status-icon'

export default defineContentScript({
  matches: ['*://*/*'],
  runAt: 'document_start',
  world: 'MAIN',

  main() {
    type Event =
      | 'connect'
      | 'connected'
      | 'disconnect'
      | 'close'
      | 'error'
      | 'chainChanged'
      | 'accountsChanged'
      | 'networkChanged'

    type ProxyMessage =
      | { type: 'status:proxy:success'; data: unknown }
      | { type: 'status:proxy:error'; error: { code: number; message: string } }

    class ProviderRpcError extends Error {
      public code: number
      public data: unknown

      constructor(args: { code: number; message: string; data?: unknown }) {
        super(args.message)
        this.code = args.code
        this.data = args.data
      }
    }

    /**
     * @see https://eips.ethereum.org/EIPS/eip-1193
     */
    class Provider {
      #listeners: Map<Event, Set<(...args: unknown[]) => void>>

      public isStatus: boolean
      public qrUrl: null
      public autoRefreshOnNetworkChange: boolean
      public __isProvider: boolean
      public connected: boolean

      constructor() {
        this.isStatus = true
        this.qrUrl = null
        this.autoRefreshOnNetworkChange = false
        this.__isProvider = false
        this.connected = false
        this.#listeners = new Map()
      }

      #emit = (event: Event, ...args: unknown[]): void => {
        const handlers = this.#listeners.get(event)
        if (handlers) {
          for (const handler of handlers) {
            try {
              handler(...args)
            } catch (err) {
              console.error(
                `[Status Provider] listener error for ${event}:`,
                err,
              )
            }
          }
        }
      }

      public request = async (args: {
        method: string
        params?: unknown
      }): Promise<unknown> => {
        if (!args || typeof args.method !== 'string') {
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
            let message: ProxyMessage
            try {
              message = data as ProxyMessage
              if (
                !message ||
                (message.type !== 'status:proxy:success' &&
                  message.type !== 'status:proxy:error')
              ) {
                return
              }
            } catch {
              return
            }

            messageChannel.port1.close()

            switch (message.type) {
              case 'status:proxy:success': {
                if (
                  method === 'eth_requestAccounts' &&
                  !this.connected &&
                  Array.isArray(message.data) &&
                  message.data.length > 0
                ) {
                  this.connected = true
                  this.#emit('connect', { chainId: '0x1' })
                  this.#emit('connected', { chainId: '0x1' })
                  this.#emit('accountsChanged', message.data)
                }

                if (method === 'wallet_switchEthereumChain') {
                  const switchedChainId =
                    (params as [{ chainId: string }] | undefined)?.[0]
                      ?.chainId ?? '0x1'
                  setTimeout(() => {
                    this.#emit('chainChanged', switchedChainId)
                    this.#emit('networkChanged', switchedChainId)
                  }, 0)
                }

                resolve(message.data)
                return
              }
              case 'status:proxy:error': {
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
          }

          window.postMessage(
            {
              type: 'status:provider',
              data: { method, params },
            },
            window.origin,
            [messageChannel.port2],
          )
        })
      }

      /** @deprecated */
      public send = async (...args: unknown[]): Promise<unknown> => {
        return await this.request({
          method: args[0] as string,
          params: args[1] as Record<string, unknown>,
        })
      }

      public isConnected = (): boolean => {
        return this.connected
      }

      public on = (
        event: Event,
        handler: (...args: unknown[]) => void,
      ): this => {
        let handlers = this.#listeners.get(event)
        if (!handlers) {
          handlers = new Set()
          this.#listeners.set(event, handlers)
        }
        handlers.add(handler)
        return this
      }

      /** @deprecated */
      public close = async (): Promise<void> => {
        this.disconnect()
      }

      public removeListener = (
        event: Event,
        handler?: (...args: unknown[]) => void,
      ): void => {
        if (handler) {
          this.#listeners.get(event)?.delete(handler)
        } else {
          this.#listeners.delete(event)
        }
      }

      public off = (
        event: Event,
        handler?: (...args: unknown[]) => void,
      ): void => {
        this.removeListener(event, handler)
      }

      public enable = async (): Promise<boolean> => {
        return true
      }

      private disconnect = async (): Promise<void> => {
        if (!this.connected) {
          return
        }

        this.connected = false

        await this.request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }],
        })

        window.postMessage(
          { type: 'status:provider:disconnect' },
          window.origin,
        )

        this.#emit('disconnect')
        this.#emit('close')
        this.#listeners.clear()
      }
    }

    const provider = new Provider()

    function announceProvider() {
      const info = {
        uuid: 'c14d6a7e-14c2-477d-bcb7-ffb732145eae',
        name: 'Status',
        icon: statusIcon,
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
      Object.defineProperties(window, {
        ethereum: {
          get() {
            return provider
          },
          configurable: false,
        },
      })
    }

    try {
      injectProvider()
    } catch (error) {
      console.error('[Status] Failed to inject provider:', error)
    }

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
  },
})
