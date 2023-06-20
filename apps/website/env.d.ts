import type { envClient } from './src/config/env.client.mjs'
import type { envServer } from './src/config/env.server.mjs'

type Env = typeof envClient & typeof envServer

declare global {
  namespace NodeJS {
    /* eslint-disable @typescript-eslint/no-empty-interface */
    interface ProcessEnv extends Env {}
    /* eslint-enable @typescript-eslint/no-empty-interface */
  }
}
