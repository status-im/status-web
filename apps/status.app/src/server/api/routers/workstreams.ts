import { and, eq, inArray } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { z } from 'zod'

import { db } from '~server/db'
import { WorkstreamsToProjects } from '~server/db/schema'
import { Workstreams } from '~server/db/schema/workstreams'

import { canEditInsights, canViewInsights, router } from '../lib/trpc'
import { workstreamSchema } from '../validation/workstreams'
import { mapProject } from './projects'

import type { ModelColumns, ModelRelations } from '~server/db/types'

const WORKSTREAM_COLUMNS = {
  id: true,
  createdAt: true,
  name: true,
  description: true,
  color: true,
  emoji: true,
} satisfies ModelColumns<'Workstreams'>

const WORKSTREAM_RELATIONS = {
  workstreamsToProjects: {
    columns: {},
    with: {
      project: {
        with: {
          milestones: {
            with: {
              epics: {
                with: {
                  epic: true,
                },
              },
            },
          },
        },
      },
    },
  },
} satisfies ModelRelations<'Workstreams'>

export const workstreamsRouter = router({
  all: canViewInsights.query(async () => {
    const workstreams = await db.query.Workstreams.findMany({
      columns: WORKSTREAM_COLUMNS,
      with: WORKSTREAM_RELATIONS,
      orderBy: (fields, { asc }) => [asc(fields.createdAt)],
    })

    return workstreams.map(({ workstreamsToProjects, ...workstream }) => {
      return {
        ...workstream,
        projects: workstreamsToProjects.map(({ project }) =>
          mapProject(project)
        ),
      }
    })
  }),

  byId: canViewInsights
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const workstream = await db.query.Workstreams.findFirst({
        columns: WORKSTREAM_COLUMNS,
        with: WORKSTREAM_RELATIONS,
        where(fields, { eq }) {
          return eq(fields.id, input.id)
        },
      })

      if (!workstream) {
        return notFound()
      }

      const { workstreamsToProjects, ...data } = workstream
      return {
        ...data,
        projects: workstreamsToProjects.map(({ project }) =>
          mapProject(project)
        ),
      }
    }),

  create: canEditInsights
    .input(workstreamSchema)
    .mutation(async ({ input }) => {
      const [workstream] = await db
        .insert(Workstreams)
        .values(input)
        .returning()

      return workstream
    }),

  update: canEditInsights
    .input(
      z.object({
        id: z.number(),
        values: workstreamSchema,
      })
    )
    .mutation(async ({ input }) => {
      const { values } = input

      const [updatedWorkstream] = await db
        .update(Workstreams)
        .set(values)
        .where(eq(Workstreams.id, input.id))
        .returning()

      return updatedWorkstream
    }),

  delete: canEditInsights
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .delete(WorkstreamsToProjects)
        .where(eq(WorkstreamsToProjects.workstreamId, input.id))

      const [deletedWorkstream] = await db
        .delete(Workstreams)
        .where(eq(Workstreams.id, input.id))
        .returning()

      return deletedWorkstream.id
    }),

  updateProjects: canEditInsights
    .input(
      z.object({
        id: z.number(),
        projectIds: z.array(z.number()),
      })
    )
    .mutation(async ({ input }) => {
      const { projectIds } = input

      const workstreamProjects = await db.query.WorkstreamsToProjects.findMany({
        where(fields, op) {
          return op.eq(fields.workstreamId, input.id)
        },
      })
      const workstreamProjectIds = workstreamProjects.map(
        ({ projectId }) => projectId
      )

      const toInsert = projectIds.filter(
        id => !workstreamProjectIds.includes(id)
      )
      const toDelete = workstreamProjectIds.filter(
        id => !projectIds.includes(id)
      )

      if (toInsert.length === 0 && toDelete.length === 0) {
        return {}
      }

      await db.transaction(async trx => {
        if (toDelete.length > 0) {
          await trx
            .delete(WorkstreamsToProjects)
            .where(
              and(
                eq(WorkstreamsToProjects.workstreamId, input.id),
                inArray(WorkstreamsToProjects.projectId, toDelete)
              )
            )
        }

        if (toInsert.length > 0) {
          await trx.insert(WorkstreamsToProjects).values(
            toInsert.map(projectId => ({
              workstreamId: input.id,
              projectId,
            }))
          )
        }
      })
    }),

  removeProject: canEditInsights
    .input(
      z.object({
        workstreamId: z.number(),
        projectId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .delete(WorkstreamsToProjects)
        .where(
          and(
            eq(WorkstreamsToProjects.workstreamId, input.workstreamId),
            eq(WorkstreamsToProjects.projectId, input.projectId)
          )
        )

      return {}
    }),
})
