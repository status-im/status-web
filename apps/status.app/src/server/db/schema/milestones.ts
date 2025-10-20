import { relations } from 'drizzle-orm'
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

import { publicId } from '~server/api/lib/public-id'

import { MilestonesToEpics } from './milestones-to-epics'
import { Projects } from './projects'
import { ReleasesToMilestones } from './releases-to-milestones'
import { ReportsToMilestones } from './reports-to-milestones'

export const Milestones = pgTable('milestones', {
  id: serial('id').primaryKey(),
  publicId: varchar('public_id', { length: 12 })
    .$defaultFn(() => publicId())
    .notNull()
    .unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  name: varchar('name', { length: 30 }).notNull(),
  description: varchar('description', { length: 512 }).notNull(),
  position: integer('position').notNull(),
  projectId: integer('project_id').notNull(),
})

export const MilestonesRelations = relations(Milestones, ({ many, one }) => ({
  project: one(Projects, {
    fields: [Milestones.projectId],
    references: [Projects.id],
  }),
  epics: many(MilestonesToEpics),
  releasesToMilestones: many(ReleasesToMilestones),
  // links: many(MilestoneLinks),
  reportsToMilestones: many(ReportsToMilestones),
}))

export type Milestone = typeof Milestones.$inferSelect
