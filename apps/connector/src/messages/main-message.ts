import { z } from 'zod'

import { RequestArguments } from '~lib/request-arguments'

export const MainMessage = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('status:main'),
    data: RequestArguments,
  }),
])

export type MainMessage = z.infer<typeof MainMessage>
