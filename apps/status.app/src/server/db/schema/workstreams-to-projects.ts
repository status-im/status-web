import { relations } from 'drizzle-orm'
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { Projects } from './projects'
import { Workstreams } from './workstreams'

export const WorkstreamsToProjects = pgTable(
  'workstreams_to_projects',
  {
    workstreamId: integer('workstream_id')
      .notNull()
      .references(() => Workstreams.id),
    projectId: integer('project_id')
      .notNull()
      .references(() => Projects.id),
  },
  t => ({
    pk: primaryKey({
      columns: [t.workstreamId, t.projectId],
      name: 'workstreams_to_projects_workstream_id_project_id_pk',
    }),
  })
)

export const WorkstreamsToProjectsRelations = relations(
  WorkstreamsToProjects,
  ({ one }) => ({
    workstream: one(Workstreams, {
      fields: [WorkstreamsToProjects.workstreamId],
      references: [Workstreams.id],
    }),
    project: one(Projects, {
      fields: [WorkstreamsToProjects.projectId],
      references: [Projects.id],
    }),
  })
)
