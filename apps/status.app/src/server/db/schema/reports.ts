import { relations } from 'drizzle-orm'
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

import { publicId } from '~server/api/lib/public-id'

import { ReportsToMilestones } from './reports-to-milestones'
import { Users } from './users'

// todo?: use lowercase
export const Reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  publicId: varchar('public_id', { length: 12 })
    .$defaultFn(() => publicId())
    .notNull()
    .unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  // todo?: use `.references()` with `SET NULL` action
  userId: integer('user_id').notNull(),
  /** BambooHR ID */
  contributorId: varchar('contributor_id', { length: 12 }).notNull(),
  startOfWeek: timestamp('start_of_week', { withTimezone: true }).notNull(),
  timeOff: integer('time_off').notNull().default(0),
})

export const ReportsRelations = relations(Reports, ({ one, many }) => ({
  author: one(Users, {
    fields: [Reports.userId],
    references: [Users.id],
  }),
  reportsToMilestones: many(ReportsToMilestones),
}))

export type Report = typeof Reports.$inferSelect
