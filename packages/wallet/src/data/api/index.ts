import { createCallerFactory, router } from './lib/trpc'
import { activitiesRouter as activities } from './routers/activity'
import { assetsRouter as assets } from './routers/assets'
import { collectiblesRouter as collectibles } from './routers/collectibles'
import { configRouter as config } from './routers/config'
import { marketRouter as market } from './routers/market'
import { nodesRouter as nodes } from './routers/nodes'
import { rpcRouter as rpc } from './routers/rpc'

export const apiRouter = router({
  assets,
  collectibles,
  nodes,
  activities,
  config,
  market,
  rpc,
})

export type ApiRouter = typeof apiRouter

export const createCaller: ReturnType<typeof createCallerFactory<ApiRouter>> =
  createCallerFactory(apiRouter)

export { createTRPCContext } from './lib/trpc'
