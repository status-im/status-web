import { z } from 'zod'

import type { Milestone } from '~server/db/schema'

export const milestoneSchema = z.object({
  name: z.string().max(30).nonempty('Name is required.'),
  description: z.string().max(512).nonempty('Description is required.'),
  // custom
  links: z.array(z.string()),
  epicIds: z.array(z.number()).min(1, 'At least one epic is required.'),
}) satisfies z.ZodType<Pick<Milestone, 'name' | 'description'>>
