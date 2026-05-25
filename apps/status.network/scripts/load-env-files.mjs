import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const ENV_FILES = [
  '.env',
  '.env.local',
  '.env.production',
  '.env.production.local',
]

/**
 * Loads env files in order (later files override earlier ones).
 * Mirrors Next.js precedence for local tooling scripts.
 */
export function loadEnvFiles(root = APP_ROOT) {
  for (const file of ENV_FILES) {
    const path = resolve(root, file)
    if (!existsSync(path)) {
      continue
    }

    const content = readFileSync(path, 'utf8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) {
        continue
      }

      const separator = trimmed.indexOf('=')
      if (separator === -1) {
        continue
      }

      const key = trimmed.slice(0, separator).trim()
      let value = trimmed.slice(separator + 1).trim()

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }

      process.env[key] = value
    }
  }
}
