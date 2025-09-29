import { relations } from 'drizzle-orm'
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { Milestones } from './milestones'

export const ReleasesToMilestones = pgTable(
  'releases_to_milestones',
  {
    releaseId: integer('release_id').notNull(),
    milestoneId: integer('milestone_id')
      .notNull()
      .references(() => Milestones.id),
  },
  t => ({
    pk: primaryKey({
      columns: [t.releaseId, t.milestoneId],
      name: 'releases_to_milestones_release_id_milestone_id_pk',
    }),
  })
)

export const ReleasesToMilestonesRelations = relations(
  ReleasesToMilestones,
  ({ one }) => ({
    milestone: one(Milestones, {
      fields: [ReleasesToMilestones.milestoneId],
      references: [Milestones.id],
    }),
  })
)
