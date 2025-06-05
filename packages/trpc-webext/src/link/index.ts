import { TRPCClientError } from '@trpc/client'
import { observable } from '@trpc/server/observable'

import type { Operation, TRPCLink } from '@trpc/client'
import type { AnyTRPCRouter } from '@trpc/server'
import type { Observer } from '@trpc/server/observable'
import type { TRPCResponseMessage } from '@trpc/server/rpc'
import type { DataTransformer } from '@trpc/server/unstable-core-do-not-import'
import type { Runtime } from 'webextension-polyfill'

export type WebExtensionLinkOptions = {
  runtime: Runtime.Static
  timeoutMS?: number
  transformer: DataTransformer
}

export type BackgroundMessage = {
  trpc: TRPCResponseMessage
}

let portToBackground: Runtime.Port | null = null

interface ResultListeners {
  [id: number]: {
    timestamp: number // used to cleanup listeners
    observer: Observer<unknown, unknown>
    type: Operation['type']
  }
}

const resultListeners: ResultListeners = {}

function connectToBackground({ runtime }: WebExtensionLinkOptions) {
  if (!portToBackground) portToBackground = runtime.connect()
}

function portOnMessageFromBackground(
  transformer: WebExtensionLinkOptions['transformer'],
) {
  return (message: unknown) => {
    if (!(message as BackgroundMessage)?.trpc) return
    const backgroundMessage = message as BackgroundMessage
    const { trpc } = backgroundMessage
    if (!('id' in trpc) || trpc.id === null || trpc.id === undefined) return
    if (!(trpc.id in resultListeners)) return
    const { observer, type } = resultListeners[trpc.id as number]

    if ('error' in trpc) {
      // Check if it's already a SuperJSONResult or needs deserialization
      const error =
        typeof trpc.error === 'object' && 'json' in trpc.error
          ? transformer.deserialize(trpc.error)
          : trpc.error
      observer.error(TRPCClientError.from({ ...trpc, error }))
      return
    }

    observer.next({
      result: {
        ...trpc.result,
        ...((!trpc.result.type || trpc.result.type === 'data') && {
          type: 'data',
          data: transformer.deserialize(trpc.result.data),
        }),
      } as unknown,
    })

    if (type !== 'subscription' || trpc.result.type === 'stopped') {
      observer.complete()
    }
  }
}

let clearListenersIntervalId: ReturnType<typeof setInterval> | undefined

function clearListenersIntervalFn(timeoutMS: number) {
  return () => {
    const timedOutAt = new Date().getTime() - timeoutMS

    for (const id in resultListeners) {
      if (resultListeners[id].timestamp < timedOutAt) {
        delete resultListeners[id]
      }
    }
  }
}

function setupClearListenersInterval(timeoutMS = 10000) {
  if (clearListenersIntervalId) clearInterval(clearListenersIntervalId)
  clearListenersIntervalId = setInterval(
    clearListenersIntervalFn(timeoutMS),
    1000,
  )
}

export function webExtensionLink(
  opts: WebExtensionLinkOptions,
): TRPCLink<AnyTRPCRouter> {
  const { timeoutMS, transformer } = opts

  setupClearListenersInterval(timeoutMS)

  connectToBackground(opts)
  const onMessage = portOnMessageFromBackground(transformer)

  const portOnDisconnect = (port: Runtime.Port) => {
    port.onDisconnect.removeListener(portOnDisconnect)
    port.onMessage.removeListener(onMessage)
    portToBackground = null
  }

  portToBackground?.onDisconnect.addListener(portOnDisconnect)
  portToBackground?.onMessage.addListener(onMessage)

  return () => {
    return ({ op }) => {
      const { id, type, path } = op

      const input = transformer.serialize(op.input) || op.input

      const trpcPayload = {
        id,
        jsonrpc: undefined,
        method: type,
        params: { path, input },
      }

      const postMessagePayload = {
        trpc: trpcPayload,
      }

      return observable(observer => {
        resultListeners[id] = {
          observer,
          type,
          timestamp: new Date().getTime(),
        }
        portToBackground?.postMessage(postMessagePayload)

        return () => {
          delete resultListeners[id]
        }
      })
    }
  }
}
