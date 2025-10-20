import { TRPCError } from '@trpc/server'
import { and, eq, gt, gte, inArray, lt, lte, sql } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { z } from 'zod'

import { groupBy } from '~/utils/group-by'
import { db } from '~server/db'
import {
  Milestones,
  MilestonesToEpics,
  Projects,
  WorkstreamsToProjects,
} from '~server/db/schema'

import { authProcedure, canEditInsights, router } from '../lib/trpc'
import { milestoneSchema } from '../validation/milestones'
import { projectSchema } from '../validation/projects'

import type {
  InferQueryModel,
  ModelColumns,
  ModelRelations,
} from '~server/db/types'

const PROJECT_COLUMNS = {
  id: true,
  createdAt: true,
  name: true,
  description: true,
  app: true,
  position: true,
} satisfies ModelColumns<'Projects'>

const PROJECT_RELATIONS = {
  milestones: {
    columns: {
      id: true,
      name: true,
      description: true,
    },
    with: {
      epics: {
        with: {
          epic: {
            columns: {
              id: true,
              status: true,
              name: true,
              color: true,
            },
          },
        },
      },
    },
  },
} satisfies ModelRelations<'Projects'>

const getProjectStatus = (
  epics: Array<
    InferQueryModel<'Epics', { columns: { id: true; status: true } }>
  >
): 'done' | 'in-progress' | 'paused' | 'not-started' => {
  const epicsByStatus = groupBy(epics, e => e.status, {
    done: [],
    'in-progress': [],
    'not-started': [],
  })

  if (epics.length === 0) {
    return 'not-started'
  }

  if (epicsByStatus['done'].length === epics.length) {
    return 'done'
  }

  if (epicsByStatus['in-progress'].length > 0) {
    return 'in-progress'
  }

  if (
    epicsByStatus['not-started'].length > 0 &&
    epicsByStatus['done'].length > 0 &&
    epicsByStatus['in-progress'].length === 0
  ) {
    return 'paused'
  }

  return 'not-started'
}

function getMilestoneStatus(
  epics: Array<
    InferQueryModel<'Epics', { columns: { id: true; status: true } }>
  >
): 'done' | 'in-progress' | 'paused' | 'not-started' {
  const epicsByStatus = groupBy(epics, e => e.status, {
    done: [],
    'in-progress': [],
    'not-started': [],
  })

  if (epics.length === 0) {
    return 'not-started'
  }

  if (epicsByStatus['done'].length === epics.length) {
    return 'done'
  }

  if (epicsByStatus['in-progress'].length > 0) {
    return 'in-progress'
  }

  if (
    epicsByStatus['not-started'].length > 0 &&
    epicsByStatus['done'].length > 0
  ) {
    return 'paused'
  }

  return 'not-started'
}

export function mapProject(
  project: InferQueryModel<
    'Projects',
    {
      columns: typeof PROJECT_COLUMNS
      with: typeof PROJECT_RELATIONS
    }
  >
) {
  const milestoneEpics = project.milestones.map(milestone =>
    milestone.epics.map(({ epic }) => epic)
  )
  const milesoneEpics = milestoneEpics.flat()

  return {
    ...project,
    status: getProjectStatus(milesoneEpics),
    milestones: project.milestones.map((milestone, index) => ({
      ...milestone,
      project: {
        id: project.id,
        name: project.name,
        app: project.app,
      },
      status: getMilestoneStatus(milestoneEpics[index]),
      epics: milestoneEpics[index],
    })),
  }
}

