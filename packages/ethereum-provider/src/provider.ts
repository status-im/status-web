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

function statusLog(level: 'info' | 'warn' | 'error', ...args: unknown[]) {
  if (!(window?.localStorage.getItem('status:logging') === 'true')) {
    return
  }

  console[level]('status:', ...args)
}

export const logger = {
  info(...args: unknown[]) {
    statusLog('info', ...args)
  },
  warn(...args: unknown[]) {
    statusLog('warn', ...args)
  },
  error(...args: unknown[]) {
    statusLog('error', ...args)
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

    this.#listenForWalletEvents()
    void this.#restoreSession()
  }

  /**
   * Events the wallet pushes without the page having asked -- today only an
   * account switch. Delivered by the bridge content script, which is the only
   * thing that can reach this window from the extension.
   */
  #listenForWalletEvents = (): void => {
    window.addEventListener('message', event => {
      // Same-origin only. Deliberately not also matching `event.source` against
      // `window`: the bridge posts from the isolated world, and a `source`
      // mismatch there would drop every event silently.
      if (event.origin !== window.origin) {
        return
      }

      const message = event.data
      if (
        !message ||
        message.type !== 'status:provider:event' ||
        message.event !== 'accountsChanged'
      ) {
        return
      }

      const accounts = Array.isArray(message.data) ? message.data : []
      // EIP-1193 reports a revocation as an empty account list; dApps read it
      // as a disconnect. `disconnect` itself is not emitted -- it clears the
      // listener map, and the page may still be reconnected from the wallet.
      this.connected = accounts.length > 0

      logger.info('accountsChanged::', accounts)

      this.#emit('accountsChanged', accounts)
    })
  }

  /**
   * A page load creates a fresh provider, but the wallet's grant outlives it.
   * Without asking, this instance reports itself disconnected even while
   * `eth_accounts` returns the account -- dApps then treat the session as gone
   * and their reconnect path starts by calling `wallet_revokePermissions`,
   * destroying a permission the user never asked to drop.
   */
  #restoreSession = async (): Promise<void> => {
    try {
      const accounts = await this.request({ method: 'eth_accounts' })
      if (!Array.isArray(accounts) || accounts.length === 0) {
        return
      }

      const chainId = await this.request({ method: 'eth_chainId' })

      this.connected = true
      this.#emit('connect', { chainId })
      this.#emit('connected', { chainId })
      this.#emit('accountsChanged', accounts)

      logger.info('session restored::', accounts)
    } catch (error) {
      logger.warn('session restore failed::', error)
    }
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
              const accounts = message.data
              this.connected = true

              // The origin's chain, not an assumed mainnet: a dApp told the
              // wrong chainId on connect can decide it is on an unsupported
              // network and disconnect itself.
              void this.request({ method: 'eth_chainId' })
                .catch(() => DEFAULT_CHAIN_ID)
                .then(chainId => {
                  this.#emit('connect', { chainId })
                  this.#emit('connected', { chainId })
                  this.#emit('accountsChanged', accounts)
                })

              logger.info('connected::')
            }

            if (method === 'wallet_switchEthereumChain') {
              const switchedChainId =
                (params as [{ chainId: string }] | undefined)?.[0]?.chainId ??
                DEFAULT_CHAIN_ID
              setTimeout(() => {
                this.#emit('chainChanged', switchedChainId)
                this.#emit('networkChanged', switchedChainId)
              }, 0)

              logger.info('chainChanged::')
            }

            resolve(message.data)
            return
          }
          case 'status:proxy:error': {
            logger.error(message.error)

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

  /**
   * EIP-1193: "connected" means the provider can service RPC requests, not
   * that accounts are authorized -- MetaMask likewise returns true once
   * initialized. Reporting account state here made dApps treat a reload as a
   * dropped session and disconnect themselves.
   *
   * @see https://eips.ethereum.org/EIPS/eip-1193#connectivity
   */
  public isConnected = (): boolean => {
    return true
  }

  public on = (
    event: ProviderEvent,
    handler: (...args: unknown[]) => void,
  ): this => {
    logger.info('on::', event)

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
    logger.info('close::')

    this.disconnect()
  }

  public removeListener = (
    event: ProviderEvent,
    handler?: (...args: unknown[]) => void,
  ): void => {
    logger.info('removeListener::', event)

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
    logger.info('enable::')

    return true
  }

  /**
   * Tears down this page's provider session only. It deliberately does not
   * revoke the stored permission: `close()` is a page-lifecycle call, and a
   * reload or a library cleaning up must not cost the user their connection.
   * To actually revoke, a dApp calls `wallet_revokePermissions` (EIP-2255),
   * or the user disconnects from the wallet.
   */
  private disconnect = (): void => {
    if (!this.connected) {
      return
    }

    this.connected = false

    logger.info('disconnect::')

    // Signals transport teardown to the content script -- the connector closes
    // its socket to Desktop on this. It must not be read as a revocation.
    window.postMessage({ type: 'status:provider:disconnect' }, window.origin)

    this.#emit('disconnect')
    this.#emit('close')
    this.#listeners.clear()
  }
}
