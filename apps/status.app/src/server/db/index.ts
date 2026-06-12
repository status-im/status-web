// note: https://orm.drizzle.team/docs/get-started-postgresql#node-postgres
import 'server-only'

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { serverEnv } from '~/config/env.server.mjs'

import * as schema from './schema'

/**
 * Single pg Pool reused across requests. Works against any Postgres
 * (self-hosted, RDS, Neon over the TCP protocol, etc.).
 *
 * `connectionString` is optional during `next build` (runtime-only secret);
 * pg lazily connects on the first query.
 */
const pool = new Pool({
  connectionString: serverEnv.POSTGRES_URL,
})

export const db = drizzle(pool, { schema })
