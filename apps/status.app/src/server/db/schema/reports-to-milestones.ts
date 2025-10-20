import { relations } from 'drizzle-orm'
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { Milestones } from './milestones'
import { Reports } from './reports'

export const ReportsToMilestones = pgTable(
  'reports_to_milestones',
  {
    reportId: integer('report_id')
      .notNull()
      .references(() => Reports.id),
    milestoneId: integer('milestone_id')
      .notNull()
      .references(() => Milestones.id),
    timeSpent: integer('time_spent').notNull(),
  },
  t => ({
    pk: primaryKey({
      columns: [t.reportId, t.milestoneId],
      name: 'reports_to_milestones_report_id_milestone_id_pk',
    }),
  })
)

export const ReportsToMilestonesRelations = relations(
  ReportsToMilestones,
  ({ one }) => ({
    report: one(Reports, {
      fields: [ReportsToMilestones.reportId],
      references: [Reports.id],
    }),
    milestone: one(Milestones, {
      fields: [ReportsToMilestones.milestoneId],
      references: [Milestones.id],
    }),
  })
)
