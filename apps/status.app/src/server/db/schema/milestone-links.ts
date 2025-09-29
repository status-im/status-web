import { relations } from 'drizzle-orm'
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

import { publicId } from '~server/api/lib/public-id'

import { Milestones } from './milestones'

export const MilestoneLinks = pgTable('milestone_links', {
  id: serial('id').primaryKey(),
  publicId: varchar('public_id', { length: 12 })
    .$defaultFn(() => publicId())
    .notNull()
    .unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  name: varchar('name', { length: 30 }).notNull(),
  url: varchar('url', { length: 300 }).notNull(),
  milestoneId: integer('milestone_id').notNull(),
})

export const MilestoneLinksRelations = relations(MilestoneLinks, ({ one }) => ({
  milestone: one(Milestones, {
    fields: [MilestoneLinks.milestoneId],
    references: [Milestones.id],
  }),
}))

export type MilestoneLink = typeof MilestoneLinks.$inferSelect
