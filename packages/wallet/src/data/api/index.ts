import { createCallerFactory, router } from './lib/trpc'
import { assetsRouter as assets } from './routers/assets'
import { collectiblesRouter as collectibles } from './routers/collectibles'
import { nodesRouter as nodes } from './routers/nodes'

export const apiRouter = router({
  assets,
  collectibles,
  nodes,
})

export type ApiRouter = typeof apiRouter

export const createCaller: ReturnType<typeof createCallerFactory<ApiRouter>> =
  createCallerFactory(apiRouter)
