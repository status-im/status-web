import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import type { CollectionConfig } from 'payload'

import { ContentChangeRequests } from './src/collections/ContentChangeRequests'
import { Media } from './src/collections/Media'
import { Pages } from './src/collections/Pages'
import {
  SiteFooterContent,
  SiteNavigationContent,
  SiteSettingsContent,
} from './src/collections/SiteContent'
import { Users } from './src/collections/Users'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const isProduction = process.env.NODE_ENV === 'production'
const isVercel = Boolean(process.env.VERCEL)

if (isProduction && !isVercel) {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) {
    throw new Error(
      'NEXT_PUBLIC_SERVER_URL is required in production (self-hosted) — set it to the public CMS origin (e.g. https://cms.example.com).'
    )
  }
  if (!process.env.NEXT_PUBLIC_WEB_URL) {
    throw new Error(
      'NEXT_PUBLIC_WEB_URL is required in production (self-hosted) — set it to the public web origin used for CORS / CSRF.'
    )
  }
}

const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3010')

const frontendURL = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3005'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is required (postgresql:// connection string). ' +
      'For local dev copy apps/cms/.env.example to apps/cms/.env and fill it in.'
  )
}

const payloadSecret = process.env.PAYLOAD_SECRET
if (isProduction && !payloadSecret) {
  throw new Error(
    'PAYLOAD_SECRET environment variable is required in production'
  )
}

const defaultDatabasePoolMax = isVercel ? '3' : isProduction ? '10' : '3'
const databasePoolMax = Number.parseInt(
  process.env.PAYLOAD_DB_POOL_MAX || defaultDatabasePoolMax,
  10
)
if (!Number.isInteger(databasePoolMax) || databasePoolMax < 1) {
  throw new Error('PAYLOAD_DB_POOL_MAX must be a positive integer')
}

const parsePositiveIntEnv = (name: string, fallback: number): number => {
  const rawValue = process.env[name]
  if (!rawValue) {
    return fallback
  }

  const value = Number.parseInt(rawValue, 10)
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${name} must be a positive integer`)
  }

  return value
}

const databaseConnectionTimeoutMs = parsePositiveIntEnv(
  'PAYLOAD_DB_CONNECTION_TIMEOUT_MS',
  5000
)
const databaseQueryTimeoutMs = parsePositiveIntEnv(
  'PAYLOAD_DB_QUERY_TIMEOUT_MS',
  15000
)
const databaseIdleTimeoutMs = parsePositiveIntEnv(
  'PAYLOAD_DB_IDLE_TIMEOUT_MS',
  5000
)

const disableDocumentLocks = (
  collection: CollectionConfig
): CollectionConfig => ({
  ...collection,
  lockDocuments: false,
})

const collections = [
  Users,
  Media,
  Pages,
  SiteSettingsContent,
  SiteNavigationContent,
  SiteFooterContent,
  ContentChangeRequests,
].map(disableDocumentLocks)

export default buildConfig({
  admin: {
    meta: {
      icons: '/favicon.ico',
    },
    user: Users.slug,
  },
  collections,
  cors: [serverURL, frontendURL],
  csrf: [serverURL, frontendURL],
  db: postgresAdapter({
    pool: {
      connectionString: databaseUrl,
      connectionTimeoutMillis: databaseConnectionTimeoutMs,
      idleTimeoutMillis: databaseIdleTimeoutMs,
      max: databasePoolMax,
      query_timeout: databaseQueryTimeoutMs,
      statement_timeout: databaseQueryTimeoutMs,
    },
    schemaName: process.env.PAYLOAD_DB_SCHEMA || 'payload',
    push: process.env.PAYLOAD_DB_PUSH !== 'false',
  }),
  editor: lexicalEditor(),
  secret: payloadSecret || 'dev-only-insecure-secret',
  serverURL,
  typescript: {
    declare: false,
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
})
