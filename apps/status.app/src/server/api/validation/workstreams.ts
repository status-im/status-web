import { z } from 'zod'

import type { Workstream } from '~server/db/schema'

export const workstreamSchema = z.object({
  name: z.string().max(30).nonempty('Name is required.'),
  description: z.string().max(512).nonempty('Description is required.'),
  color: z.string().max(9).nonempty('Color is required.'),
  emoji: z.string().max(12).nonempty('Emoji is required.'),
  // custom
  // projectIds: z.array(z.number()).min(1, 'At least one epic is required.'),
}) satisfies z.ZodType<
  Pick<Workstream, 'name' | 'description' | 'color' | 'emoji'>
>
