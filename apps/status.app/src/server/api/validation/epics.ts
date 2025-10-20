import { z } from 'zod'

import type { Epic } from '~server/db/schema'

export const epicSchema = z.object({
  name: z.string().max(30).nonempty('Name is required.'),
  description: z.string().max(512).nonempty('Description is required.'),
  color: z.string().max(9).nonempty('Color is required.'),
  status: z.enum(['not-started', 'in-progress', 'done']),
}) satisfies z.ZodType<Pick<Epic, 'name' | 'description' | 'color' | 'status'>>
