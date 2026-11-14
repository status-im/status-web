// Load local environment values for tools that run outside Next.js, such as Drizzle.

import { loadEnvConfig } from '@next/env'

import path from 'node:path'
import process from 'node:process'

loadEnvConfig(
  path.resolve(process.cwd()),
  process.env.NODE_ENV !== 'production'
)
