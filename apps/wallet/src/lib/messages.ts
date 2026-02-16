import { z } from 'zod'

/**
 * @see https://eips.ethereum.org/EIPS/eip-1193#request-1
 * @see https://www.jsonrpc.org/specification#request_object
 */
export const RequestArguments = z.object({
  method: z.string(),
  params: z.unknown().optional(),
})

export type RequestArguments = z.infer<typeof RequestArguments>

/**
 * Messages from the MAIN world provider to the ISOLATED world bridge.
 * Sent via window.postMessage + MessageChannel.
 */
export const ProviderMessage = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('status:provider'),
    data: RequestArguments,
  }),
  z.object({
    type: z.literal('status:provider:disconnect'),
  }),
])

export type ProviderMessage = z.infer<typeof ProviderMessage>

/**
 * Response messages from the bridge back to the provider.
 * Sent via MessageChannel port.
 */
export const ProxyMessage = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('status:proxy:success'),
    data: z.unknown(),
  }),
  z.object({
    type: z.literal('status:proxy:error'),
    error: z.object({
      code: z.number(),
      message: z.string(),
    }),
  }),
])

export type ProxyMessage = z.infer<typeof ProxyMessage>

/**
 * Messages from the bridge to the background service worker.
 * Sent via chrome.runtime.sendMessage.
 */
export const RpcMessage = z.object({
  type: z.literal('status:rpc'),
  data: z.object({
    method: z.string(),
    params: z.unknown().optional(),
    origin: z.string(),
  }),
})

export type RpcMessage = z.infer<typeof RpcMessage>
