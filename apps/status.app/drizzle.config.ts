import './src/config/env.mjs'

import { defineConfig } from 'drizzle-kit'

import { serverEnv } from './src/config/env.server.mjs'

export default defineConfig({
  // note: https://orm.drizzle.team/kit-docs/conf#schema-files-paths
  schema: './src/server/db/schema/*',
  out: './migrations',
  dialect: 'postgresql',
  // strict: true,
  dbCredentials: {
    url: serverEnv.POSTGRES_URL,
  },
  // Print all statements
  verbose: true,
  // Always ask for my confirmation
  strict: true,
})
