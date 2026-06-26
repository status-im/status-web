import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

import type { ZodTypeAny, infer as zInfer } from 'zod'

import { GET_SITE_CONTENT_DIR } from '../site'

const CONTENT_ROOT_ENV = 'STATUS_CONTENT_ROOT'
const SEARCH_DEPTH = 4

let configuredRoot: string | null = null

/**
 * Override the content root explicitly. Apps that build from a non-standard
 * cwd (scripts, tests) call this before any loader.
 */
export const setContentRoot = (root: string): void => {
  configuredRoot = root
}

const WORKSPACE_MARKERS = ['pnpm-workspace.yaml', 'turbo.json'] as const

const isWorkspaceRoot = (dir: string): boolean =>
  WORKSPACE_MARKERS.some((marker) => existsSync(resolve(dir, marker)))

/**
 * Resolution order:
 *   1. `setContentRoot(...)` (highest priority — explicit caller intent).
 *   2. `STATUS_CONTENT_ROOT` env var.
 *   3. Walk up from `process.cwd()` for the workspace root (identified by
 *      `pnpm-workspace.yaml` or `turbo.json`) and use `content/get.status.app/`.
 */
export const getContentRoot = (): string => {
  if (configuredRoot) return configuredRoot
  const fromEnv = process.env[CONTENT_ROOT_ENV]
  if (fromEnv) return fromEnv

  let dir = process.cwd()
  for (let i = 0; i <= SEARCH_DEPTH; i++) {
    if (isWorkspaceRoot(dir)) {
      const candidate = resolve(dir, GET_SITE_CONTENT_DIR)
      if (existsSync(candidate)) return candidate
      throw new Error(
        `workspace root found at ${dir} but no ${GET_SITE_CONTENT_DIR}/ directory exists; create one or set ${CONTENT_ROOT_ENV}`
      )
    }
    const parent = resolve(dir, '..')
    if (parent === dir) break
    dir = parent
  }
  throw new Error(
    `content root not found from cwd "${process.cwd()}"; set ${CONTENT_ROOT_ENV} or call setContentRoot()`
  )
}

export const contentPath = (...segments: string[]): string => {
  return resolve(getContentRoot(), ...segments)
}

/**
 * Distinguishes "the requested content file does not exist" (404 territory)
 * from genuine read/parse failures (which should bubble up to the
 * route's `error.tsx` boundary). Page code can `instanceof` check this to
 * decide between `notFound()` and re-throwing.
 */
export class ContentNotFoundError extends Error {
  readonly filePath: string
  constructor(filePath: string) {
    super(`content file not found: ${filePath}`)
    this.name = 'ContentNotFoundError'
    this.filePath = filePath
  }
}

const isFsNotFound = (err: unknown): boolean =>
  typeof err === 'object' &&
  err !== null &&
  'code' in err &&
  (err as { code: unknown }).code === 'ENOENT'

export const readJson = async <S extends ZodTypeAny>(
  filePath: string,
  schema: S
): Promise<zInfer<S>> => {
  let raw: string
  try {
    raw = await readFile(filePath, 'utf-8')
  } catch (err) {
    if (isFsNotFound(err)) {
      throw new ContentNotFoundError(filePath)
    }
    const reason = err instanceof Error ? err.message : String(err)
    throw new Error(`failed to read ${filePath}: ${reason}`, { cause: err })
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err)
    throw new Error(`invalid JSON at ${filePath}: ${reason}`, { cause: err })
  }

  const result = schema.safeParse(parsed)
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join('.') || '<root>'}: ${issue.message}`)
      .join('; ')
    throw new Error(`schema validation failed at ${filePath}: ${issues}`)
  }
  return result.data
}

export const listDirectories = async (parent: string): Promise<string[]> => {
  if (!existsSync(parent)) return []
  const entries = await readdir(parent, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
}
