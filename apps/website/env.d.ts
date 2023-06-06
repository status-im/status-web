/* eslint-disable @typescript-eslint/consistent-type-imports */
import { envSchema } from 'env.mjs'

/* eslint-enable @typescript-eslint/consistent-type-imports */
import type { z } from 'zod'

type EnvSchemaType = z.infer<typeof envSchema>

declare global {
  namespace NodeJS {
    /* eslint-disable @typescript-eslint/no-empty-interface */
    interface ProcessEnv extends EnvSchemaType {}
    /* eslint-enable @typescript-eslint/no-empty-interface */
  }
}
