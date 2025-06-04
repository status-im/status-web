import { createCallerFactory, router } from './lib/trpc'
import { assetsRouter as assets } from './routers/assets'
import { collectiblesRouter as collectibles } from './routers/collectibles'

export const apiRouter = router({
  assets,
  collectibles,
})

export type ApiRouter = typeof apiRouter

export const createCaller: ReturnType<typeof createCallerFactory<ApiRouter>> =
  createCallerFactory(apiRouter)
