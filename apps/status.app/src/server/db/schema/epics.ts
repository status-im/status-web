import { relations } from 'drizzle-orm'
import {
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

import { publicId } from '~server/api/lib/public-id'

import { MilestonesToEpics } from './milestones-to-epics'

export const EpicStatus = pgEnum('epic_status', [
  'done',
  'in-progress',
  'not-started',
])

export const Epics = pgTable('epics', {
  id: serial('id').primaryKey(),
  publicId: varchar('public_id', { length: 12 })
    .$defaultFn(() => publicId())
    .notNull()
    .unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  // updatedAt: timestamp('updated_at').defaultNow(),
  // updatedBy: varchar('update_by', { length: 256 }),

  name: varchar('name', { length: 256 }).notNull().unique(),
  description: varchar('description', { length: 512 }).notNull(),
  color: varchar('color', { length: 36 }).notNull(),
  status: EpicStatus('status').notNull().default('not-started'),

  // note: labels in every platform's GitHub repository.
  // githubIds: text('github_ids').array(),
  // note: label ids in hasura
  // githubEpicNames: text('github_epic_names').array(),
})

export const EpicsRelations = relations(Epics, ({ many }) => ({
  milestonesToEpics: many(MilestonesToEpics),
}))

export type Epic = typeof Epics.$inferSelect
