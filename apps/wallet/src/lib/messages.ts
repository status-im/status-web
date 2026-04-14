import { z } from 'zod'

export {
  ProviderMessage,
  ProxyMessage,
  RequestArguments,
} from '@status-im/ethereum-provider'

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
    title: z.string().optional(),
    favicon: z.string().optional(),
  }),
})

export type RpcMessage = z.infer<typeof RpcMessage>
