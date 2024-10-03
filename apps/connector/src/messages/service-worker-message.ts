import { z } from 'zod'

export const ServiceWorkerMessage = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('status:icon:clicked'),
  }),
])

export type ServiceWorkerMessage = z.infer<typeof ServiceWorkerMessage>
