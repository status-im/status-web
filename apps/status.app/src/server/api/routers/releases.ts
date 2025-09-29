import { TRPCError } from '@trpc/server'
import { and, eq, inArray } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '~server/db'
import { ReleasesToMilestones } from '~server/db/schema'
import { getMilestone, getMilestones } from '~server/lib/insights/milestones'

import { canEditInsights, canViewInsights, router } from '../lib/trpc'
import { mapMilestone } from './milestones'

import type { GitHubMilestone } from '~server/lib/insights/milestones'

type ReleasePlatform = 'desktop' | 'mobile'

const mapGitHubMilestoneToRelease = (milestone: GitHubMilestone) => ({
  id: milestone.id,
  title: milestone.title,
  description: milestone.description,
  dueOn: milestone.due_on,
  url: milestone.html_url,
  platform: (milestone.repository === 'status-im/status-desktop'
    ? 'desktop'
    : 'mobile') as ReleasePlatform,
})

async function getRelease(id: number) {
  const [githubMilestone, milestones] = await Promise.all([
    getMilestone(id),
    db.query.ReleasesToMilestones.findMany({
      where(fields, op) {
        return op.eq(fields.releaseId, id)
      },
      with: {
        milestone: {
          columns: {
            id: true,
            name: true,
            description: true,
            position: true,
          },
          with: {
            project: {
              columns: {
                id: true,
                name: true,
                app: true,
              },
            },
            epics: {
              columns: {},
              with: {
                epic: true,
              },
            },
          },
        },
      },
    }),
  ])

  if (!githubMilestone) {
    throw new TRPCError({ code: 'NOT_FOUND' })
  }

  return {
    ...mapGitHubMilestoneToRelease(githubMilestone),
    milestones: milestones.map(({ milestone }) => {
      return mapMilestone(milestone)
    }),
  }
}

export const releasesRouter = router({
  all: canViewInsights.query(async () => {
    const [githubMilestones, milestones] = await Promise.all([
      getMilestones(),
      db.query.ReleasesToMilestones.findMany({
        with: {
          milestone: {
            columns: {
              id: true,
              name: true,
              description: true,
              position: true,
            },
            with: {
              project: {
                columns: {
                  id: true,
                  name: true,
                  app: true,
                },
              },
              epics: {
                columns: {},
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
        },
      }),
    ])

    const milestonesByReleaseId = milestones.reduce<
      Record<number, ReturnType<typeof mapMilestone>[]>
    >((acc, { releaseId, milestone }) => {
      acc[releaseId] ??= []
      acc[releaseId].push(mapMilestone(milestone))
      return acc
    }, {})

    return githubMilestones.map(githubMilestone => {
      return {
        ...mapGitHubMilestoneToRelease(githubMilestone),
        milestones: milestonesByReleaseId[githubMilestone.id] ?? [],
      }
    })
  }),

  byId: canViewInsights
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getRelease(input.id)
    }),

  updateMilestones: canEditInsights
    .input(
      z.object({
        releaseId: z.number(),
        milestoneIds: z.array(z.number()),
      })
    )
    .mutation(async ({ input }) => {
      const { milestoneIds } = input

      try {
        const release = await getRelease(input.releaseId)
        const releaseMilestoneIds = release.milestones.map(
          milestone => milestone.id
        )

        const toCreate = milestoneIds.filter(
          id => !releaseMilestoneIds.includes(id)
        )
        const toDelete = releaseMilestoneIds.filter(
          id => !milestoneIds.includes(id)
        )

        if (toCreate.length === 0 && toDelete.length === 0) {
          return release
        }

        await db.transaction(async trx => {
          if (toCreate.length > 0) {
            await trx.insert(ReleasesToMilestones).values(
              toCreate.map(milestoneId => ({
                milestoneId,
                releaseId: input.releaseId,
              }))
            )
          }

          if (toDelete.length > 0) {
            await trx
              .delete(ReleasesToMilestones)
              .where(
                and(
                  eq(ReleasesToMilestones.releaseId, input.releaseId),
                  inArray(ReleasesToMilestones.milestoneId, toDelete)
                )
              )
          }
        })

        return getRelease(input.releaseId)
      } catch {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
    }),

  removeMilestone: canEditInsights
    .input(z.object({ releaseId: z.number(), milestoneId: z.number() }))
    .mutation(async ({ input }) => {
      await db
        .delete(ReleasesToMilestones)
        .where(
          and(
            eq(ReleasesToMilestones.releaseId, input.releaseId),
            eq(ReleasesToMilestones.milestoneId, input.milestoneId)
          )
        )

      return input.milestoneId
    }),
})
