import { z } from 'zod'

import type { Report } from '~server/db/schema'

export const createReportSchema = z.object({
  contributorId: z.string().max(12),
  startOfWeek: z.string().datetime({ offset: true }),
  timeOff: z.number().min(0).max(100).nonnegative(),
  milestones: z.array(
    z.object({
      id: z.number(),
      timeSpent: z.number().min(1).max(100).nonnegative(),
    })
  ),
}) satisfies z.ZodType<Pick<Report, 'timeOff'>>

export const updateReportSchema = createReportSchema.omit({
  contributorId: true,
  startOfWeek: true,
})
