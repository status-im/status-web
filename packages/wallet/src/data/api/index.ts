import { createCallerFactory, router } from './lib/trpc'
import { assetsRouter as assets } from './routers/assets'
import { collectiblesRouter as collectibles } from './routers/collectibles'

export const apiRouter = router({
  assets,
  collectibles,
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
