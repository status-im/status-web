import { initTRPC } from '@trpc/server'
import { notFound } from 'next/navigation'
import superjson from 'superjson'
import { ZodError } from 'zod'

import { auth } from '~server/services/auth'
import { getContributors } from '~server/services/bamboohr'

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export async function createTRPCContext(opts: { headers: Headers }) {
  return {
    headers: opts.headers,
  }
}

type ApiContext = Awaited<ReturnType<typeof createTRPCContext>>

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<ApiContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory

/**
 * 3. ROUTER & PROCEDURES
 *
 * @see https://trpc.io/docs/router
 */
export const router = t.router

/**
 * Unauthenticated procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure

/**
 * Authenticated procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const authProcedure = publicProcedure.use(async ({ next }) => {
  const session = await auth()

  return next({
    ctx: {
      session,
    },
  })
})

export const canViewInsights = authProcedure.use(({ ctx, next }) => {
  if (!ctx.session.user.canViewInsights) {
    return notFound()
  }

  return next()
})

export const canEditInsights = authProcedure.use(({ ctx, next }) => {
  if (!ctx.session.user.canEditInsights) {
    return notFound()
  }

  return next()
})

export const canViewKeycard = authProcedure.use(({ ctx, next }) => {
  if (!ctx.session.user.canViewKeycard) {
    return notFound()
  }

  return next()
})

export const canEditKeycard = authProcedure.use(({ ctx, next }) => {
  if (!ctx.session.user.canEditKeycard) {
    return notFound()
  }

  return next()
})

export const canEditReports = authProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session.user.canEditReports) {
    return notFound()
  }

  const { user } = ctx.session

  const contributors = await getContributors()

  const userContributorInfo = contributors.find(
    contributor => contributor.workEmail === user.email
  )

  if (!userContributorInfo) {
    return notFound()
  }

  const supervisees = contributors.filter(
    contributor => contributor.supervisorEmail === userContributorInfo.workEmail
  )

  return next({
    ctx: { userContributorInfo, supervisees },
  })
})