export const projectsRouter = router({
  all: authProcedure.query(async () => {
    const projects = await db.query.Projects.findMany({
      orderBy: (fields, { asc }) => [asc(fields.position)],
      columns: PROJECT_COLUMNS,
      with: PROJECT_RELATIONS,
    })

    return projects.map(project => mapProject(project))
  }),

  byId: authProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const project = await db.query.Projects.findFirst({
        columns: PROJECT_COLUMNS,
        with: PROJECT_RELATIONS,
        where(fields, { eq }) {
          return eq(fields.id, input.id)
        },
      })

      if (!project) {
        return notFound()
      }

      return mapProject(project)
    }),

  create: authProcedure.input(projectSchema).mutation(async ({ input }) => {
    const [newProject] = await db
      .insert(Projects)
      .values({
        ...input,
        position: 0,
      })
      .returning()

    await db.update(Projects).set({
      position: sql`${Projects.position} + 1`,
    })

    return newProject
  }),

  update: authProcedure
    .input(
      z.object({
        id: z.number(),
        values: projectSchema,
      })
    )
    .mutation(async ({ input }) => {
      const [updatedProject] = await db
        .update(Projects)
        .set(input.values)
        .where(eq(Projects.id, input.id))
        .returning()

      return updatedProject
    }),

  updatePosition: authProcedure
    .input(
      z.object({
        id: z.number(),
        to: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const project = await db.query.Projects.findFirst({
        where: (fields, { eq }) => eq(fields.id, input.id),
      })

      if (!project) {
        throw new Error('Project not found')
      }

      const from = project.position

      await db.transaction(async trx => {
        if (input.to < from) {
          // Moving upwards -> increment positions of intervening projects
          await trx
            .update(Projects)
            .set({
              position: sql`${Projects.position} + 1`,
            })
            .where(
              and(gte(Projects.position, input.to), lt(Projects.position, from))
            )
        } else if (input.to > from) {
          // Moving downwards -> decrement positions of intervening projects
          await trx
            .update(Projects)
            .set({ position: sql`${Projects.position} - 1` })
            .where(
              and(lte(Projects.position, input.to), gt(Projects.position, from))
            )
        }

        await trx
          .update(Projects)
          .set({ position: input.to })
          .where(eq(Projects.id, input.id))
          .returning()
      })
    }),

  delete: authProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const project = await db.query.Projects.findFirst({
        columns: {
          id: true,
        },
        where(fields, { eq }) {
          return eq(fields.id, input.id)
        },
        with: {
          workstreamsToProjects: {
            columns: { workstreamId: true },
          },
          milestones: {
            columns: {},
            // with:{
            //   releasesToMilestones: true,
            //   reportsToMilestones: true,
            // }
          },
        },
      })

      if (!project) {
        return notFound()
      }

      if (project.workstreamsToProjects.length > 0) {
        throw new Error('Cannot delete project with workstreams')
      }

      if (project.milestones.length > 0) {
        throw new Error('Cannot delete project with milestones')
      }

      await db.transaction(async trx => {
        await trx
          .delete(WorkstreamsToProjects)
          .where(eq(WorkstreamsToProjects.projectId, input.id))
        await trx.delete(Projects).where(eq(Projects.id, input.id))
      })

      return {}
    }),

  createMilestone: canEditInsights
    .input(
      z.object({
        projectId: z.number(),
        milestone: milestoneSchema,
      })
    )
    .mutation(async ({ input }) => {
      const project = await db.query.Projects.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, input.projectId)
        },
      })

      if (!project) {
        return notFound()
      }

      const [newMilestone] = await db
        .insert(Milestones)
        .values({
          position: 0,
          projectId: project.id,
          name: input.milestone.name,
          description: input.milestone.description,
        })
        .returning()

      await db.insert(MilestonesToEpics).values(
        input.milestone.epicIds.map(epicId => ({
          epicId,
          milestoneId: newMilestone.id,
        }))
      )

      return {}
    }),

  updateMilestone: authProcedure
    .input(
      z.object({
        milestoneId: z.number(),
        values: milestoneSchema,
      })
    )
    .mutation(async ({ input }) => {
      const { epicIds, ...values } = input.values

      const [updatedMilestone] = await db
        .update(Milestones)
        .set({
          name: values.name,
          description: values.description,
        })
        .where(eq(Milestones.id, input.milestoneId))
        .returning()

      const currentEpics = await db.query.MilestonesToEpics.findMany({
        where(fields, op) {
          return op.eq(fields.milestoneId, input.milestoneId)
        },
      })

      const currentEpicIds = currentEpics.map(({ epicId }) => epicId)
      const toInsert = epicIds.filter(
        epicId => !currentEpicIds.includes(epicId)
      )
      const toDelete = currentEpicIds.filter(id => !epicIds.includes(id))

      if (toInsert.length === 0 && toDelete.length === 0) {
        return updatedMilestone
      }

      await db.transaction(async trx => {
        if (toInsert.length > 0) {
          await trx.insert(MilestonesToEpics).values(
            toInsert.map(epicId => ({
              epicId,
              milestoneId: updatedMilestone.id,
            }))
          )
        }

        if (toDelete.length > 0) {
          await trx
            .delete(MilestonesToEpics)
            .where(
              and(
                eq(MilestonesToEpics.milestoneId, input.milestoneId),
                inArray(MilestonesToEpics.epicId, toDelete)
              )
            )
        }
      })

      return updatedMilestone
    }),

  deleteMilestone: canEditInsights
    .input(
      z.object({
        milestoneId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const milestone = await db.query.Milestones.findFirst({
        columns: {},
        where(fields) {
          return eq(fields.id, input.milestoneId)
        },
        with: {
          releasesToMilestones: {
            columns: {
              releaseId: true,
            },
          },
          reportsToMilestones: {
            columns: {
              reportId: true,
            },
          },
        },
      })

      if (!milestone) {
        return notFound()
      }

      if (milestone.releasesToMilestones.length > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot delete milestone with releases',
        })
      }

      if (milestone.reportsToMilestones.length > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot delete milestone with reports',
        })
      }

      await db.transaction(async trx => {
        await trx
          .delete(MilestonesToEpics)
          .where(eq(MilestonesToEpics.milestoneId, input.milestoneId))
        await trx.delete(Milestones).where(eq(Milestones.id, input.milestoneId))
      })

      return {}
    }),
})
