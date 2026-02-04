import { z } from 'zod-3-23-8'

import { RequestArguments } from '~lib/request-arguments'

export const MainMessage = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('status:main'),
    data: RequestArguments,
  }),
])

export type MainMessage = z.infer<typeof MainMessage>
