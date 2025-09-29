import {
  authProcedure,
  createCallerFactory,
  publicProcedure,
  router,
} from './lib/trpc'
import { epicsRouter as epics } from './routers/epics'
import { projectsRouter as projects } from './routers/projects'
import { releasesRouter as releases } from './routers/releases'
import { reportsRouter as reports } from './routers/reports'
import { workstreamsRouter as workstreams } from './routers/workstreams'

export const apiRouter = router({
  ping: publicProcedure.query(() => 'pong'),
  user: authProcedure.query(({ ctx }) => {
    return ctx.session.user
  }),
  workstreams,
  releases,
  epics,
  projects,
  reports,
})

export type ApiRouter = typeof apiRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.releases.all();
 *       ^? Release[]
 */
export const createCaller = createCallerFactory(apiRouter)
