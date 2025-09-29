import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { z } from 'zod'

import { db } from '~server/db'
import { MilestonesToEpics } from '~server/db/schema'
import { Epics } from '~server/db/schema/epics'

import { canEditInsights, canViewInsights, router } from '../lib/trpc'
import { epicSchema } from '../validation/epics'

export const epicsRouter = router({
  all: canViewInsights.query(async () => {
    const epics = await db.query.Epics.findMany({
      orderBy: (fields, { asc }) => [asc(fields.createdAt)],
    })
    return epics
  }),

  byId: canViewInsights
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const epic = await db.query.Epics.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, input.id)
        },
      })

      if (!epic) {
        return notFound()
      }

      return epic
    }),

  create: canEditInsights.input(epicSchema).mutation(async ({ input }) => {
    const [newEpic] = await db.insert(Epics).values(input).returning()
    return newEpic
  }),

  update: canEditInsights
    .input(
      z.object({
        id: z.number(),
        values: epicSchema,
      })
    )
    .mutation(async ({ input }) => {
      const [updatedEpic] = await db
        .update(Epics)
        .set(input.values)
        .where(eq(Epics.id, input.id))
        .returning()

      return updatedEpic
    }),

  delete: canEditInsights
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await db.transaction(async tx => {
        await tx
          .delete(MilestonesToEpics)
          .where(eq(MilestonesToEpics.epicId, input.id))

        await tx.delete(Epics).where(eq(Epics.id, input.id))
      })

      return input.id
    }),
})
