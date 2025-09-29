import { z } from 'zod'

import type { Project } from '~server/db/schema/projects'

export const projectSchema = z.object({
  name: z.string().max(30).nonempty('Name is required.'),
  description: z.string().max(512).nonempty('Description is required.'),
  app: z.enum([
    'shell',
    'communities',
    'messenger',
    'wallet',
    'browser',
    'node',
  ]),
}) satisfies z.ZodType<Pick<Project, 'name' | 'description' | 'app'>>
