import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@payload-config'

interface HealthErrorDetail {
  cause?: HealthErrorDetail
  code?: string
  message: string
  name?: string
}

const getStringProperty = (
  value: unknown,
  property: string
): string | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined
  }

  const propertyValue = (value as Record<string, unknown>)[property]
  return typeof propertyValue === 'string' ? propertyValue : undefined
}

const getCause = (value: unknown): unknown => {
  if (!value || typeof value !== 'object') {
    return undefined
  }

  return (value as Record<string, unknown>).cause
}

const formatError = (error: unknown): HealthErrorDetail => ({
  ...(getCause(error) ? { cause: formatError(getCause(error)) } : {}),
  ...(getStringProperty(error, 'code')
    ? { code: getStringProperty(error, 'code') }
    : {}),
  message: error instanceof Error ? error.message : String(error),
  ...(getStringProperty(error, 'name')
    ? { name: getStringProperty(error, 'name') }
    : {}),
})

const getDatabaseDiagnostics = () => {
  let database:
    | {
        host: string
        pathname: string
        port: string
        protocol: string
        usernameShape: 'project-ref' | 'plain' | 'empty'
      }
    | { parseError: string }

  try {
    const url = new URL(process.env.DATABASE_URL || '')
    database = {
      host: url.hostname,
      pathname: url.pathname,
      port: url.port || '(default)',
      protocol: url.protocol,
      usernameShape: url.username
        ? url.username.includes('.')
          ? 'project-ref'
          : 'plain'
        : 'empty',
    }
  } catch (error) {
    database = {
      parseError: error instanceof Error ? error.message : String(error),
    }
  }

  return {
    database,
    pool: {
      connectionTimeoutMs:
        process.env.PAYLOAD_DB_CONNECTION_TIMEOUT_MS || '5000',
      idleTimeoutMs: process.env.PAYLOAD_DB_IDLE_TIMEOUT_MS || '5000',
      max: process.env.PAYLOAD_DB_POOL_MAX || 'default',
      queryTimeoutMs: process.env.PAYLOAD_DB_QUERY_TIMEOUT_MS || '15000',
    },
    schema: process.env.PAYLOAD_DB_SCHEMA || 'payload',
    vercel: {
      env: process.env.VERCEL_ENV || null,
      region: process.env.VERCEL_REGION || null,
    },
  }
}

const healthTimeoutMs = (() => {
  const value = Number.parseInt(
    process.env.PAYLOAD_HEALTH_TIMEOUT_MS || '10000',
    10
  )

  if (!Number.isInteger(value) || value < 1) {
    throw new Error('PAYLOAD_HEALTH_TIMEOUT_MS must be a positive integer')
  }

  return value
})()

const withTimeout = async <T>(
  operation: Promise<T>,
  label: string
): Promise<T> => {
  let timeout: ReturnType<typeof setTimeout> | undefined

  try {
    return await Promise.race([
      operation,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => {
          reject(new Error(`${label} timed out after ${healthTimeoutMs}ms`))
        }, healthTimeoutMs)
      }),
    ])
  } finally {
    if (timeout) {
      clearTimeout(timeout)
    }
  }
}

/**
 * GET /api/health
 *
 * Lightweight health probe. Performs one cheap DB read so external uptime
 * monitors (UptimeRobot, Vercel Cron, etc.) can poll this URL on a schedule
 * to:
 *   1. Verify CMS + DB are reachable from the public internet.
 *   2. Keep the backing Postgres project warm when the provider idles
 *      inactive databases.
 *
 * Public, unauthenticated. Returns no internal detail beyond OK / not-OK so
 * it is safe to expose. Cache disabled — every poll must hit the DB to be
 * meaningful as a keep-alive.
 *
 * Response:
 *   200 { ok: true,  db: "ok",   latencyMs: number }
 *   503 { ok: false, db: "down", error: string }
 */
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const GET = async (): Promise<NextResponse> => {
  const startedAt = Date.now()
  try {
    const payload = await withTimeout(getPayload({ config }), 'getPayload')
    await withTimeout(payload.db.pool.query('select 1 as ok'), 'database ping')
    return NextResponse.json(
      { ok: true, db: 'ok', latencyMs: Date.now() - startedAt },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        db: 'down',
        detail: formatError(err),
        diagnostics: getDatabaseDiagnostics(),
        error: err instanceof Error ? err.message : String(err),
        latencyMs: Date.now() - startedAt,
      },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
