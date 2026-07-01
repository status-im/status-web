import type { FileChange } from '@status-im/content/github'

export interface FixturePair {
  indexChange: FileChange
  localeChange: FileChange
}

export const stripEmpty = <T extends Record<string, unknown>>(obj: T): T => {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === '') continue
    if (Array.isArray(value) && value.length === 0) continue
    out[key] = value
  }
  return out as T
}

export const toIsoDateOrUndefined = (
  raw: string | null | undefined
): string | undefined => {
  if (!raw) return undefined

  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return undefined

  return date.toISOString()
}

export const toJsonFileChange = (path: string, value: unknown): FileChange => ({
  path,
  content: `${JSON.stringify(value, null, 2)}\n`,
})

export const createFixturePair = ({
  locale,
  targetDir,
  indexValue,
  localeValue,
}: {
  locale: string
  targetDir: string
  indexValue: unknown
  localeValue: unknown
}): FixturePair => ({
  indexChange: toJsonFileChange(`${targetDir}/index.json`, indexValue),
  localeChange: toJsonFileChange(`${targetDir}/${locale}.json`, localeValue),
})

export const createFixtureDeleteChanges = (
  targetDir: string,
  locale = 'en'
): FileChange[] => [
  { path: `${targetDir}/index.json`, deleted: true },
  { path: `${targetDir}/${locale}.json`, deleted: true },
]
