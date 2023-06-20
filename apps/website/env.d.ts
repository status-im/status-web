import type { env } from './src/config/env.mjs'

type Env = typeof env

declare global {
  namespace NodeJS {
    /* eslint-disable @typescript-eslint/no-empty-interface */
    interface ProcessEnv extends Env {}
    /* eslint-enable @typescript-eslint/no-empty-interface */
  }
}
