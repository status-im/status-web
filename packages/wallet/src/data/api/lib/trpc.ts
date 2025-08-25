import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'

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
  isServer: true,
  allowOutsideOfServer: false,
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
export const { createCallerFactory } = t

/**
 * 3. ROUTER & PROCEDURES
 *
 * @see https://trpc.io/docs/router
 */
export const router = t.router

const errorMiddleware = t.middleware(async opts => {
  const result = await opts.next()

  if (!result.ok && result.error) {
    const error = result.error.cause

    if (error instanceof Error && error.cause === 429) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: error.message,
        cause: error,
      })
    }

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: error?.message || 'Unknown error',
      cause: error,
    })
  }

  return result
})

/**
 * Unauthenticated procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(errorMiddleware)
