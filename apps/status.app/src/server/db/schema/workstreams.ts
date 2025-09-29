import { relations } from 'drizzle-orm'
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'

import { publicId } from '~server/api/lib/public-id'

import { WorkstreamsToProjects } from './workstreams-to-projects'

export const Workstreams = pgTable('workstreams', {
  id: serial('id').primaryKey(),
  publicId: varchar('public_id', { length: 12 })
    .$defaultFn(() => publicId())
    .notNull()
    .unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  // updatedAt: timestamp('updated_at').defaultNow(),
  name: varchar('name', { length: 256 }).notNull().unique(),
  description: varchar('description', { length: 512 }).notNull(),
  color: varchar('color', { length: 36 }).notNull(),
  emoji: varchar('emoji', { length: 12 }).notNull(),
  // todo?: type
  // authorId: serial('author_id').references(() => contributors.id),
})

export const WorkstreamsRelations = relations(Workstreams, ({ many }) => ({
  workstreamsToProjects: many(WorkstreamsToProjects),
}))

export type Workstream = typeof Workstreams.$inferSelect
