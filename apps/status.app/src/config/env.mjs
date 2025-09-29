// note: ensures loadEnvConfig is evaluated before env.server.mjs or env.client.mjs when a module is not imported via Next.js (e.g. drizzle.config.ts or local debugging)

import { loadEnvConfig } from '@next/env'

import path from 'node:path'
import process from 'node:process'

loadEnvConfig(
  path.resolve(process.cwd()),
  process.env.NODE_ENV !== 'production'
)
