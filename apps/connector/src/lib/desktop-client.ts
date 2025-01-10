import { WebSocketProvider } from 'ethers'

import { config } from '~config'

import { logger } from './logger'

import type { RequestArguments } from '~lib/request-arguments'
import type { WebSocketLike } from 'ethers'

type DesktopRequestArguments = RequestArguments & {
  name: string
  url: string
  iconUrl: string
}

export class DesktopClient {
  #rpcClient: WebSocketProvider | null = null

  public stop() {
    if (!this.#rpcClient) {
      return
    }

    logger.info('stop::')
    this.#rpcClient?.destroy()
    this.#rpcClient = null

    // todo: publish disconnect message/event after https://github.com/status-im/status-desktop/issues/16014
  }

  public async send(args: DesktopRequestArguments) {
    if (!this.#rpcClient) {
      logger.info('start::')
      this.#rpcClient = new WebSocketProvider(
        config.desktop.rpc.url,
        'mainnet',
        {
          staticNetwork: true,
        },
      )
      ;(this.#rpcClient.websocket as WebSocket).onclose = () => {
        this.stop()
      }
    }

    await waitUntilOpen(this.#rpcClient.websocket)

    logger.info('client::', {
      method: config.desktop.rpc.method,
      params: [JSON.stringify(args)],
    })

    return await this.#rpcClient.send(config.desktop.rpc.method, [
      JSON.stringify(args),
    ])
  }
}

async function waitUntilOpen(websocket: WebSocketLike) {
  return new Promise<void>((resolve, reject) => {
    if (websocket.readyState === WebSocket.OPEN) {
      resolve()

      return
    }

    if (websocket.readyState === WebSocket.CLOSING) {
      reject(new Error('The RPC server is closing'))

      return
    }

    if (websocket.readyState === WebSocket.CLOSED) {
      reject(new Error('The RPC server is closed'))

      return
    }

    const timeout = setTimeout(() => {
      reject(new Error('Timed out to connect to the RPC server'))
    }, 30 * 1000)

    if (websocket.readyState === WebSocket.CONNECTING) {
      logger.warn('Waiting for the RPC server to connect')
    }

    const onopen = websocket.onopen?.bind(websocket)
    websocket.onopen = event => {
      onopen?.(event)
      websocket.onopen = onopen!
      clearTimeout(timeout)
      resolve()
    }

    const onerror = websocket.onerror?.bind(websocket)
    websocket.onerror = event => {
      onerror?.(event)
      websocket.onerror = onerror!
      clearTimeout(timeout)
      reject(new Error('Failed to connect to the RPC server'))
    }
  })
}
