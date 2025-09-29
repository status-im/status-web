// note: https://orm.drizzle.team/learn/tutorials/drizzle-with-frameworks/drizzle-nextjs-neon#project-file-structure project file structure example
import 'server-only'

import { createPool } from '@vercel/postgres'
import { drizzle } from 'drizzle-orm/vercel-postgres'

import { serverEnv } from '~/config/env.server.mjs'

import * as schema from './schema'

/**
 * >Creating a client is preferred over the sql helper if you need to make multiple queries or want to run transactions, as sql will connect for every query.
 * >– https://vercel.com/docs/storage/vercel-postgres/sdk#db
 */
const client = createPool({
  connectionString: serverEnv.POSTGRES_URL,
})

export const db = drizzle(client, { schema })
