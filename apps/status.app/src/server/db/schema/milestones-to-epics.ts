import { relations } from 'drizzle-orm'
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { Epics } from './epics'
import { Milestones } from './milestones'

export const MilestonesToEpics = pgTable(
  'milestones_to_epics',
  {
    milestoneId: integer('milestone_id')
      .notNull()
      .references(() => Milestones.id),
    epicId: integer('epic_id')
      .notNull()
      .references(() => Epics.id),
  },
  t => ({
    pk: primaryKey({
      columns: [t.milestoneId, t.epicId],
      name: 'milestones_to_epics_milestone_id_epic_id_pk',
    }),
  })
)

export const MilestonesToEpicsRelations = relations(
  MilestonesToEpics,
  ({ one }) => ({
    milestone: one(Milestones, {
      fields: [MilestonesToEpics.milestoneId],
      references: [Milestones.id],
    }),
    epic: one(Epics, {
      fields: [MilestonesToEpics.epicId],
      references: [Epics.id],
    }),
  })
)
