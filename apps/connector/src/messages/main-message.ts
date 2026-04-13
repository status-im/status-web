import { RequestArguments } from '@status-im/ethereum-provider'
import { z } from 'zod'

export const MainMessage = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('status:main'),
    data: RequestArguments,
  }),
])

export type MainMessage = z.infer<typeof MainMessage>
