import type { clientEnv } from './src/config/env.client.mjs'
import type { serverEnv } from './src/config/env.server.mjs'

type Env = typeof clientEnv & typeof serverEnv

declare global {
  namespace NodeJS {
    /* eslint-disable @typescript-eslint/no-empty-object-type */
    interface ProcessEnv extends Env {}
    /* eslint-enable @typescript-eslint/no-empty-object-type */
  }
  /**
   * Referenced in codegen.yml#config.errorType
   */
  interface GraphqlApiError {
    response?: {
      errors?: {
        extensions: { code?: string; [key: string]: string }
        locations: { column: number; line: number }[]
        message: string
        path: string[]
      }[]
    }
  }
}
