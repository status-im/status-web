import { z } from 'zod'

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
