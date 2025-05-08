import type { serverEnv } from './src/config/env.server.mjs'

type Env = typeof serverEnv

declare global {
  namespace NodeJS {
    /* eslint-disable @typescript-eslint/no-empty-object-type */
    interface ProcessEnv extends Env {}
    /* eslint-enable @typescript-eslint/no-empty-object-type */
  }
}
