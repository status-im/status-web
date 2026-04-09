import { z } from 'zod'

/**
 * @see https://eips.ethereum.org/EIPS/eip-1193#request-1
 */
export const RequestArguments = z.object({
  method: z.string(),
  params: z.unknown().optional(),
})

export type RequestArguments = z.infer<typeof RequestArguments>

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
