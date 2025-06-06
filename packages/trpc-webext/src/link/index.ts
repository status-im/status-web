import { TRPCClientError } from '@trpc/client'
import { observable } from '@trpc/server/observable'

import type { Operation, OperationResultEnvelope, TRPCLink } from '@trpc/client'
import type { AnyTRPCRouter } from '@trpc/server'
import type { Observer } from '@trpc/server/observable'
import type { TRPCResponseMessage } from '@trpc/server/rpc'
import type { DataTransformer } from '@trpc/server/unstable-core-do-not-import'
import type { Runtime } from 'webextension-polyfill'

export interface WebExtensionLinkOptions {
  runtime: Runtime.Static
  timeoutMS?: number
  transformer: DataTransformer
}

export interface BackgroundMessage {
  trpc: TRPCResponseMessage
}

type ResultListener<TOutput = unknown> = {
  timestamp: number
  observer: Observer<
    OperationResultEnvelope<TOutput, TRPCClientError<AnyTRPCRouter>>,
    TRPCClientError<AnyTRPCRouter>
  >
  type: Operation['type']
}

interface ResultListeners {
  [id: number]: ResultListener
}

let portToBackground: Runtime.Port | null = null
const resultListeners: ResultListeners = {}

function connectToBackground({ runtime }: WebExtensionLinkOptions): void {
  if (!portToBackground) {
    portToBackground = runtime.connect()
  }
}

function isBackgroundMessage(message: unknown): message is BackgroundMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    'trpc' in message &&
    typeof (message as any).trpc === 'object'
  )
}

function isTRPCResponseWithId(
  trpc: TRPCResponseMessage,
): trpc is TRPCResponseMessage & { id: number } {
  return (
    'id' in trpc &&
    trpc.id !== null &&
    trpc.id !== undefined &&
    typeof trpc.id === 'number'
  )
}

function createPortMessageHandler(
  transformer: DataTransformer,
): (message: unknown) => void {
  return (message: unknown) => {
    if (!isBackgroundMessage(message)) return

    const { trpc } = message
    if (!isTRPCResponseWithId(trpc)) return

    const listener = resultListeners[trpc.id]
    if (!listener) return

    const { observer, type } = listener

    if ('error' in trpc) {
      // Handle error response
      const error = shouldDeserialize(trpc.error)
        ? transformer.deserialize(trpc.error)
        : trpc.error

      observer.error(TRPCClientError.from({ ...trpc, error }))
      return
    }

    // Handle success response
    observer.next({
      result: {
        ...trpc.result,
        ...((!trpc.result.type || trpc.result.type === 'data') && {
          type: 'data' as const,
          data: transformer.deserialize(trpc.result.data),
        }),
      },
    })

    // Complete for non-subscription or stopped subscription
    if (type !== 'subscription' || trpc.result.type === 'stopped') {
      observer.complete()
    }
  }
}

function shouldDeserialize(error: unknown): error is { json: unknown } {
  return typeof error === 'object' && error !== null && 'json' in error
}

let clearListenersIntervalId: ReturnType<typeof setInterval> | undefined

function createListenerCleaner(timeoutMS: number): () => void {
  return () => {
    const timedOutAt = Date.now() - timeoutMS

    for (const [id, listener] of Object.entries(resultListeners)) {
      if (listener.timestamp < timedOutAt) {
        delete resultListeners[Number(id)]
      }
    }
  }
}

function setupClearListenersInterval(timeoutMS = 10000): void {
  if (clearListenersIntervalId) {
    clearInterval(clearListenersIntervalId)
  }

  clearListenersIntervalId = setInterval(createListenerCleaner(timeoutMS), 1000)
}

function createPortDisconnectHandler(
  port: Runtime.Port,
  onMessage: (message: unknown) => void,
): (disconnectedPort: Runtime.Port) => void {
  return (disconnectedPort: Runtime.Port) => {
    disconnectedPort.onDisconnect.removeListener(
      createPortDisconnectHandler(port, onMessage),
    )
    disconnectedPort.onMessage.removeListener(onMessage)
    portToBackground = null
  }
}

export function webExtensionLink(
  opts: WebExtensionLinkOptions,
): TRPCLink<AnyTRPCRouter> {
  const { timeoutMS = 10000, transformer } = opts

  setupClearListenersInterval(timeoutMS)
  connectToBackground(opts)

  const onMessage = createPortMessageHandler(transformer)
  const onDisconnect = createPortDisconnectHandler(portToBackground!, onMessage)

  portToBackground?.onDisconnect.addListener(onDisconnect)
  portToBackground?.onMessage.addListener(onMessage)

  return () => {
    return ({ op }) => {
      const { id, type, path, input } = op

      const serializedInput = transformer.serialize(input) ?? input

      const trpcPayload = {
        id,
        jsonrpc: undefined,
        method: type,
        params: { path, input: serializedInput },
      } as const

      const postMessagePayload = {
        trpc: trpcPayload,
      }

      return observable(observer => {
        resultListeners[id] = {
          observer,
          type,
          timestamp: Date.now(),
        }

        portToBackground?.postMessage(postMessagePayload)

        return () => {
          delete resultListeners[id]
        }
      })
    }
  }
}
