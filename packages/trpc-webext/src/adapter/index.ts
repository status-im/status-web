import { isObservable } from '@trpc/server/observable'
import {
  getErrorShape,
  getTRPCErrorFromUnknown,
  TRPCError,
} from '@trpc/server/unstable-core-do-not-import'

import type { Unsubscribable } from '@trpc/server/observable'
import type {
  AnyProcedure,
  AnyRouter,
  BaseHandlerOptions,
  ProcedureType,
  TRPCClientOutgoingMessage,
  TRPCResponseMessage,
} from '@trpc/server/unstable-core-do-not-import'
import type { Runtime } from 'webextension-polyfill'

export type CreateWebExtContextOptions = {
  req: Runtime.Port
  res: undefined
}

export type CreateWebExtHandlerOptions<TRouter extends AnyRouter> =
  BaseHandlerOptions<TRouter, Runtime.Port> & {
    createContext?: (
      opts: CreateWebExtContextOptions,
    ) => Promise<unknown> | unknown
    runtime: Runtime.Static
  }

type PortInfo = {
  subscriptions: Map<number | string, Unsubscribable>
}

type PortInfos = Map<Runtime.Port, PortInfo>

const PORTS: PortInfos = new Map()

type ClientMessage = {
  trpc: TRPCClientOutgoingMessage
}

function onPortMessage<TRouter extends AnyRouter>(
  opts: CreateWebExtHandlerOptions<TRouter>,
) {
  const { router, createContext, onError } = opts
  const { transformer } = router._def._config

  return async (message: unknown, port: Runtime.Port) => {
    if (!(message as ClientMessage)?.trpc) return
    const clientMessage = message as ClientMessage
    const { trpc } = clientMessage
    if (!('id' in trpc) || trpc.id === null || trpc.id === undefined) return

    const portInfo = PORTS.get(port)
    if (!portInfo) return

    const { subscriptions } = portInfo
    const { id, jsonrpc, method } = trpc

    const sendResponse = (
      response: Omit<TRPCResponseMessage, 'id' | 'jsonrpc'>,
    ) =>
      port.postMessage({
        trpc: { id, jsonrpc, ...response },
      })

    let params: { path: string; input: unknown } | undefined
    let input: unknown
    let ctx: unknown

    try {
      if (method === 'subscription.stop') {
        const subscription = subscriptions.get(id)
        if (subscription) {
          subscription.unsubscribe()
          sendResponse({
            result: {
              type: 'stopped',
            },
          })
        }
        subscriptions.delete(id)
        return
      }

      params = trpc.params as { path: string; input: unknown }

      input = transformer.input.deserialize(params.input)

      ctx = await createContext?.({
        req: port,
        res: undefined,
      })
      const caller = router.createCaller(ctx)

      const segments = params.path.split('.')
      const procedureFn = segments.reduce(
        (acc, segment) => acc[segment],
        caller as unknown,
      ) as AnyProcedure

      const result = await procedureFn(input)

      if (method !== 'subscription') {
        const data = transformer.output.serialize(result)
        sendResponse({
          result: {
            type: 'data',
            data,
          },
        })
        return
      }

      if (!isObservable(result)) {
        throw new TRPCError({
          message: `Subscription ${params.path} did not return an observable`,
          code: 'INTERNAL_SERVER_ERROR',
        })
      }

      const subscription = result.subscribe({
        next: data => {
          sendResponse({
            result: {
              type: 'data',
              data,
            },
          })
        },
        error: cause => {
          const error = getTRPCErrorFromUnknown(cause)

          onError?.({
            error,
            type: method as ProcedureType,
            path: params?.path,
            input,
            ctx,
            req: port,
          })

          sendResponse({
            error: getErrorShape({
              error,
              type: method as ProcedureType,
              path: params?.path,
              input,
              ctx,
              config: router._def._config,
            }),
          })
        },
        complete: () => {
          sendResponse({
            result: {
              type: 'stopped',
            },
          })
        },
      })

      if (subscriptions.has(id)) {
        subscription.unsubscribe()
        sendResponse({
          result: {
            type: 'stopped',
          },
        })
        throw new TRPCError({
          message: `Duplicate id ${id}`,
          code: 'BAD_REQUEST',
        })
      }

      subscriptions.set(id, subscription)

      sendResponse({
        result: {
          type: 'started',
        },
      })
      return
    } catch (cause) {
      const error = getTRPCErrorFromUnknown(cause)

      onError?.({
        error,
        type: method as ProcedureType,
        path: params?.path,
        input,
        ctx,
        req: port,
      })

      sendResponse({
        error: getErrorShape({
          error,
          type: method as ProcedureType,
          path: params?.path,
          input,
          ctx,
          config: router._def._config,
        }),
      })
    }
  }
}

function onPortDisconnect<TRouter extends AnyRouter>(
  onMessage: ReturnType<typeof onPortMessage<TRouter>>,
) {
  return (port: Runtime.Port) => {
    const portInfo = PORTS.get(port)
    if (!portInfo) return
    port.onMessage.removeListener(onMessage)

    const { subscriptions } = portInfo
    subscriptions.forEach(sub => sub.unsubscribe())

    PORTS.delete(port)
  }
}

function onPortConnect<TRouter extends AnyRouter>(
  opts: CreateWebExtHandlerOptions<TRouter>,
) {
  return (port: Runtime.Port) => {
    const portInfo: PortInfo = {
      subscriptions: new Map(),
    }

    PORTS.set(port, portInfo)
    const onMessage = onPortMessage(opts)
    port.onDisconnect.addListener(onPortDisconnect(onMessage))
    port.onMessage.addListener(onMessage)
  }
}

/**
 * Creates a tRPC handler for web extension communication
 *
 * Sets up listeners for port connections and handles tRPC procedure calls
 * from various web extension contexts (content scripts, popup, side panel, etc.)
 *
 * @param opts - Configuration options including router, runtime, and context creator
 *
 * @example
 * =typescript
 * createWebExtHandler({
 *   router: appRouter,
 *   runtime: browser.runtime,
 *   createContext,
 * });
 * =
 */
export const createWebExtHandler = <TRouter extends AnyRouter>(
  opts: CreateWebExtHandlerOptions<TRouter>,
) => {
  opts.runtime.onConnect.addListener(onPortConnect(opts))
}
