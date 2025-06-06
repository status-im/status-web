import { isObservable } from '@trpc/server/observable'
import {
  callProcedure,
  getErrorShape,
  getTRPCErrorFromUnknown,
  TRPCError,
} from '@trpc/server/unstable-core-do-not-import'

import type { Unsubscribable } from '@trpc/server/observable'
import type {
  AnyRouter,
  BaseHandlerOptions,
  ProcedureType,
  TRPCClientOutgoingMessage,
  TRPCResponseMessage,
} from '@trpc/server/unstable-core-do-not-import'
import type { Runtime } from 'webextension-polyfill'

export interface CreateWebExtContextOptions {
  req: Runtime.Port
  res: undefined
}

export interface CreateWebExtHandlerOptions<TRouter extends AnyRouter>
  extends BaseHandlerOptions<TRouter, Runtime.Port> {
  createContext?: (
    opts: CreateWebExtContextOptions,
  ) => Promise<unknown> | unknown
  runtime: Runtime.Static
}

interface ClientMessage {
  trpc: TRPCClientOutgoingMessage
}

interface PortSubscriptions {
  subscriptions: Map<number | string, Unsubscribable>
}

interface TRPCResponseSender {
  (response: Omit<TRPCResponseMessage, 'id' | 'jsonrpc'>): void
}

interface MessageHandlerContext<TRouter extends AnyRouter> {
  router: TRouter
  createContext?: CreateWebExtHandlerOptions<TRouter>['createContext']
  onError?: CreateWebExtHandlerOptions<TRouter>['onError']
  transformer: TRouter['_def']['_config']['transformer']
}

function isClientMessage(message: unknown): message is ClientMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    'trpc' in message &&
    typeof (message as ClientMessage).trpc === 'object'
  )
}

function hasTRPCId(
  trpc: TRPCClientOutgoingMessage,
): trpc is TRPCClientOutgoingMessage & {
  id: NonNullable<TRPCClientOutgoingMessage['id']>
} {
  return 'id' in trpc && trpc.id !== null && trpc.id !== undefined
}

function isSubscriptionStop(
  trpc: TRPCClientOutgoingMessage,
): trpc is TRPCClientOutgoingMessage & { method: 'subscription.stop' } {
  return 'method' in trpc && trpc.method === 'subscription.stop'
}

function isSubscriptionMethod(method: string): method is 'subscription' {
  return method === 'subscription'
}

class PortConnectionManager {
  private readonly portSubscriptions = new Map<
    Runtime.Port,
    PortSubscriptions
  >()

  addPort(port: Runtime.Port): void {
    const portInfo: PortSubscriptions = {
      subscriptions: new Map(),
    }
    this.portSubscriptions.set(port, portInfo)
  }

  getPortSubscriptions(port: Runtime.Port): PortSubscriptions | undefined {
    return this.portSubscriptions.get(port)
  }

  removePort(port: Runtime.Port): void {
    const portInfo = this.portSubscriptions.get(port)
    if (portInfo) {
      portInfo.subscriptions.forEach(subscription => subscription.unsubscribe())
      this.portSubscriptions.delete(port)
    }
  }

  addSubscription(
    port: Runtime.Port,
    id: number | string,
    subscription: Unsubscribable,
  ): boolean {
    const portInfo = this.portSubscriptions.get(port)
    if (!portInfo) return false

    if (portInfo.subscriptions.has(id)) {
      const existingSub = portInfo.subscriptions.get(id)
      existingSub?.unsubscribe()
    }

    portInfo.subscriptions.set(id, subscription)
    return true
  }

  removeSubscription(port: Runtime.Port, id: number | string): boolean {
    const portInfo = this.portSubscriptions.get(port)
    if (!portInfo) return false

    const subscription = portInfo.subscriptions.get(id)
    if (subscription) {
      subscription.unsubscribe()
      portInfo.subscriptions.delete(id)
      return true
    }
    return false
  }
}

function createResponseSender(
  port: Runtime.Port,
  id: NonNullable<TRPCClientOutgoingMessage['id']>,
  jsonrpc: TRPCClientOutgoingMessage['jsonrpc'],
): TRPCResponseSender {
  return response => {
    port.postMessage({
      trpc: { id, jsonrpc, ...response },
    })
  }
}

async function handleSubscriptionStop(
  portManager: PortConnectionManager,
  port: Runtime.Port,
  id: NonNullable<TRPCClientOutgoingMessage['id']>,
  sendResponse: TRPCResponseSender,
): Promise<void> {
  const removed = portManager.removeSubscription(port, id)
  if (removed) {
    sendResponse({
      result: {
        type: 'stopped',
      },
    })
  }
}

