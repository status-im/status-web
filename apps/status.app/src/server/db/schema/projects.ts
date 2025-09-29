import { relations } from 'drizzle-orm'
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

import { publicId } from '~server/api/lib/public-id'

import { Milestones } from './milestones'
import { WorkstreamsToProjects } from './workstreams-to-projects'

export const ProjectApp = pgEnum('app', [
  'shell',
  'communities',
  'messenger',
  'wallet',
  'browser',
  'node',
])

export const Projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  publicId: varchar('public_id', { length: 12 })
    .$defaultFn(() => publicId())
    .notNull()
    .unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  // updatedAt: timestamp('updated_at').defaultNow(),

  position: integer('position').notNull(),
  name: varchar('name', { length: 30 }).notNull().unique(),
  description: varchar('description', { length: 512 }).notNull(),
  app: ProjectApp('app').notNull(),
  // color: varchar('color', { length: 36 }).notNull(),
})

export const ProjectRelations = relations(Projects, ({ many }) => ({
  workstreamsToProjects: many(WorkstreamsToProjects),
  milestones: many(Milestones),
}))

export type Project = typeof Projects.$inferSelect
