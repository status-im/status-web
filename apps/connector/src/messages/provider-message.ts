import { z } from 'zod'

import { RequestArguments } from '~lib/request-arguments'

export const ProviderMessage = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('status:provider'),
    data: RequestArguments,
  }),
  z.object({
    type: z.literal('status:provider:disconnect'),
  }),
  z.object({
    type: z.literal('status:provider:data'),
  }),
])

export type ProviderMessage = z.infer<typeof ProviderMessage>