async function handleRegularProcedure<TRouter extends AnyRouter>(
  context: MessageHandlerContext<TRouter>,
  trpc: TRPCClientOutgoingMessage,
  port: Runtime.Port,
  sendResponse: TRPCResponseSender,
): Promise<void> {
  if (!('params' in trpc)) {
    throw new TRPCError({
      message: 'Missing params in request',
      code: 'BAD_REQUEST',
    })
  }

  const input = context.transformer.input.deserialize(trpc.params.input)
  const ctx = await context.createContext?.({
    req: port,
    res: undefined,
  })

  const result = await callProcedure({
    router: context.router,
    path: trpc.params.path,
    getRawInput: async () => input,
    ctx,
    type: trpc.method as ProcedureType,
    signal: undefined,
  })

  const serializedData = context.transformer.output.serialize(result)
  sendResponse({
    result: {
      type: 'data',
      data: serializedData,
    },
  })
}

async function handleSubscription<TRouter extends AnyRouter>(
  context: MessageHandlerContext<TRouter>,
  portManager: PortConnectionManager,
  trpc: TRPCClientOutgoingMessage,
  port: Runtime.Port,
  id: NonNullable<TRPCClientOutgoingMessage['id']>,
  sendResponse: TRPCResponseSender,
): Promise<void> {
  if (!('params' in trpc)) {
    throw new TRPCError({
      message: 'Missing params in subscription request',
      code: 'BAD_REQUEST',
    })
  }

  const input = context.transformer.input.deserialize(trpc.params.input)
  const ctx = await context.createContext?.({
    req: port,
    res: undefined,
  })

  const result = await callProcedure({
    router: context.router,
    path: trpc.params.path,
    getRawInput: async () => input,
    ctx,
    type: 'subscription',
    signal: undefined,
  })

  if (!isObservable(result)) {
    throw new TRPCError({
      message: `Subscription ${trpc.params.path} did not return an observable`,
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

      context.onError?.({
        error,
        type: 'subscription',
        path: trpc.params?.path,
        input,
        ctx,
        req: port,
      })

      sendResponse({
        error: getErrorShape({
          error,
          type: 'subscription',
          path: trpc.params?.path,
          input,
          ctx,
          config: context.router._def._config,
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

  const subscriptionAdded = portManager.addSubscription(port, id, subscription)
  if (!subscriptionAdded) {
    subscription.unsubscribe()
    throw new TRPCError({
      message: 'Failed to register subscription',
      code: 'INTERNAL_SERVER_ERROR',
    })
  }

  sendResponse({
    result: {
      type: 'started',
    },
  })
}

function createMessageHandler<TRouter extends AnyRouter>(
  context: MessageHandlerContext<TRouter>,
  portManager: PortConnectionManager,
) {
  return async (message: unknown, port: Runtime.Port): Promise<void> => {
    if (!isClientMessage(message)) return

    const { trpc } = message
    if (!hasTRPCId(trpc)) return

    const portInfo = portManager.getPortSubscriptions(port)
    if (!portInfo) return

    const { id, jsonrpc, method } = trpc
    const sendResponse = createResponseSender(port, id, jsonrpc)

    let input: unknown
    let ctx: unknown

    try {
      if (isSubscriptionStop(trpc)) {
        await handleSubscriptionStop(portManager, port, id, sendResponse)
        return
      }

      if (isSubscriptionMethod(method)) {
        await handleSubscription(
          context,
          portManager,
          trpc,
          port,
          id,
          sendResponse,
        )
      } else {
        await handleRegularProcedure(context, trpc, port, sendResponse)
      }
    } catch (cause) {
      const error = getTRPCErrorFromUnknown(cause)

      context.onError?.({
        error,
        type: method as ProcedureType,
        path: 'params' in trpc ? trpc.params?.path : undefined,
        input,
        ctx,
        req: port,
      })

      sendResponse({
        error: getErrorShape({
          error,
          type: method as ProcedureType,
          path: 'params' in trpc ? trpc.params?.path : undefined,
          input,
          ctx,
          config: context.router._def._config,
        }),
      })
    }
  }
}

function createDisconnectHandler<TRouter extends AnyRouter>(
  portManager: PortConnectionManager,
  onMessage: ReturnType<typeof createMessageHandler<TRouter>>,
) {
  return (port: Runtime.Port): void => {
    port.onMessage.removeListener(onMessage)
    portManager.removePort(port)
  }
}

function createConnectHandler<TRouter extends AnyRouter>(
  context: MessageHandlerContext<TRouter>,
  portManager: PortConnectionManager,
) {
  return (port: Runtime.Port): void => {
    portManager.addPort(port)

    const onMessage = createMessageHandler(context, portManager)
    const onDisconnect = createDisconnectHandler(portManager, onMessage)

    port.onDisconnect.addListener(onDisconnect)
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
export function createWebExtHandler<TRouter extends AnyRouter>(
  opts: CreateWebExtHandlerOptions<TRouter>,
): void {
  const { router, createContext, onError, runtime } = opts
  const { transformer } = router._def._config

  const context: MessageHandlerContext<TRouter> = {
    router,
    createContext,
    onError,
    transformer,
  }

  const portManager = new PortConnectionManager()
  const onConnect = createConnectHandler(context, portManager)

  runtime.onConnect.addListener(onConnect)
}
