/* eslint-disable no-console */

export type ProviderEvent =
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

export class ProviderRpcError extends Error {
  public code: number
  public data: unknown

  constructor(args: { code: number; message: string; data?: unknown }) {
    super(args.message)
    this.code = args.code
    this.data = args.data
  }
}

function waitUntilComplete(doc: Document): Promise<void> {
  return new Promise(resolve => {
    if (doc.readyState === 'complete') {
      resolve()
      return
    }

    doc.addEventListener('readystatechange', () => {
      if (doc.readyState === 'complete') {
        resolve()
      }
    })
  })
}

function log(level: 'info' | 'warn' | 'error', ...args: unknown[]) {
  if (!(window?.localStorage.getItem('status:logging') === 'true')) {
    return
  }

  console[level]('status:', ...args)
}

export const logger = {
  info(...args: unknown[]) {
    logger.info( ...args)
  },
  warn(...args: unknown[]) {
    log('warn', ...args)
  },
  error(...args: unknown[]) {
    logger.error( ...args)
  },
}

const DEFAULT_CHAIN_ID = '0x1'

/**
 * @see https://eips.ethereum.org/EIPS/eip-1193
 */
export class Provider {
  #listeners: Map<ProviderEvent, Set<(...args: unknown[]) => void>>

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

  #emit = (event: ProviderEvent, ...args: unknown[]): void => {
    const handlers = this.#listeners.get(event)
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(...args)
        } catch (err) {
          console.error(`[Status Provider] listener error for ${event}:`, err)
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
              this.#emit('connect', { chainId: DEFAULT_CHAIN_ID })
              this.#emit('connected', { chainId: DEFAULT_CHAIN_ID })
              this.#emit('accountsChanged', message.data)

              logger.info( 'connected::')
            }

            if (method === 'wallet_switchEthereumChain') {
              const switchedChainId =
                (params as [{ chainId: string }] | undefined)?.[0]?.chainId ??
                DEFAULT_CHAIN_ID
              setTimeout(() => {
                this.#emit('chainChanged', switchedChainId)
                this.#emit('networkChanged', switchedChainId)
              }, 0)

              logger.info( 'chainChanged::')
            }

            resolve(message.data)
            return
          }
          case 'status:proxy:error': {
            logger.error( message.error)

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
    event: ProviderEvent,
    handler: (...args: unknown[]) => void,
  ): this => {
    logger.info( 'on::', event)

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
    logger.info( 'close::')

    this.disconnect()
  }

  public removeListener = (
    event: ProviderEvent,
    handler?: (...args: unknown[]) => void,
  ): void => {
    logger.info( 'removeListener::', event)

    if (handler) {
      this.#listeners.get(event)?.delete(handler)
    } else {
      this.#listeners.delete(event)
    }
  }

  public off = (
    event: ProviderEvent,
    handler?: (...args: unknown[]) => void,
  ): void => {
    this.removeListener(event, handler)
  }

  public enable = async (): Promise<boolean> => {
    logger.info( 'enable::')

    return true
  }

  private disconnect = async (): Promise<void> => {
    if (!this.connected) {
      return
    }

    this.connected = false

    logger.info( 'disconnect::')

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
