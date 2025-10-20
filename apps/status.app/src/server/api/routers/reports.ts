import { UTCDate } from '@date-fns/utc'
import { eachWeekOfInterval, startOfWeek } from 'date-fns'
import { and, desc, eq, inArray } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { z } from 'zod'

import { db } from '~server/db'
import { Reports, ReportsToMilestones } from '~server/db/schema'

import { canEditReports, router } from '../lib/trpc'
import { createReportSchema, updateReportSchema } from '../validation/reports'

import type { Contributor } from '~server/services/bamboohr'

export const reportsRouter = router({
  summary: canEditReports.query(async ({ ctx }) => {
    const { user } = ctx.session

    const { userContributorInfo, supervisees } = ctx

    const reports = await db.query.Reports.findMany({
      where(fields) {
        return and(
          eq(fields.userId, user.id),
          inArray(fields.contributorId, [
            ...supervisees.map(({ id }) => id),
            user.contributorId,
          ])
        )
      },
      columns: {
        id: true,
        userId: true,
        contributorId: true,
        startOfWeek: true,
      },
      with: {
        reportsToMilestones: {
          columns: {},
          with: {
            milestone: true,
          },
        },
      },
    })

    const summary = reports.reduce(
      (acc, report) => {
        const contributor = acc.find(
          ({ contributorId }) => contributorId === report.contributorId
        )

        contributor!.outstanding.splice(
          contributor!.outstanding.findIndex(
            startOfWeek =>
              startOfWeek.getTime() === report.startOfWeek.getTime()
          ),
          1
        )

        return acc
      },
      [userContributorInfo, ...supervisees].map(contributor => ({
        contributorId: contributor.id,
        name: contributor.displayName,
        photoUrl: contributor.customGitHubusername
          ? `https://github.com/${contributor.customGitHubusername}.png?size=40`
          : undefined,
        // todo?: use db query/transaction instead
        outstanding: eachWeekOfInterval(
          { start: new UTCDate('2024-04-01'), end: new UTCDate() },
          {
            // locale: enGB,
            weekStartsOn: 1,
          }
        ),
      }))
    )

    // todo?: order
    return summary
  }),

  byContributorId: canEditReports
    .input(
      z.object({
        contributorId: z.string().max(12),
      })
    )
    .query(async ({ input, ctx }) => {
      const { user } = ctx.session
      const { supervisees, userContributorInfo } = ctx

      let contributor: Contributor | undefined
      if (input.contributorId === user.contributorId) {
        contributor = userContributorInfo
      } else {
        contributor = supervisees.find(
          contributor => contributor.id === input.contributorId
        )
      }

      if (!contributor) {
        return notFound()
      }

      const reports = await db.query.Reports.findMany({
        where(fields) {
          return and(
            eq(fields.userId, user.id),
            eq(fields.contributorId, input.contributorId)
          )
        },
        orderBy(fields) {
          return [desc(fields.startOfWeek)]
        },
        columns: {
          id: true,
          userId: true,
          contributorId: true,
          startOfWeek: true,
          timeOff: true,
        },
        with: {
          reportsToMilestones: {
            columns: {
              timeSpent: true,
            },
            with: {
              milestone: true,
            },
          },
        },
      })

      const weeks = eachWeekOfInterval(
        { start: new UTCDate('2024-04-01'), end: new UTCDate() },
        {
          // locale: enGB,
          weekStartsOn: 1,
        }
      )

      const reportsByStatus = reports.reduce(
        (acc, report) => {
          acc.closed.push({
            id: report.id,
            startOfWeek: report.startOfWeek,
            timeOff: report.timeOff,
            milestones: report.reportsToMilestones.map(
              ({ milestone, timeSpent }) => ({
                ...milestone,
                timeSpent,
              })
            ),
          })

          acc.outstanding.splice(
            acc.outstanding.findIndex(
              ({ startOfWeek }) =>
                startOfWeek.getTime() === report.startOfWeek.getTime()
            ),
            1
          )
          // delete acc.outstanding[
          //   acc.outstanding.findIndex(
          //     ({ startOfWeek }) => startOfWeek === report.startOfWeek
          //   )
          // ]

          return acc
        },
        {
          userId: user.id,
          contributor: {
            id: contributor.id,
            name: contributor.displayName,
            customGitHubusername: contributor.customGitHubusername,
            jobTitle: contributor.jobTitle,
            photoUrl: contributor.customGitHubusername
              ? `https://github.com/${contributor.customGitHubusername}.png?size=96`
              : undefined,
          },
          outstanding: weeks.map(week => ({
            startOfWeek: week,
          })),
          // fixme!:
          closed: [] as any,
        }
      )

      // todo: clear undefined from outstanding if using `delete`
      return reportsByStatus
    }),

  byId: canEditReports
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { user } = ctx.session
      const { supervisees } = ctx

      const report = await db.query.Reports.findFirst({
        where(fields) {
          return eq(fields.id, input.id)
        },
        columns: {
          id: true,
          userId: true,
          contributorId: true,
          startOfWeek: true,
          timeOff: true,
        },
        with: {
          reportsToMilestones: {
            columns: {
              timeSpent: true,
            },
            with: {
              milestone: true,
            },
          },
        },
      })

      if (!report) {
        return notFound()
      }

      if (
        report.contributorId !== user.contributorId &&
        !supervisees.find(
          contributor => contributor.id === report.contributorId
        )
      ) {
        return notFound()
      }

      return {
        id: report.id,
        userId: report.userId,
        contributorId: report.contributorId,
        startOfWeek: report.startOfWeek,
        timeOff: report.timeOff,
        milestones: report.reportsToMilestones.map(
          ({ milestone, timeSpent }) => ({
            ...milestone,
            timeSpent,
          })
        ),
      }
    }),

  create: canEditReports
    .input(createReportSchema)
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.session

      await db.transaction(async trx => {
        const [newReport] = await trx
          .insert(Reports)
          .values({
            userId: user.id,
            contributorId: input.contributorId,
            startOfWeek: startOfWeek(new UTCDate(input.startOfWeek), {
              weekStartsOn: 1,
            }),
            timeOff: input.timeOff,
          })
          .returning()

        if (input.milestones && input.milestones.length > 0) {
          await trx.insert(ReportsToMilestones).values(
            input.milestones.map(milestone => ({
              reportId: newReport.id,
              milestoneId: milestone.id,
              timeSpent: milestone.timeSpent,
            }))
          )
        }
      })
    }),

  update: canEditReports
    .input(
      z.object({
        id: z.number(),
        values: updateReportSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.session

      const { values } = input

      const [updatedReport] = await db
        .update(Reports)
        .set({ timeOff: values.timeOff })
        .where(and(eq(Reports.id, input.id), eq(Reports.userId, user.id)))
        .returning()

      const currentMilestones = await db.query.ReportsToMilestones.findMany({
        where(fields, op) {
          return op.eq(fields.reportId, input.id)
        },
      })

      const currentMilestoneIds = currentMilestones.map(
        ({ milestoneId }) => milestoneId
      )
      const inputMilestonesIds = values.milestones.map(({ id }) => id)
      const toInsert = values.milestones.filter(
        ({ id }) => !currentMilestoneIds.includes(id)
      )
      const toDelete = currentMilestones.filter(
        ({ milestoneId }) => !inputMilestonesIds.includes(milestoneId)
      )
      const toUpdate = currentMilestones.filter(({ milestoneId, timeSpent }) =>
        values.milestones.find(
          m => m.id === milestoneId && m.timeSpent !== timeSpent
        )
      )

      if (
        toInsert.length === 0 &&
        toDelete.length === 0 &&
        toUpdate.length === 0
      ) {
        return updatedReport
      }

      await db.transaction(async trx => {
        if (toInsert.length > 0) {
          await trx.insert(ReportsToMilestones).values(
            toInsert.map(({ id, timeSpent }) => ({
              milestoneId: id,
              reportId: updatedReport.id,
              timeSpent,
            }))
          )
        }

        if (toUpdate.length > 0) {
          for (const milestone of toUpdate) {
            const timeSpent = values.milestones.find(
              ({ id }) => id === milestone.milestoneId
            )?.timeSpent

            if (timeSpent) {
              await trx
                .update(ReportsToMilestones)
                .set({ timeSpent })
                .where(
                  and(
                    eq(ReportsToMilestones.reportId, updatedReport.id),
                    eq(ReportsToMilestones.milestoneId, milestone.milestoneId)
                  )
                )
            }
          }
        }

        if (toDelete.length > 0) {
          await trx.delete(ReportsToMilestones).where(
            and(
              eq(ReportsToMilestones.reportId, updatedReport.id),
              inArray(
                ReportsToMilestones.milestoneId,
                toDelete.map(({ milestoneId }) => milestoneId)
              )
            )
          )
        }
      })
    }),

  delete: canEditReports
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .delete(ReportsToMilestones)
        .where(eq(ReportsToMilestones.reportId, input.id))

      await db.delete(Reports).where(eq(Reports.id, input.id)).returning()
    }),
})
